import { cp, mkdir } from 'node:fs/promises';
await mkdir('public/pdfjs', { recursive: true });
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) await cp(`node_modules/pdfjs-dist/${directory}`, `public/pdfjs/${directory}`, { recursive: true });
console.log('Font, mappe caratteri e decoder PDF disponibili offline.');
