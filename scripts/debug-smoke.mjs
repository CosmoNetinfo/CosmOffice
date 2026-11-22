import { testProfile } from './test-profile.mjs';
import { _electron as electron } from 'playwright';
import executablePath from 'electron';
import { resolve } from 'node:path';
import { checkDebug } from './debug-check.mjs';
const application = await electron.launch({ executablePath: process.env.COSMO_DEBUG_PACKAGE === '1' ? resolve('release/win-unpacked/CosmOffice.exe') : executablePath,
  args: process.env.COSMO_DEBUG_PACKAGE === '1' ? [] : ['.', '--no-sandbox'],
  env: { ...process.env, COSMO_TEST: '1', COSMO_TEST_PROFILE: await testProfile('debug-profile') } });
try { await checkDebug(application, await application.firstWindow()); }
finally {
  await application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.webContents.emit('render-process-gone', {}, { reason: 'crashed' })).catch(() => {});
  await application.close();
}
