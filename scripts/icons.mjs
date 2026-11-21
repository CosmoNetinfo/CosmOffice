import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

await mkdir('build', { recursive: true });
for (const name of ['suite', 'write', 'grid', 'view']) {
  const svg = await readFile(`public/brand/${name}.svg`);
  await sharp(svg).resize(512, 512).png().toFile(`public/brand/${name}.png`);
}
const png = await sharp('public/brand/suite.svg').resize(256, 256).png().toBuffer();
const head = Buffer.alloc(22);
head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head[8] = 0; head[9] = 0; head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
await writeFile('build/icon.ico', Buffer.concat([head, png]));
await sharp('public/brand/suite.svg').resize(512, 512).png().toFile('build/icon.png');
console.log('Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.');
