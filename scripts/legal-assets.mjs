import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('public/legal', { recursive: true });
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.txt']) await copyFile(name, `public/legal/${name}`);
console.log('Licenza e attribuzioni disponibili come file locali per l’anteprima.');
