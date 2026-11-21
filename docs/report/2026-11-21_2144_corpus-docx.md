# Report CosmOffice — corpus e conservazione DOCX

## 1. Obiettivo del passo

Verificare i 13 file del corpus nell’app e correggere la perdita di intestazioni, piè di pagina e immagini durante l’esportazione DOCX.

## 2. Cosa hai fatto

- `.github/workflows/build.yml`
- `README.md`
- `docs/BUG.md`
- `docs/VALIDATION.md`
- `package.json`
- `src/App.jsx`
- `src/backups.mjs`
- `src/office-inspection.mjs`
- `scripts/corpus-smoke.mjs`
- `scripts/fixtures-office.mjs`
- `src/docx-preservation.mjs`
- `docs/report/2026-11-21_2144_corpus-docx.md` e `docs/report/ULTIMO.md`: questo report e la sua copia.

Conservata la sorgente DOCX nelle bozze e nei backup. Nell’export vengono copiate solo intestazioni/piè di pagina e relative immagini/relazioni, con stili separati; il corpo originale non viene reinserito. Bloccata l’esportazione per contenuti rilevati come non supportati e vecchie bozze importate senza sorgente. Aggiunti test di modifica, doppia esportazione e riapertura, controllo dei contenuti, verifica SHA-256 degli originali e lettura indipendente con LibreOffice. Nessuna nuova libreria; eseguito `node scripts/notices.mjs`, senza cambiamenti alle attribuzioni.

## 3. Risultato di build e test

