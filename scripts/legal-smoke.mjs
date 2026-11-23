import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
const packaged=process.argv.includes('--package');
const app=await electron.launch({executablePath:packaged?resolve('release/win-unpacked/CosmOffice.exe'):executablePath,args:packaged?[]:['.','--no-sandbox'],env:{...process.env,COSMO_TEST:'1',COSMO_TEST_PROFILE:await testProfile('legal')}});
try {
 const page=await app.firstWindow();await page.getByRole('button',{name:'Impostazioni',exact:true}).click();
 await page.getByRole('button',{name:'Dati e backup',exact:true}).click();await page.locator('input[type="file"][accept=".json"]').setInputFiles({name:'preferenze-anteprima.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'cosmoffice-preferences',version:1,settings:{automaticUpdates:true}}))});
 await page.getByRole('status').filter({hasText:'consenso ai controlli periodici resta invariato'}).waitFor();
 await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();assert.equal(await page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true}).isChecked(),false);assert.equal((await page.evaluate(()=>window.cosmoffice.updateStatus())).preference,false);
 await page.getByRole('button',{name:'Informazioni',exact:true}).click();
 assert.match(await page.locator('.settings-sections').innerText(),/Versione 0\.2\.3/);
 await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo della licenza A"]')?.value.includes('1. Titolare'));
 assert.equal(await page.getByRole('textbox',{name:'Testo della licenza A'}).inputValue(),await readFile('LICENSE','utf8'));assert.match(await page.locator('.about-legal').innerText(),/Daniele Spalletti/);
 await page.getByRole('button',{name:'Attribuzioni di terzi',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo delle attribuzioni di terzi"]')?.value.includes('Morph-it!'));
 assert.equal(await page.getByRole('textbox',{name:'Testo delle attribuzioni di terzi'}).inputValue(),await readFile('THIRD_PARTY_NOTICES.txt','utf8'));
 assert.equal(await page.evaluate(async()=>{try{await window.cosmoffice.legalText('../package.json');return false;}catch{return true;}}),true,'nessun percorso arbitrario via IPC');
 assert.deepEqual(await app.evaluate(({app})=>process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs'))('./offline.cjs').getUpdateAudit()),[]);
 console.log(`PASS Informazioni ${packaged?'pacchetto':'Electron'}: file locali identici, attribuzioni, percorso arbitrario respinto e zero richieste Node.`);
}finally{await app.close();}
