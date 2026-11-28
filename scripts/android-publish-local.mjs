// Owner-run publication. Signing key/password never leave the computer.
import{readFile,writeFile,mkdir}from'node:fs/promises';import{execFileSync,spawnSync}from'node:child_process';import{createHash}from'node:crypto';import{resolve,join}from'node:path';import assert from'node:assert/strict';
import{ANDROID_VERSION,ANDROID_CODE,ANDROID_TAG,ANDROID_APK,androidManifest,androidNotes}from'./android-release-data.mjs';
const repo='CosmoNetinfo/CosmOffice',base='https://api.github.com/repos/'+repo;
assert.equal(execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),'main');assert.equal(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),'','Pubblicazione solo da albero pulito');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const credential=spawnSync('git',['credential','fill'],{input:'url=https://github.com/'+repo+'.git\n\n',encoding:'utf8',windowsHide:true,timeout:25000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}});
const secret=Object.fromEntries((credential.stdout||'').split('\n').filter(l=>l.includes('=')).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1).trim()]));
if(credential.status!==0||!secret.password)throw Error('Autenticazione GitHub non disponibile; nessuna credenziale stampata.');
async function api(path,{method='GET',body,binary=false}={}) {
 const url=path.startsWith('https:')?new URL(path):new URL(base+path);
 if(!['api.github.com','uploads.github.com'].includes(url.hostname)||url.protocol!=='https:'||!url.pathname.startsWith('/repos/'+repo+'/'))throw Error('Destinazione pubblicazione vietata.');
 const response=await fetch(url,{method,redirect:'manual',signal:AbortSignal.timeout(120000),headers:{Authorization:'Bearer '+secret.password,'User-Agent':'CosmOffice-publisher',Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':binary?'application/octet-stream':'application/json'}:{})},body:body?(binary?body:JSON.stringify(body)):undefined});
 if(response.status===404)return null;if(!response.ok)throw Error('GitHub pubblicazione HTTP '+response.status+' ('+method+').');return response.json();
}
const runs=await api('/actions/runs?head_sha='+head+'&per_page=20');
for(const name of ['APK Android offline','Build e verifica CosmOffice'])assert.ok(runs.workflow_runs.some(r=>r.name===name&&r.head_sha===head&&r.status==='completed'&&r.conclusion==='success'),'CI non verde: '+name);
const signing=JSON.parse(await readFile('test-results/android/signing.json','utf8'));
const apkPath=resolve('release/android/CosmOffice-'+ANDROID_VERSION+'-android-'+signing.unsignedSha256.slice(0,12)+'.apk');
const apk=await readFile(apkPath),hash=bytes=>createHash('sha256').update(bytes).digest('hex');assert.equal(hash(apk),signing.apkSha256);
const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT;if(!sdk||!process.env.JAVA_HOME)throw Error('Imposta ANDROID_HOME e JAVA_HOME per verificare il vero APK.');
const tools=join(sdk,'build-tools/35.0.0');const info=execFileSync(join(tools,process.platform==='win32'?'aapt.exe':'aapt'),['dump','badging',apkPath],{encoding:'utf8'});assert.ok(info.includes("versionCode='"+ANDROID_CODE+"'")&&info.includes("name='it.cosmonet.cosmoffice'"));
const cert=execFileSync(join(process.env.JAVA_HOME,'bin',process.platform==='win32'?'java.exe':'java'),['-jar',join(tools,'lib/apksigner.jar'),'verify','--print-certs',apkPath],{encoding:'utf8'}).match(/certificate SHA-256 digest: ([a-f\d]+)/i)?.[1];assert.equal(cert,signing.certificateSha256);
const verified=JSON.parse(await readFile('test-results/android/publish-ci-proof.json','utf8'));assert.equal(verified.head,head);assert.equal(verified.ciUnsignedSha256,signing.unsignedSha256);assert.equal(verified.result,'PASS','Confronto reale con APK unsigned CI necessario');
const manifest=Buffer.from(JSON.stringify(androidManifest({sha256:hash(apk),certificateSha256:cert,size:apk.length}),null,2)+'\n');
const files=new Map([[ANDROID_APK,apk],['ANDROID-UPDATE.json',manifest]]);for(const[name,bytes]of [...files])files.set(name+'.sha256',Buffer.from(hash(bytes)+'  '+name+'\n'));
files.set('SHA256SUMS.txt',Buffer.from([[ANDROID_APK,apk],['ANDROID-UPDATE.json',manifest]].map(([name,bytes])=>hash(bytes)+'  '+name).join('\n')+'\n'));
const notes=androidNotes(await readFile('CHANGELOG.md','utf8'));
const desktop=await api('/releases/latest');assert.equal(desktop.tag_name,'v0.2.3','La Release desktop latest deve restare invariata');
let release=await api('/releases/tags/'+ANDROID_TAG);
if(release&&!release.draft){for(const[name,bytes]of files){const asset=release.assets.find(a=>a.name===name);assert.ok(asset&&asset.digest==='sha256:'+hash(bytes),'Asset pubblico diverso: nessuna sostituzione');}console.log(release.html_url);process.exit(0);}
if(!release)release=await api('/releases',{method:'POST',body:{tag_name:ANDROID_TAG,target_commitish:head,name:`CosmOffice Android ${ANDROID_VERSION} (anteprima, build ${ANDROID_CODE})`,body:notes,draft:true,prerelease:false,make_latest:'false'}});
assert.equal(release.target_commitish,head,'Bozza di un altro commit: non modificata');
for(const[name,bytes]of files){const old=release.assets.find(a=>a.name===name);if(old){assert.equal(old.digest,'sha256:'+hash(bytes),'Asset bozza diverso: non sovrascritto');continue;}await api(`https://uploads.github.com/repos/${repo}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,{method:'POST',body:bytes,binary:true});}
release=await api('/releases/'+release.id,{method:'PATCH',body:{draft:false,prerelease:false,make_latest:'false',body:notes}});
assert.equal((await api('/releases/latest')).id,desktop.id,'Latest desktop cambiata: verificare prima di dichiarare concluso');
const publicFiles=[];for(const[name,bytes]of files){const url='https://github.com/'+repo+'/releases/download/'+ANDROID_TAG+'/'+name;const response=await fetch(url);if(!response.ok)throw Error('Download pubblico fallito HTTP '+response.status);const downloaded=Buffer.from(await response.arrayBuffer());assert.equal(hash(downloaded),hash(bytes),'Download pubblico con hash diverso');publicFiles.push({name,sha256:hash(bytes),url,anonymousDownload:true});}
await mkdir('test-results/android',{recursive:true});const result={result:'PASS',tag:ANDROID_TAG,head,release:release.html_url,ordinary:!release.prerelease,desktopLatestUnchanged:true,assets:publicFiles};await writeFile('test-results/android/public-release.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