Esiti locali reali, tutti con codice di uscita 0. Di seguito gli output acquisiti, senza sostituirli con un riassunto.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2215 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                              0.84 kB │ gzip:   0.47 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs  1,271.91 kB
dist/assets/index-CoQCUQZa.css              42.62 kB │ gzip:   9.89 kB
dist/assets/PdfViewer-BOvSL8ay.js           10.00 kB │ gzip:   3.83 kB
dist/assets/GridEditor-AN4PQ5M4.js          13.21 kB │ gzip:   5.23 kB
dist/assets/SettingsPage-BjO_DU6l.js        20.37 kB │ gzip:   6.94 kB
dist/assets/import-docx-CbA929DK.js        301.65 kB │ gzip:  89.22 kB
dist/assets/pdf-engine-BF-5vh4s.js         443.65 kB │ gzip: 133.60 kB
dist/assets/index-BkHDZruv.js            2,219.56 kB │ gzip: 659.90 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.34s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ DOCX exports real text, bold marks and tables readable by another parser (76.2656ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (64.4426ms)
✔ unknown formulas retain their source without exporting a misleading cached number (9.9881ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.6138ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (10.4761ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.5223ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.4989ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.4859ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (123.3761ms)
✔ references, arithmetic, precedence and percentages (2.6109ms)
✔ Italian aliases, absolute references, text and lazy IF (0.6583ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.9694ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6662ms)
✔ Excel address limits and column naming (0.7831ms)
✔ conditional sums, lookups, text, dates and error handling (2.7102ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.2705ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.208ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.4049ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.3103ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (75.5743ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (22.1076ms)
✔ damaged files and mismatched Office extensions are rejected before import (7.6582ms)
✔ unsupported parts produce specific warnings without changing the original file (41.1919ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (11.7368ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (7.8795ms)
ℹ tests 25
ℹ suites 0
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1422.0405
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs

{
  "result": "PASS",
  "scenarios": [
    "DOCX import/modifica/export",
    "Ripristino bozza dopo riavvio",
    "XLSX import/formule/modifica/export",
    "Fogli multipli",
    "PDF rendering/navigazione/ricerca/copia identica",
    "Layout 390px",
    "Zero richieste esterne"
  ],
  "errors": [],
  "external": []
}
{
  "result": "PASS",
  "scenarios": [
    "Incolla intervalli, annulla/ripristina",
    "Rinomina e duplica fogli",
    "Tema/colore/scala/densità/barra laterale applicati",
    "Font/margini/ortografia applicati",
    "Trova e sostituisci",
    "Preferenze persistenti",
    "Backup e ripristino senza sovrascrittura",
    "Conferma svuotamento archivio",
    "Impostazioni a 390px"
  ],
  "errors": []
}
21:42:49 [vite] (client) [console.warn] Warning: Indexing all PDF objects
{
  "result": "PASS",
  "scenarios": [
    "Errore quota: documento conservato e navigazione bloccata",
    "Riprova salvataggio e recupero dopo riavvio",
    "DOCX/PDF danneggiati e estensioni errate respinti senza creare bozze",
    "Avviso specifico per commenti Word",
    "Ripristino archivio atomico anche in caso di dati non scrivibili"
  ],
  "errors": []
}
PASS 01-testo-stili.docx
PASS 02-tabella.docx
PASS 03-immagine.docx
PASS 04-elenchi.docx
PASS 05-intestazioni.docx
PASS 01-formule.xlsx
PASS 02-piu-fogli.xlsx
PASS 03-formati.xlsx
PASS 04-unioni-immagine.xlsx
PASS 05-dati-filtro.xlsx
PASS 01-testo.pdf
PASS 02-scansione.pdf
PASS 03-venti-pagine.pdf
```

### node scripts/fixtures-office.mjs

```text
{"file":"01-testo-stili.docx","variant":"originale","pages":1,"result":"PASS"}
21:41:17 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-testo-stili.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"02-tabella.docx","variant":"originale","pages":1,"result":"PASS"}
21:41:21 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-tabella.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"03-immagine.docx","variant":"originale","pages":1,"result":"PASS"}
21:41:25 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-immagine.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"04-elenchi.docx","variant":"originale","pages":1,"result":"PASS"}
21:41:30 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-elenchi.docx","variant":"esportato","pages":1,"result":"PASS"}
{"file":"05-intestazioni.docx","variant":"originale","pages":1,"result":"PASS"}
21:41:33 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-intestazioni.docx","variant":"esportato","pages":1,"result":"PASS"}
21:41:35 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-formule.xlsx","variant":"originale","pages":1,"result":"PASS"}
21:41:37 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"01-formule.xlsx","variant":"esportato","pages":2,"result":"PASS"}
21:41:39 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-piu-fogli.xlsx","variant":"originale","pages":2,"result":"PASS"}
21:41:41 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"02-piu-fogli.xlsx","variant":"esportato","pages":3,"result":"PASS"}
21:41:43 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-formati.xlsx","variant":"originale","pages":1,"result":"PASS"}
21:41:44 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"03-formati.xlsx","variant":"esportato","pages":2,"result":"PASS"}
21:41:46 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-unioni-immagine.xlsx","variant":"originale","pages":2,"result":"PASS"}
21:41:48 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"04-unioni-immagine.xlsx","variant":"esportato","pages":3,"result":"PASS"}
21:41:50 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-dati-filtro.xlsx","variant":"originale","pages":2,"result":"PASS"}
21:41:52 [vite] (client) [console.warn] Warning: TT: undefined function: 21
{"file":"05-dati-filtro.xlsx","variant":"esportato","pages":3,"result":"PASS"}
{"file":"01-testo.pdf","variant":"originale","pages":1,"result":"PASS"}
{"file":"02-scansione.pdf","variant":"originale","pages":1,"result":"PASS"}
{"file":"03-venti-pagine.pdf","variant":"originale","pages":20,"result":"PASS"}
```

## 4. Cosa funziona, provato davvero

- Cinque DOCX: modifica del corpo, salvataggio, riapertura e nuova esportazione; testo italiano, tabelle, elenchi, immagini e intestazioni/piè di pagina dei campioni conservati.
- Cinque XLSX: modifica, salvataggio, riapertura; fogli, valori, formule e risultati, formati numerici, font, immagini, celle unite, filtri e dati fuori dall’area visibile conservati.
- Tre PDF: testo, scansione senza testo e 20 pagine letti; navigazione fino all’ultima pagina; salvataggio e riapertura della copia identica. La rotazione è ancora una modifica della vista.
- Backup delle bozze Word: conserva la sorgente necessaria alle intestazioni. Provati il blocco dei commenti non supportati, delle intestazioni con più sezioni e delle vecchie bozze prive di sorgente.
- LibreOffice ha aperto e convertito i 10 originali Office e i 10 export. Testi attesi riletti nei PDF; salvate tutte le pagine e ispezionati i fogli di contatto. Le immagini sono in `test-results/corpus-office-*`, escluse da Git.
- Nessuna richiesta esterna rilevata dal test del renderer. Le impronte degli originali non sono cambiate.

## 5. Cosa NON funziona o non hai potuto provare

- La modifica persistente dei PDF non è ancora implementata: non dichiaro completato quel punto della richiesta.
- Intestazioni e piè di pagina non sono mostrati né modificabili nell’editor. Sezioni multiple con intestazioni e numerazioni nelle intestazioni bloccano l’export.
- Commenti, note, revisioni, grafici e oggetti complessi rilevati bloccano l’export DOCX; manca il supporto completo. Il rilevamento non copre ogni oggetto Office.
- Le bozze Word importate da vecchie versioni vanno reimportate per avere la sorgente completa. La stampa/PDF da CosmoWrite segue il corpo visibile e non riproduce le intestazioni conservate nel DOCX.
- Non provati Microsoft Word/Excel installati, documenti aziendali reali, tutti i casi OOXML o sistemi desktop diversi da quello locale in questo passo. La CI della revisione precedente `8cba130` è riuscita; quella di questo passo partirà al push, quindi non è ancora verificata.
- Rimane da rimuovere il percorso di aggiornamento online del processo principale Electron per rispettare il nuovo vincolo di nessuna chiamata esterna. Il blocco del renderer non basta.

## 6. Bug noti o dubbi

`docs/BUG.md` contiene i difetti ordinati per gravità. DAT-008: perdita delle intestazioni corretta sui campioni. DAT-009: rischio di esportazione distruttiva contenuto tramite blocco, senza dichiarare supportati i documenti complessi. Primo giro del corpus: 9/13 PASS, con perdita reale del logo/intestazione e tre confronti troppo rigidi sulle parentesi equivalenti delle formule; corretto il difetto e corretti i confronti, senza disattivare verifiche sui dati.

Avvisi rimasti nei log: bundle superiore a 1900 kB; PDF.js segnala `TT: undefined function: 21` su alcuni font LibreOffice. Le pagine si renderizzano e i testi attesi vengono letti; non è una garanzia di fedeltà tipografica completa. L’aggiunta di J10 nei campioni XLSX può aumentare le pagine stampate perché amplia l’area usata.

## 7. Hash del commit

Codice verificato: `1846086d8ddd7dd467253379e4159a8d49216ed8`.

Il report viene aggiunto nel commit documentale immediatamente successivo e pubblicato insieme al codice nello stesso push. Questo evita un hash autoreferenziale impossibile: modificare il report cambierebbe l’hash del commit che lo contiene.

## 8. Prossimo passo consigliato

Completare la prova PDF con una modifica persistente limitata e verificabile, come la rotazione della pagina, mantenendo il contenuto. Poi eliminare tutte le chiamate di aggiornamento esterne dal runtime e ripetere build, Playwright e verifiche desktop.
