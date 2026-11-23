import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
export async function testProfile(prefix, updates) {
  const profile = resolve(`test-results/${prefix}-${Date.now()}-${randomUUID()}`);
  await mkdir(profile, { recursive: true });
  // Preferenza reale persistita: nessuna eccezione di rete nascosta nel prodotto.
  if (typeof updates === 'boolean') await writeFile(resolve(profile, 'updates.json'), JSON.stringify({ policy: 2, enabled: updates }));
  return profile;
}
