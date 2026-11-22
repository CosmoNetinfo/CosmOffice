import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { EventEmitter } from 'node:events';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
const require = createRequire(import.meta.url);
const { createTransport } = require('../electron/update-transport.cjs');
const { download } = require('../electron/update-worker.cjs');
const { SUMS } = require('../electron/update-policy.cjs');
const cdn='https://release-assets.githubusercontent.com/github-production-release-asset/1466711071/11111111-1111-1111-1111-111111111111?firma=temporanea';
function fixture(target, data=Buffer.from('ELENCO')) {
  const calls=[],audit=[];
  const request=(url,options,callback)=>{
    calls.push({url,options});const req=new EventEmitter();req.setTimeout=()=>{};req.destroy=()=>{};
    req.end=()=>{req.emit('close');queueMicrotask(()=>{
      const res=new EventEmitter();res.headers={};res.resume=()=>{};
      res.statusCode=target&&calls.length===1?302:200;
      if(res.statusCode===302)res.headers.location=target;
      callback(res);if(res.statusCode===200){res.emit('data',data);res.emit('end');}
    });};return req;
  };
  return {calls,audit,run:job=>download({url:SUMS,name:'SHA256SUMS.txt',limit:16384,...job},{request,emit:e=>audit.push(e)})};
}
test('TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione',async()=>{
  let starts=0;const transport=createTransport({workerFactory:()=>{starts++;throw Error('Non deve partire');}});
  await assert.rejects(transport.get(SUMS,{name:'SHA256SUMS.txt'}));
  transport.setEnabled(true);
  for(const url of ['http://github.com/CosmoNetinfo/CosmOffice/releases/latest/download/SHA256SUMS.txt','https://altro.example/','https://github.com/altro/progetto/releases/latest/download/SHA256SUMS.txt',cdn])await assert.rejects(transport.get(url,{name:'SHA256SUMS.txt'}));
  assert.equal(starts,0);assert.equal(transport.activeRequests(),0);
});
test('TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository',async()=>{
  const f=fixture(cdn);const result=await f.run();assert.equal(result.bytes.toString(),'ELENCO');
  assert.equal(f.calls.length,2);
  for(const call of f.calls){assert.equal(call.options.rejectUnauthorized,true);assert.equal(call.options.minVersion,'TLSv1.2');assert.equal(call.options.method,'GET');assert.deepEqual(call.options.headers,{'User-Agent':'CosmOffice','Accept-Encoding':'identity'});assert.equal(call.options.agent,false);}
  assert.deepEqual([...new Set(f.audit.filter(e=>e.phase==='request').map(e=>e.host))],['github.com','release-assets.githubusercontent.com']);
});
test('TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto',async()=>{
  for(const target of ['https://altro.example/raccogli','http://github.com/CosmoNetinfo/CosmOffice/releases/latest/download/SHA256SUMS.txt','https://release-assets.githubusercontent.com/github-production-release-asset/999/11111111-1111-1111-1111-111111111111','https://github.com/altro/progetto/releases/download/v0.2.2/SHA256SUMS.txt']){
    const f=fixture(target);await assert.rejects(f.run(),/non consentito/);assert.equal(f.calls.length,1,'nessuna richiesta alla destinazione proibita');assert.equal(f.audit.at(-1).phase,'blocked');
  }
});
test('TLS Node: errore di certificato senza fallback',async()=>{
  const calls=[];await assert.rejects(download({url:SUMS,name:'SHA256SUMS.txt',limit:100},{request:(url,options)=>{calls.push(url);const r=new EventEmitter();r.destroy=()=>{};r.end=()=>queueMicrotask(()=>r.emit('error',Object.assign(Error('Certificato rifiutato'),{code:'CERT_HAS_EXPIRED'})));return r;}}));assert.deepEqual(calls,[SUMS]);
});
test('TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso',async()=>{
  const directory=resolve(`test-results/transport-${randomUUID()}`);await mkdir(directory,{recursive:true});const original=resolve(directory,'originale.part');await writeFile(original,'ORIGINALE');
  const f=fixture(null,Buffer.alloc(20000));await assert.rejects(f.run({destination:original}));assert.equal(await readFile(original,'utf8'),'ORIGINALE');assert.equal(f.calls.length,0);
  const next=resolve(directory,'nuovo.part');await assert.rejects(f.run({destination:next,limit:10000}));await assert.rejects(access(next));
});
test('TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto',async()=>{
  let worker;const directory=resolve(`test-results/transport-stop-${randomUUID()}`);await mkdir(directory,{recursive:true});const file=resolve(directory,'nuovo.part');
  const transport=createTransport({workerFactory:()=>{worker=new EventEmitter();worker.terminate=async()=>0;return worker;}});transport.setEnabled(true);
  const operation=transport.get(SUMS,{name:'SHA256SUMS.txt',destination:file});const rejected=assert.rejects(operation);transport.setEnabled(false);await rejected;await assert.rejects(access(file));assert.equal(transport.activeRequests(),0);
});
