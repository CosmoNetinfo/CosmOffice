import { chromium } from 'playwright';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=await createServer();await server.listen();let browser;
try {
 const channel=process.env.COSMO_BROWSER||'chrome';browser=await chromium.launch({...channel==='chromium'?{}:{channel},headless:true});
 const page=await browser.newPage();const origin=server.resolvedUrls.local[0],outside=[];
 await page.route('**/*',route=>{const url=route.request().url();if(/^https?:/.test(url)&&new URL(url).origin!==new URL(origin).origin){outside.push(url);return route.abort();}return route.continue();});
 await page.addInitScript(()=>localStorage.setItem('cosmoffice.preferences.v1',JSON.stringify({automaticUpdates:true})));
 await page.goto(origin);await page.getByRole('button',{name:'Impostazioni',exact:true}).click();
 await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();assert.equal(await page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true}).isChecked(),false,'vecchio attivo non ereditato');
 await page.getByRole('button',{name:'Dati e backup',exact:true}).click();
 await page.locator('input[type="file"][accept=".json"]').setInputFiles({name:'preferenze-anteprima.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'cosmoffice-preferences',version:1,settings:{automaticUpdates:true}}))});
 await page.getByRole('status').filter({hasText:'consenso ai controlli periodici resta invariato'}).waitFor();
 await page.getByRole('button',{name:'Aggiornamenti',exact:true}).click();assert.equal(await page.getByRole('checkbox',{name:'Aggiornamenti automatici',exact:true}).isChecked(),false,'importazione del vecchio JSON non abilita la rete');
 await page.getByRole('button',{name:'Informazioni',exact:true}).click();
  assert.match(await page.locator('.settings-sections').innerText(),/Versione 0\.2\.3/);
 const text=page.getByRole('textbox',{name:'Testo della licenza A'});await text.waitFor();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo della licenza A"]')?.value.includes('1. Titolare'));
 assert.equal(await text.inputValue(),await readFile('LICENSE','utf8'));
 await page.getByRole('button',{name:'Attribuzioni di terzi',exact:true}).click();await page.waitForFunction(()=>document.querySelector('textarea[aria-label="Testo delle attribuzioni di terzi"]')?.value.includes('Morph-it!'));
 assert.equal(await page.getByRole('textbox',{name:'Testo delle attribuzioni di terzi'}).inputValue(),await readFile('THIRD_PARTY_NOTICES.txt','utf8'));assert.deepEqual(outside,[]);
 console.log('PASS Informazioni browser: versione 0.2.3, testi uguali ai file locali, attribuzioni, migrazione vecchio attivo e nessuna richiesta esterna.');
}finally{await browser?.close();await server.close();}
