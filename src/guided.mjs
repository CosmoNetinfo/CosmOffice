import { validateGuided } from '../electron/guided-policy.mjs';
export const guidedKey = 'cosmoffice.guided.v1';
export function readGuided() {
  try { return validateGuided(JSON.parse(localStorage.getItem(guidedKey))); }
  catch { return validateGuided(null); }
}
export function saveGuided(value) {
  const clean = validateGuided(value);
  localStorage.setItem(guidedKey, JSON.stringify(clean));
  return clean;
}
