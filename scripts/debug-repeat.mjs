import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(`test-results/debug-repeat-${Date.now()}`);
await mkdir(root, { recursive: true });
const results = [];
for (const mode of ['electron', 'pacchetto']) for (let run = 1; run <= 10; run++) {
  console.log(`INIZIO debug-smoke ${mode} ${run}/10`);
  const started = Date.now();
  const result = await new Promise((done, reject) => {
    const child = spawn(process.execPath, ['scripts/debug-smoke.mjs'], {
      env: { ...process.env, COSMO_DEBUG_PACKAGE: mode === 'pacchetto' ? '1' : '0' },
      windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', data => { output += data; }); child.stderr.on('data', data => { output += data; });
    const timer = setTimeout(() => child.kill(), 120000);
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); done({ code, output }); });
  });
  const log = `${mode}-${String(run).padStart(2, '0')}.log`;
  await writeFile(resolve(root, log), result.output);
  const entry = { mode, run, code: result.code, result: result.code === 0 ? 'PASS' : 'FAIL', ms: Date.now() - started, log };
  results.push(entry); await writeFile(resolve(root, 'esiti.json'), JSON.stringify(results, null, 2));
  console.log(`${entry.result} debug-smoke ${mode} ${run}/10: codice ${entry.code}; ${entry.ms} ms`);
  if (result.code !== 0) {
    console.error(result.output);
    throw new Error(`Sequenza interrotta: indagare ${resolve(root, log)} prima di proseguire.`);
  }
}
console.log(`PASS: 10 esecuzioni consecutive in Electron e 10 nel pacchetto. Esiti: ${root}/esiti.json`);
