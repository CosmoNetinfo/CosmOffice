import { _electron as electron } from 'playwright';
import { resolve, dirname, join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testProfile } from './test-profile.mjs';
if(process.env.GITHUB_ACTIONS!=='true'||process.platform!=='win32'||!process.env.COSMO_INSTALLED_EXE)throw Error('Prova riservata all’installazione reale nel runner Windows.');
const executablePath=resolve(process.env.COSMO_INSTALLED_EXE),errors=[];
assert.deepEqual(await readFile(join(dirname(executablePath),'resources','LICENSE')),await readFile('LICENSE'));
const installedNotices=await readFile(join(dirname(executablePath),'resources','THIRD_PARTY_NOTICES.txt'),'utf8');assert.ok(installedNotices.length>1000);assert.match(installedNotices,/Morph-it!/);assert.match(installedNotices,/CC BY-SA 2.0/);
const application=await electron.launch({executablePath,env:{...process.env,COSMO_TEST:'0',COSMO_TEST_PROFILE:await testProfile('windows-installed')}});
try {
 const page=await application.firstWindow();page.on('pageerror',e=>errors.push(e.message));await page.getByRole('heading',{name:'Il tuo spazio di lavoro.'}).waitFor({state:'visible'});
 assert.equal(await application.evaluate(({BrowserWindow,app},expected)=>app.isPackaged&&app.getVersion()==='0.2.3'&&BrowserWindow.getAllWindows()[0].isVisible()&&app.getPath('exe').toLowerCase()===expected.toLowerCase(),executablePath),true);
 await page.screenshot({path:'test-results/windows-installata-home.png'});
 async function open(file){
  // Si automatizza solo la scelta del file; lettura IPC e motori reali non sono sostituiti.
  await application.evaluate(({dialog},file)=>{dialog.showOpenDialog=async()=>({canceled:false,filePaths:[file]});},resolve('tests/fixtures',file));
  await page.getByRole('button',{name:'Apri un file',exact:true}).click();
 }
 await open('01-testo-stili.docx');await page.locator('.document-page').waitFor();assert.match(await page.locator('.document-page').innerText(),/Accenti e stili/);await page.getByRole('button',{name:'Torna alle bozze'}).click();
 await open('01-formule.xlsx');await page.getByRole('textbox',{name:'Cella A1',exact:true}).waitFor();assert.equal(await page.getByRole('textbox',{name:'Cella A1',exact:true}).inputValue(),'Campione Excel 1');await page.getByRole('button',{name:'Torna alle bozze'}).click();
 await open('01-testo.pdf');await page.waitForFunction(()=>document.querySelector('.pdf-paper canvas')?.width>0&&!document.querySelector('.pdf-loading'));await page.locator('.textLayer span').first().waitFor();assert.match(await page.locator('.textLayer').innerText(),/Documento PDF testuale/);await page.getByRole('button',{name:'Torna alle bozze'}).click();
 await page.getByRole('button',{name:'Impostazioni',exact:true}).click();await page.getByRole('button',{name:'Informazioni',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo della licenza A"]')?.value.includes('1. Titolare'));assert.equal(await page.getByRole('textbox',{name:'Testo della licenza A'}).inputValue(),await readFile('LICENSE','utf8'));
 assert.deepEqual(errors,[]);
 await page.getByRole('button',{name:'Attribuzioni di terzi',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo delle attribuzioni di terzi"]')?.value.includes('Morph-it!'));assert.equal(await page.getByRole('textbox',{name:'Testo delle attribuzioni di terzi'}).inputValue(),installedNotices);
 assert.deepEqual(await application.evaluate(({app})=>process.getBuiltinModule('node:module').createRequire(process.getBuiltinModule('node:path').join(app.getAppPath(),'electron/main.cjs'))('./offline.cjs').getUpdateAudit()),[]);
 await writeFile('test-results/windows-installata-report.json',JSON.stringify({result:'PASS',realInstalledBinary:true,visibleWindow:true,home:true,files:['DOCX','XLSX','PDF'],legalFiles:true,selection:'selettore file automatizzato; lettura IPC e rendering reali',notProved:['SmartScreen','UAC con antivirus','utente normale','PC fisico pulito']},null,2));
 console.log('PASS app NSIS realmente installata: finestra visibile, Home, tre file aperti e licenze locali identiche. Selezione file automatizzata, dialogo OS non collaudato.');
}finally{await application.close();}
