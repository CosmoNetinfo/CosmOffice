import { isAndroid, androidDark } from './android.mjs';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const DEFAULTS = Object.freeze({ theme: 'system', accent: 'blue', customAccent: '#2865d8', uiScale: 100, density: 'comfortable', compactSidebar: false, writerFont: 'Calibri', writerFontSize: 12, writerZoom: 100, writerPaper: 'A4', writerOrientation: 'portrait', writerMargin: 20, lineHeight: 1.65, spellcheck: true, gridLocale: 'it-IT', decimalPlaces: 2, gridRows: 40, gridCols: 12, gridLines: true, csvDelimiter: ';', pdfZoom: 110, rememberPdfPage: true, automaticUpdates: false });
const choices = { theme: ['system', 'light', 'dark'], accent: ['blue', 'teal', 'orange', 'rose'], uiScale: [90, 100, 110, 125], density: ['comfortable', 'compact'], writerFont: ['Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Verdana'], writerFontSize: [10, 11, 12, 14, 16, 18], writerZoom: [75, 90, 100, 110, 125, 150], writerPaper: ['A4', 'Letter'], writerMargin: [10, 15, 20, 25, 30], gridLocale: ['it-IT', 'en-US', 'de-DE'], decimalPlaces: [0, 1, 2, 3, 4, 6, 8], gridRows: [20, 40, 60, 100], gridCols: [8, 12, 20, 26], csvDelimiter: [';', ',', '\t'], pdfZoom: [50, 75, 100, 110, 125, 150, 200] };
export function validatePreferences(value) {
  const settings = { ...DEFAULTS };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return settings;
  for (const key of Object.keys(DEFAULTS)) {
    if (choices[key]?.includes(value[key]) || typeof DEFAULTS[key] === 'boolean' && typeof value[key] === 'boolean') settings[key] = value[key];
    if (key === 'customAccent' && /^#[a-f\d]{6}$/i.test(value[key] || '')) settings[key] = value[key];
    if (key === 'accent' && value[key] === 'custom') settings[key] = 'custom';
    if (key === 'uiScale' && Number.isInteger(value[key]) && value[key] >= 80 && value[key] <= 150) settings[key] = value[key];
    if (key === 'lineHeight' && [1, 1.15, 1.5, 1.65, 2].includes(value[key])) settings[key] = value[key];
    if (key === 'writerOrientation' && ['portrait', 'landscape'].includes(value[key])) settings[key] = value[key];
  }
  return settings;
}
const Context = createContext(null);
const KEY = 'cosmoffice.preferences.v1';
export function PreferencesProvider({ children }) {
  const [settings, setSettings] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved && saved.updatesPolicy !== 2) saved.automaticUpdates = false; return validatePreferences(saved); } catch { return { ...DEFAULTS }; } });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ ...settings, updatesPolicy: 2 })); setStorageError(false); } catch { setStorageError(true); }
    const root = document.documentElement;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => { root.dataset.theme = settings.theme === 'system' ? (isAndroid ? androidDark() : media.matches) ? 'dark' : 'light' : settings.theme; };
    applyTheme(); media.addEventListener('change', applyTheme);
    if (isAndroid) window.addEventListener('cosmoffice:android-theme', applyTheme);
    root.dataset.accent = settings.accent; root.dataset.density = settings.density;
    root.dataset.compactSidebar = String(settings.compactSidebar);
    root.style.setProperty('--interface-scale', settings.uiScale / 100);
    for (const name of ['--accent', '--accent-hover', '--accent-soft']) root.style.removeProperty(name);
    if (settings.accent === 'custom') {
      root.style.setProperty('--accent', settings.customAccent);
      root.style.setProperty('--accent-hover', `color-mix(in srgb, ${settings.customAccent} 80%, #000)`);
      root.style.setProperty('--accent-soft', `color-mix(in srgb, ${settings.customAccent} 14%, var(--surface))`);
    }
    return () => { media.removeEventListener('change', applyTheme); if (isAndroid) window.removeEventListener('cosmoffice:android-theme', applyTheme); };
  }, [settings]);
  const value = { settings, storageError, setSetting: (key, next) => setSettings(previous => validatePreferences({ ...previous, [key]: next })), reset: () => setSettings({ ...DEFAULTS }), importSettings: next => setSettings(previous => validatePreferences({ ...next, automaticUpdates: previous.automaticUpdates })) };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function usePreferences() { return useContext(Context); }
