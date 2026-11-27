import { cp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const root = await realpath(process.cwd());
const parent = join(root, 'android/app/src/main/assets');
await mkdir(parent, { recursive: true });
const actual = await realpath(parent);
if (relative(root, actual).replaceAll('\\', '/') !== 'android/app/src/main/assets') throw new Error('Destinazione degli asset Android non sicura.');
const target = join(actual, 'www'); // Generated directory only; never a user document directory.
await rm(target, { recursive: true, force: true });
await cp(join(root, 'dist'), target, { recursive: true });
const html = (await readFile(join(target, 'index.html'), 'utf8')).replace(' ws://127.0.0.1:*', '').replace("object-src 'none';", "object-src 'none'; frame-src 'none';");
await writeFile(join(target, 'index.html'), html);
const iconFolder = join(root, 'android/app/src/main/res/drawable-nodpi');
await mkdir(iconFolder, { recursive: true });
await sharp('public/brand/suite.svg').resize(256, 256).extend({ top: 88, bottom: 88, left: 88, right: 88, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(iconFolder, 'suite_foreground.png'));
const fixtures = join(root, 'android/app/src/androidTest/assets/fixtures');
await mkdir(fixtures, { recursive: true });
for (const [source, name] of [['01-testo-stili.docx', 'android-write.docx'], ['01-formule.xlsx', 'android-grid.xlsx'], ['01-testo.pdf', 'android-view.pdf']]) await cp(join(root, 'tests/fixtures', source), join(fixtures, name));
await writeFile(join(fixtures, 'android-note.md'), '# Appunti Android\n\nEsempio originale per le prove di CosmOffice.\n');
console.log('Asset Android pronti: editor, worker/font PDF, dizionario italiano, licenze e icona Cosmonet locali. Tre campioni originali e Markdown per il solo APK di test.');
