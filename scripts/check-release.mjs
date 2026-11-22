import { readFile } from 'node:fs/promises';
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
if (process.env.GITHUB_REF_NAME !== `v${version}`) throw new Error('Il tag deve coincidere con la versione del pacchetto.');
// La pubblicazione senza firma non richiede certificati. Il vecchio percorso firmato resta esplicito.
const required = process.env.COSMO_PUBLISH_UPDATES === '1' ? (process.platform === 'win32' ? ['CSC_LINK', 'CSC_KEY_PASSWORD', 'WIN_PUBLISHER_NAME'] : process.platform === 'darwin' ? ['CSC_LINK', 'CSC_KEY_PASSWORD', 'APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID'] : []) : [];
for (const name of required) if (!process.env[name]) throw new Error(`Release bloccata: configura ${name} nei segreti GitHub.`);
console.log('Configurazione release verificata.');
