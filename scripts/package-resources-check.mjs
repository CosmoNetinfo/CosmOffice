// Ispezione dei pacchetti costruiti, senza installare o avviare gli editor.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),asar=require('@electron/asar');
const {version}=JSON.parse(fs.readFileSync('package.json'));
const root=path.resolve(`test-results/package-legal-${randomUUID()}`);fs.mkdirSync(root,{recursive:true});
const checked=[];
function verify(resources,label){
 const hashes={};for(const name of ['LICENSE','THIRD_PARTY_NOTICES.txt']){const actual=fs.readFileSync(path.join(resources,name)),expected=fs.readFileSync(name);assert.deepEqual(actual,expected,label+': '+name);hashes[name]=createHash('sha256').update(actual).digest('hex');}
 const archive=path.join(resources,'app.asar'),pkg=JSON.parse(asar.extractFile(archive,'package.json').toString());assert.equal(pkg.version,version);assert.equal(pkg.license,'SEE LICENSE IN LICENSE');assert.equal(pkg.author.name,'Daniele Spalletti');assert.deepEqual(asar.extractFile(archive,'LICENSE'),fs.readFileSync('LICENSE'));
 checked.push({package:label,version,hashes,resources:'LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti',asarLicense:true});
}
function seven(){const full='C:/Program Files/7-Zip/7z.exe';return fs.existsSync(full)?full:require('7zip-bin').path7za;}
function list(file){return [...execFileSync(seven(),['l','-slt',file],{encoding:'utf8',maxBuffer:20*1024**2}).matchAll(/^Path = (.+)$/gm)].map(m=>m[1].trim());}
function extract(archive,entry,out){fs.mkdirSync(out,{recursive:true});execFileSync(seven(),['e','-y',`-o${out}`,archive,entry],{stdio:'pipe'});return path.join(out,path.basename(entry.replaceAll('\\','/')));}
if(process.argv.includes('--directory'))verify(path.resolve('release/win-unpacked/resources'),'directory Windows');
else if(process.platform==='win32'){
 const name=`CosmOffice-${version}-win-x64-Setup.exe`,file=path.resolve('release',name),entry=list(file).find(p=>p.endsWith('app-64.7z'));assert.ok(entry,'payload NSIS');
 const payload=extract(file,entry,root),paths=list(payload);
 for(const name of ['LICENSE','THIRD_PARTY_NOTICES.txt','app.asar']){const entry=paths.find(p=>new RegExp(`(^|[\\\\/])resources[\\\\/]${name.replaceAll('.','\\.')}$$`,'i').test(p));assert.ok(entry,name);extract(payload,entry,path.join(root,'resources'));}
 verify(path.join(root,'resources'),name);
}else if(process.platform==='linux'){
 const name=`CosmOffice-${version}-linux-x86_64.AppImage`,file=path.resolve('release',name);fs.chmodSync(file,0o755);
 execFileSync(file,['--appimage-extract','resources/*'],{cwd:root,stdio:'pipe'});verify(path.join(root,'squashfs-root','resources'),name);
}else if(process.platform==='darwin'){
 const requestedArch=process.env.COSMO_PACKAGE_MAC_ARCH;
 if(requestedArch&&!['x64','arm64'].includes(requestedArch))throw Error('Architettura Mac del controllo non valida.');
 for(const arch of requestedArch?[requestedArch]:['x64','arm64']){
  const name=`CosmOffice-${version}-mac-${arch}.dmg`,file=path.resolve('release',name),mount=path.join(root,arch);fs.mkdirSync(mount);
  execFileSync('hdiutil',['attach','-readonly','-nobrowse','-mountpoint',mount,file],{stdio:'pipe'});
  try{verify(path.join(mount,'CosmOffice.app','Contents','Resources'),name);}finally{execFileSync('hdiutil',['detach',mount],{stdio:'pipe'});}
 }
}else throw Error('Piattaforma del test non supportata');
assert.ok(checked.length);const report={result:'PASS',checked,installed:false};fs.writeFileSync(path.resolve(`test-results/package-legal-${process.argv.includes('--directory')?'directory':process.platform}.json`),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
