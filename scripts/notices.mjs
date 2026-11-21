import { readFile, readdir, writeFile } from 'node:fs/promises';
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const notices = ['CosmOffice — componenti di terze parti\nLe licenze seguenti si applicano ai rispettivi componenti, non ai marchi Cosmonet.\n'];
for (const location of Object.keys(lock.packages).sort()) {
  if (!location.startsWith('node_modules/')) continue;
  try {
    const pkg = JSON.parse(await readFile(`${location}/package.json`, 'utf8'));
    const names = (await readdir(location)).filter(name => /^(licen[cs]e|copying|notice)(\.|$)/i.test(name));
    const texts = await Promise.all(names.map(name => readFile(`${location}/${name}`, 'utf8').catch(() => '')));
    notices.push(`\n${'='.repeat(72)}\n${pkg.name} ${pkg.version}\nLicense: ${typeof pkg.license === 'string' ? pkg.license : JSON.stringify(pkg.license || pkg.licenses || 'See upstream')}\n${pkg.homepage || pkg.repository?.url || ''}\n${texts.join('\n')}`);
  } catch { /* Platform-specific optional packages can be absent. */ }
}
await writeFile('THIRD_PARTY_NOTICES.txt', notices.join('\n').replace(/\r\n/g, '\n').split('\n').map(line => line.trimEnd()).join('\n').trimEnd() + '\n');
console.log('Attribuzioni e licenze raccolte.');
