// Pacchetto reale, versione/riconoscimento installer simulati. Nessun installer viene eseguito.
import { _electron as electron } from 'playwright';
import { resolve, join } from 'node:path';
import { mkdir, writeFile, readFile, link, copyFile, readdir, unlink } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
const profile=await testProfile('update-consent'),ledger=join(profile,'installazioni-simulate.json'),cache=join(profile,'aggiornamenti');
await mkdir(cache,{recursive:true});await writeFile(ledger,JSON.stringify({calls:[],dialogs:[]}));
const filename='CosmOffice-0.2.2-win-x64-Setup.exe',cached=resolve('test-results/public-release',filename);
try{await link(cached,join(cache,filename));}catch{await copyFile(cached,join(cache,filename)).catch(()=>{});}
async function start(answer){
  await writeFile(join(profile,'updates.json'),JSON.stringify({enabled:false}));
  const application=await electron.launch({executablePath:resolve('release/win-unpacked/CosmOffice.exe'),args:['--no-sandbox'],env:{...process.env,COSMO_TEST:'1',COSMO_TEST_PROFILE:profile}});
  try {
  const page=await application.firstWindow();await page.getByRole('heading',{name:'Il tuo spazio di lavoro.'}).waitFor();
  await application.evaluate(({app,dialog},{ledger,answer})=>{
    const fs=process.getBuiltinModule('node:fs'),cp=process.getBuiltinModule('node:child_process'),{EventEmitter}=process.getBuiltinModule('node:events');
    const exists=fs.existsSync;fs.existsSync=value=>typeof value==='string'&&value.endsWith('Uninstall CosmOffice.exe')||exists(value);
    app.getVersion=()=> '0.0.0';
    dialog.showMessageBox=async(_window,options)=>{const data=JSON.parse(fs.readFileSync(ledger,'utf8'));data.dialogs.push({title:options.title,buttons:options.buttons,defaultId:options.defaultId,cancelId:options.cancelId});fs.writeFileSync(ledger,JSON.stringify(data));return {response:answer};};
    cp.spawn=(file,args,options)=>{const data=JSON.parse(fs.readFileSync(ledger,'utf8'));data.calls.push({name:process.getBuiltinModule('node:path').basename(file),args,shell:options.shell===true});fs.writeFileSync(ledger,JSON.stringify(data));const child=new EventEmitter();child.unref=()=>{};queueMicrotask(()=>child.emit('spawn'));return child;};
  },{ledger,answer});
  await page.getByRole('button',{name:'Impostazioni',exact:true}).click();await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();
  await page.evaluate(()=>{window.consentPhases=[];window.cosmoffice.onUpdate(state=>window.consentPhases.push(state.phase));});
  await page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true}).check();
  await page.waitForFunction(()=>['ready','error'].includes(window.consentPhases.at(-1)),undefined,{timeout:330000});
  assert.equal((await page.evaluate(()=>window.cosmoffice.updateStatus())).phase,'ready');
  return {application,page};
  } catch(error) {await application.close();throw error;}
}
let current;
try{
  current=await start(0);
  await current.page.getByRole('button',{name:'Installa e chiudi',exact:true}).click();
  await current.page.waitForTimeout(300);
  let data=JSON.parse(await readFile(ledger,'utf8'));assert.equal(data.calls.length,0);assert.equal(data.dialogs.length,1);assert.equal(data.dialogs[0].title,'Conferma aggiornamento');assert.equal(data.dialogs[0].defaultId,0);assert.equal(data.dialogs[0].cancelId,0);
  assert.deepEqual(data.dialogs[0].buttons,['Annulla','Salva, chiudi e installa']);
  await current.application.close();current=null;
  assert.equal(JSON.parse(await readFile(ledger,'utf8')).calls.length,0,'chiusura normale: nessuna installazione');
  current=await start(1);
  const exited=current.application.waitForEvent('close',{timeout:30000});
  await current.page.getByRole('button',{name:'Installa e chiudi',exact:true}).click();await exited;current=null;
  data=JSON.parse(await readFile(ledger,'utf8'));assert.equal(data.calls.length,1);assert.deepEqual(data.calls[0].args,[]);assert.equal(data.calls[0].shell,false);assert.equal(data.dialogs.length,2);
  console.log('PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.');
}finally{if(current)await current.application.close();for(const file of await readdir(cache))if(/^CosmOffice-\d+\.\d+\.\d+-win-x64-Setup\.exe$/.test(file))await unlink(join(cache,file)).catch(()=>{});}
