import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
const packaged = process.env.COSMO_UPDATE_PACKAGE === '1' || process.argv.includes('--package');
const log = resolve(`test-results/update-node-net-${Date.now()}.json`);
const application = await electron.launch({ executablePath: packaged ? resolve('release/win-unpacked/CosmOffice.exe') : executablePath, args: [...(packaged?[]:['.']), '--no-sandbox', `--log-net-log=${log}`, '--net-log-capture-mode=everything'], env: { ...process.env, COSMO_TEST:'1', COSMO_TEST_PROFILE:await testProfile('update-node-profile') } });
let closed=false;
async function audit() {return application.evaluate(({app})=>process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs'))('./offline.cjs').getUpdateAudit());}
try {
  const page=await application.firstWindow();
  await page.getByRole('heading',{name:'Il tuo spazio di lavoro.'}).waitFor();
  await page.getByRole('button',{name:'Impostazioni',exact:true}).click();
  await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();
  const toggle=page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true});
  assert.equal(await toggle.isChecked(),false);assert.deepEqual(await audit(),[]);
  await page.evaluate(()=>{window.updatePhases=[];window.cosmoffice.onUpdate(s=>window.updatePhases.push(s.phase));});
  await toggle.check();
  await page.waitForFunction(()=>window.updatePhases.includes('checking')&&!['checking','downloading'].includes(window.updatePhases.at(-1)),undefined,{timeout:45000});
  const state=await page.evaluate(()=>window.cosmoffice.updateStatus());
  assert.equal(state.enabled,true);assert.ok(['idle','ready','available','unsupported'].includes(state.phase),`Controllo reale non riuscito: ${state.phase}`);
  let downloaded=null;
  if(process.env.COSMO_UPDATE_DOWNLOAD!=='0') downloaded=await application.evaluate(async({app})=>{
    if(process.platform==='darwin')return {skipped:'Mac: soltanto notifica'};
    const path=process.getBuiltinModule('node:path'),fs=process.getBuiltinModule('node:fs/promises');
    const require=process.getBuiltinModule('node:module').createRequire(path.join(app.getAppPath(),'electron/main.cjs'));
    const transport=require('./offline.cjs').createUpdateTransport(),policy=require('./update-policy.cjs');
    const manifest=policy.parseChecksums((await transport.get(policy.SUMS,{name:'SHA256SUMS.txt'})).bytes.toString('utf8'));
    const name=policy.assetName(manifest.version,process.platform,process.arch),expected=manifest.files.get(name);
    if(!name||!expected)throw Error('Pacchetto pubblico mancante per la prova.');
    const file=path.join(app.getPath('userData'),'download-di-verifica.bin');
    try {
      const result=await transport.get(`${policy.ROOT}/download/v${manifest.version}/${name}`,{name,destination:file,limit:1024**3});
      const actual=await require('./updater.cjs').fileHash(file);
      if(actual!==expected||result.sha256!==expected)throw Error('SHA-256 del download reale non valido.');
      return {name,size:result.size,sha256:actual,integrity:true,installed:false};
    }finally{await fs.unlink(file).catch(()=>{});}
  });
  await application.evaluate(async({app})=>{
    const require=process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs'));
    try{await require('./offline.cjs').createUpdateTransport().get('https://example.invalid/raccogli',{name:'SHA256SUMS.txt'});throw Error('Host estraneo accettato');}catch(error){if(!error.message.includes('non consentita'))throw error;}
  });
  const nodeAudit=await audit(),requests=nodeAudit.filter(e=>e.phase==='request'||e.phase==='lookup');
  assert.ok(requests.length>0,'la prova attiva deve effettuare davvero richieste Node');
  for(const event of requests)assert.ok(['github.com','release-assets.githubusercontent.com'].includes(event.host),`Host estraneo contattato: ${event.host}`);
  assert.ok(nodeAudit.some(e=>e.phase==='blocked'&&e.host==='example.invalid'));
  await toggle.uncheck();await page.waitForFunction(()=>window.updatePhases.at(-1)==='disabled');
  assert.equal((await page.evaluate(()=>window.cosmoffice.updateStatus())).enabled,false);
  await page.evaluate(()=>window.cosmoffice.checkUpdates());await page.waitForTimeout(250);
  assert.deepEqual(await audit(),nodeAudit,'spento: nessuna nuova richiesta Node');
  await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.emit('render-process-gone',{}, {reason:'crashed'}));
  await application.close();closed=true;
  const net=JSON.parse(await readFile(log,'utf8')),names=Object.fromEntries(Object.entries(net.constants.logEventTypes).map(([k,v])=>[v,k]));
  const connections=net.events.filter(e=>/^(TCP_CONNECT|TCP_CONNECT_ATTEMPT|UDP_CONNECT|QUIC_SESSION|DNS_TRANSACTION)$/.test(names[e.type]));
  const chromiumRequests=net.events.filter(e=>/^(https?|wss?|ftp):/.test(e.params?.url||''));
  assert.deepEqual(connections,[],'Chromium deve restare senza connessioni anche con aggiornamenti attivi');assert.deepEqual(chromiumRequests,[]);
  const result={result:'PASS',package:packaged,state,downloaded,nodeAudit,hosts:[...new Set(requests.map(e=>e.host))],offRequests:0,chromiumConnections:0,chromiumRequests:0,forbiddenHostBlocked:true};
  await writeFile(`test-results/update-node-${packaged?'package':'electron'}.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){await writeFile('test-results/update-node-error.json',JSON.stringify({audit:await audit().catch(()=>[]),error:error.message},null,2));throw error;}
finally{if(!closed){await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0]?.webContents.emit('render-process-gone',{}, {reason:'crashed'})).catch(()=>{});await application.close();}}
