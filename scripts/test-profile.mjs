import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export async function testProfile(prefix, updates = false) {
  const profile = resolve(`test-results/${prefix}-${Date.now()}`);
  await mkdir(profile, { recursive: true });
  // Preferenza reale persistita: nessuna eccezione di rete nascosta nel prodotto.
  await writeFile(resolve(profile, 'updates.json'), JSON.stringify({ enabled: updates }));
  return profile;
}
