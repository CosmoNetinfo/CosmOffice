import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const { createUpdater } = createRequire(import.meta.url)('../electron/updater.cjs');
async function fixture(saved, intervalMs) {
  const dir=resolve(`test-results/manual-${randomUUID()}`);await mkdir(dir,{recursive:true});
  if(saved)await writeFile(`${dir}/updates.json`,JSON.stringify(saved));
  const calls=[],enabled=[];let complete;
  const transport={setEnabled:value=>{enabled.push(value);},get:url=>{calls.push(url);return new Promise(resolve=>{complete=resolve;});}};
  const updater=createUpdater({app:{isPackaged:false,getPath:()=>dir,getVersion:()=> '0.2.3'},transport,intervalMs});
  return {updater,calls,enabled,finish:()=>complete({bytes:Buffer.from(`${'a'.repeat(64)}  CosmOffice-0.2.2-win-x64-Setup.exe`)})};
}
test('Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento',async()=>{
  for(const saved of [undefined,{enabled:true},{enabled:false},{policy:2,enabled:true}]){
    const f=await fixture(saved);try{await new Promise(r=>setTimeout(r,15));assert.deepEqual(f.calls,[]);assert.deepEqual(f.enabled,[]);assert.equal(f.updater.status().preference,saved?.policy===2&&saved.enabled===true);}finally{f.updater.stop();}
  }
});
test('Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici',async()=>{
  const f=await fixture();try{const first=f.updater.check(),second=f.updater.check();assert.equal(first,second);assert.equal(f.calls.length,1);assert.equal(f.updater.status().enabled,false);f.finish();const state=await first;assert.equal(state.phase,'idle');assert.equal(state.networkActive,false);assert.deepEqual(f.enabled,[true,false]);assert.equal(state.preference,false);}finally{f.updater.stop();}
});
test('Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso',async()=>{
  const f=await fixture();try{const check=f.updater.check();const cancel=f.updater.cancel();assert.equal(f.updater.status().phase,'disabled');f.finish();await cancel;await check;assert.equal(f.calls.length,1);assert.equal(f.updater.status().networkActive,false);assert.equal(f.updater.status().phase,'disabled');assert.equal(f.enabled.at(-1),false);}finally{f.updater.stop();}
});
test('Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato',async()=>{
  const f=await fixture(undefined,40);try{f.updater.setPreference(true);assert.deepEqual(f.calls,[]);await new Promise(r=>setTimeout(r,75));assert.equal(f.calls.length,1);f.finish();await f.updater.check();assert.equal(f.enabled.at(-1),false);f.updater.setPreference(false);const n=f.calls.length;await new Promise(r=>setTimeout(r,60));assert.equal(f.calls.length,n);}finally{f.updater.stop();}
});
