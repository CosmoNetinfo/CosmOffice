import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
const packaged=process.argv.includes('--package'),reports=[];
for(const legacy of [false,true]) {
 const profile=await testProfile('update-manual');if(legacy)await writeFile(resolve(profile,'updates.json'),JSON.stringify({enabled:true}));
 const log=resolve(`test-results/update-manual-net-${Date.now()}.json`);
 const application=await electron.launch({executablePath:packaged?resolve('release/win-unpacked/CosmOffice.exe'):executablePath,args:[...(packaged?[]:['.']),'--no-sandbox',`--log-net-log=${log}`,'--net-log-capture-mode=everything'],env:{...process.env,COSMO_TEST:'1',COSMO_TEST_PROFILE:profile}});let closed=false;
 async function audit(){return application.evaluate(({app})=>process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs'))('./offline.cjs').getUpdateAudit());}
 try {
  const page=await application.firstWindow();await page.getByRole('heading',{name:'Il tuo spazio di lavoro.'}).waitFor();await page.waitForTimeout(300);
  assert.deepEqual(await audit(),[],'avvio nuovo/vecchio attivo: nessuna richiesta Node');
  await page.getByRole('button',{name:'Impostazioni',exact:true}).click();await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();
  assert.equal(await page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true}).isChecked(),false);
  assert.equal((await page.evaluate(()=>window.cosmoffice.updateStatus())).networkActive,false);
  let downloaded=null,nodeAudit=[];
  if(!legacy){
   await page.evaluate(()=>{window.updateStates=[];window.cosmoffice.onUpdate(s=>window.updateStates.push(s));});
   await page.getByRole('button',{name:'Controlla aggiornamenti ora',exact:true}).click();
   await page.waitForFunction(()=>window.updateStates.some(s=>s.phase==='checking')&&window.updateStates.at(-1)?.networkActive===false,undefined,{timeout:45000});
   const state=await page.evaluate(()=>window.cosmoffice.updateStatus());assert.equal(state.phase,'idle','controllo reale, 0.2.3 non retrocede alla 0.2.2');assert.equal(state.enabled,false);assert.equal(state.networkActive,false);
   await application.evaluate(async({app})=>{
    const require=process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs')),t=require('./offline.cjs').createUpdateTransport(),p=require('./update-policy.cjs');
    try{await t.get(p.SUMS,{name:'SHA256SUMS.txt'});throw Error('Rete rimasta attiva');}catch(e){if(!e.message.includes('disattivato'))throw e;}
    t.setEnabled(true);try{await t.get('https://example.invalid/raccogli',{name:'SHA256SUMS.txt'});throw Error('Host estraneo accettato');}catch(e){if(!e.message.includes('non consentita'))throw e;}finally{await t.setEnabled(false);}
   });
   const cancelled=await page.evaluate(async()=>{const pending=window.cosmoffice.checkUpdates();const result=await window.cosmoffice.cancelUpdate();await pending;return result;});
   assert.equal(cancelled.phase,'disabled');assert.equal(cancelled.networkActive,false);
   // La Release resta 0.2.2: prova separata dei byte reali, senza simulare una nuova Release.
   if(process.env.COSMO_UPDATE_DOWNLOAD!=='0') downloaded=await application.evaluate(async({app})=>{
    if(process.platform==='darwin')return {skipped:'Mac: soltanto notifica'};
    const path=process.getBuiltinModule('node:path'),fs=process.getBuiltinModule('node:fs/promises'),require=process.getBuiltinModule('node:module').createRequire(path.join(app.getAppPath(),'electron/main.cjs'));
    const t=require('./offline.cjs').createUpdateTransport(),p=require('./update-policy.cjs'),file=path.join(app.getPath('userData'),'download-di-verifica.bin');t.setEnabled(true);
    try{const manifest=p.parseChecksums((await t.get(p.SUMS,{name:'SHA256SUMS.txt'})).bytes.toString('utf8')),name=p.assetName(manifest.version,process.platform,process.arch),expected=manifest.files.get(name);if(!name||!expected)throw Error('Pacchetto pubblico mancante');
     const result=await t.get(`${p.ROOT}/download/v${manifest.version}/${name}`,{name,destination:file,limit:1024**3}),actual=await require('./updater.cjs').fileHash(file);if(actual!==expected||result.sha256!==expected)throw Error('SHA-256 non valido');return {name,size:result.size,sha256:actual,integrity:true,installed:false};
    }finally{await t.setEnabled(false);await fs.unlink(file).catch(()=>{});}
   });
   nodeAudit=await audit();const requests=nodeAudit.filter(e=>['request','lookup'].includes(e.phase));assert.ok(requests.length>0);
   for(const e of requests)assert.ok(['github.com','release-assets.githubusercontent.com'].includes(e.host));assert.ok(nodeAudit.some(e=>e.phase==='blocked'&&e.host==='example.invalid'));
   await page.waitForTimeout(300);assert.deepEqual(await audit(),nodeAudit,'a operazione conclusa nessuna richiesta aggiuntiva');
  }
  await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.emit('render-process-gone',{}, {reason:'crashed'}));await application.close();closed=true;
  const net=JSON.parse(await readFile(log,'utf8')),names=Object.fromEntries(Object.entries(net.constants.logEventTypes).map(([k,v])=>[v,k]));
  assert.deepEqual(net.events.filter(e=>/^(TCP_CONNECT|TCP_CONNECT_ATTEMPT|UDP_CONNECT|QUIC_SESSION|DNS_TRANSACTION)$/.test(names[e.type])),[]);
  assert.deepEqual(net.events.filter(e=>/^(https?|wss?|ftp):/.test(e.params?.url||'')),[]);
  reports.push({legacy,result:'PASS',startupNodeRequests:0,chromiumConnections:0,chromiumRequests:0,manual:!legacy,cancelled:!legacy,networkOffAfterwards:true,downloaded,nodeAudit});
 }finally{if(!closed){await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0]?.webContents.emit('render-process-gone',{}, {reason:'crashed'})).catch(()=>{});await application.close();}}
}
await writeFile(`test-results/update-node-${packaged?'package':'electron'}.json`,JSON.stringify({result:'PASS',package:packaged,reports},null,2));console.log(JSON.stringify({result:'PASS',package:packaged,reports},null,2));
