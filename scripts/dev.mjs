import { build } from 'vite';
import { spawn } from 'node:child_process';
import electron from 'electron';

// Anche in sviluppo Electron carica file locali: nessun server o HMR.
await import('./pdf-assets.mjs');
await build();
const child = spawn(electron, ['.'], { stdio: 'inherit', windowsHide: true });
child.on('exit', code => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill());
