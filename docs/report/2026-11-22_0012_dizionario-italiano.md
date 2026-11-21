# Report CosmOffice — parte 2: dizionario italiano offline

## 1. Obiettivo del passo

Ripristinare il controllo delle parole italiane in CosmoWrite e CosmoGrid senza connessioni e con dizionario personale locale. Prerequisito CI: tutti i cinque lavori verdi anche sul commit 0916ef7a74aeaebc87f8fb7ab9e1ee6f5488df45, run https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44958503230 .

## 2. Cosa hai fatto

- public/dictionaries/: lessico Morph-it! 0.4.8 (400.680 forme distinte), sorgente integrale compresso, README degli autori, attribuzione e licenza completa CC BY-SA 2.0. Scelta questa opzione della doppia licenza dichiarata dagli autori, separatamente dal codice.
- scripts/italian-dictionary.mjs: trasformazione riproducibile senza rete.
- src/spelling.mjs, src/Spelling.jsx, src/spelling-extension.mjs: motore locale, parole personali separate dal lessico e decorazioni visive ProseMirror, senza alterare il testo salvato.
- src/App.jsx, src/GridEditor.jsx, src/main.jsx, src/styles.css: sottolineature Write e Grid, con controllo nativo del browser disabilitato.
- src/SettingsPage.jsx: controllo attivabile/disattivabile e aggiunta/rimozione parole personali; eliminato l'avviso di indisponibilità.
- electron/main.cjs, electron/preload.cjs: lettura del SOLO dizionario fisso incluso tramite IPC autorizzato. Hunspell nativo resta spento e i blocchi rete restano attivi.
- scripts/notices.mjs, THIRD_PARTY_NOTICES.txt: attribuzione e testo completo della licenza del lessico. Nessuna nuova dipendenza JavaScript.
- tests/spelling.test.mjs, scripts/spelling-check.mjs, scripts/spelling-smoke.mjs, scripts/offline-smoke.mjs, scripts/desktop-smoke.mjs, package.json: verifiche automatiche del controllo nei due editor, impostazioni, parole personali e persistenza al ricaricamento, anche nel pacchetto Windows.
- README.md, docs/BUG.md e questo report con copia ULTIMO.md: comportamento e limiti aggiornati.

## 3. Risultato di build e test

Esiti reali della sequenza locale, tutti terminati con codice 0. La verifica ortografica è eseguita anche da offline-smoke e desktop-smoke tramite lo stesso helper, oltre alla suite browser.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2392 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CNS1tgpd.css               43.33 kB │ gzip:  10.05 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-CrsRh7mK.js            10.91 kB │ gzip:   4.18 kB
dist/assets/GridEditor-DgkxNPNr.js           13.79 kB │ gzip:   5.47 kB
dist/assets/SettingsPage-5XzuYi96.js         19.96 kB │ gzip:   6.86 kB
dist/assets/import-docx-CFAfXF3E.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-DQBIGtvM.js             2,223.25 kB │ gzip: 661.30 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.11s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ DOCX exports real text, bold marks and tables readable by another parser (93.1687ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (69.0324ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.18ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.2058ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (11.2307ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (14.9212ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.5102ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.2298ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (131.278ms)
✔ references, arithmetic, precedence and percentages (4.311ms)
✔ Italian aliases, absolute references, text and lazy IF (0.9942ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.3191ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.3779ms)
✔ Excel address limits and column naming (1.4391ms)
✔ conditional sums, lookups, text, dates and error handling (4.6934ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6512ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.6396ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9476ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.8453ms)
✔ Il processo principale non contiene updater o caricamenti da server (5.8031ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (208.1484ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (32.4535ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.5097ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (112.8855ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (17.0972ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (94.4524ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (23.1729ms)
✔ damaged files and mismatched Office extensions are rejected before import (8.0582ms)
✔ unsupported parts produce specific warnings without changing the original file (45.1888ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (11.7392ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (10.2766ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (660.4339ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1777.4636ms)
ℹ tests 33
ℹ suites 0
ℹ pass 33
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2662.6249
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs

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
00:06:57 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
00:08:11 [vite] (client) page reload public/dictionaries/CC-BY-SA-2.0.html
PASS ortografia italiana: Write, Grid, impostazioni, parole personali, riavvio pagina e nessuna richiesta esterna.
```

### npm run pack

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2392 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CNS1tgpd.css               43.33 kB │ gzip:  10.05 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-CrsRh7mK.js            10.91 kB │ gzip:   4.18 kB
dist/assets/GridEditor-DgkxNPNr.js           13.79 kB │ gzip:   5.47 kB
dist/assets/SettingsPage-5XzuYi96.js         19.96 kB │ gzip:   6.86 kB
dist/assets/import-docx-CFAfXF3E.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-DQBIGtvM.js             2,223.25 kB │ gzip: 661.30 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.13s

> cosmoffice@0.2.2 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=V:\CosmonetOffice\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=V:\CosmonetOffice\release\win-unpacked
  • searching for node modules  pm=npm searchDir=V:\CosmonetOffice
  • no node modules found in collection, trying next search directory  pm=npm searchDir=V:\CosmonetOffice
  • searching for node modules  pm=traversal searchDir=V:\CosmonetOffice
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=V:\CosmonetOffice
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
```

### node scripts/offline-smoke.mjs

```text
{
  "result": "PASS",
  "checks": [
    "Avvio Electron da file locale",
    "Nessun tentativo spontaneo di rete dal processo principale",
    "IPC aggiornamenti disabilitati anche con vecchie preferenze abilitate",
    "DOCX, XLSX e PDF aperti senza connessioni",
    "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
    "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
  ],
  "errors": []
}
```

### node scripts/desktop-smoke.mjs

```text
{
  "result": "PASS",
  "package": "Windows x64",
  "checks": [
    "Avvio pacchetto locale",
    "Preload isolato e nessun require nel renderer",
    "Apertura DOCX/XLSX/PDF via IPC e filesystem",
    "Esportazione documento in PDF tramite printToPDF",
    "Worker PDF da file locale",
    "Esportazione PDF identica su disco",
    "Rotazione di pagina 2 salvata su disco e riaperta nel pacchetto",
    "Poppler indipendente: prima pagina a 0°, seconda a 90°",
    "Nessun tentativo di rete nel main del pacchetto",
    "Errore di scrittura: originale preservato e temporanei rimossi",
    "Pagina impostazioni e tema scuro nel pacchetto",
    "Chiusura dopo notifica simulata di arresto del renderer"
  ],
  "errors": []
}
```

## 4. Cosa funziona, provato davvero

- Parole casa, città, perché e andavano senza segnalazioni; zzqerrore e italgiano segnalate. Elisioni e forme flesse incluse nelle prove del motore.
- Sottolineature nei due editor, parola personale accettata in entrambi, rimozione e ritorno della segnalazione; preferenza e parole conservate dopo ricaricamento della pagina.
- Le parole personali vengono salvate su localStorage prima di dichiarare l'aggiunta riuscita. In caso di errore di scrittura viene mostrato un errore italiano.
- Browser, Electron locale e pacchetto Windows: prove dell'ortografia passate. NetLog senza richieste remote, TCP/UDP/QUIC/DNS; tentativo intenzionale del test rilevato e bloccato. Tutti i 13 campioni e le regressioni PDF passano.

## 5. Cosa NON funziona o non hai potuto provare

- Nessuna grammatica, proposta di correzioni o lingua diversa dall'italiano. Lessico non esaustivo: nomi e termini validi possono risultare sconosciuti. Le elisioni sono gestite come controllo lessicale, non grammaticale.
- Formule, celle numeriche, URL e identificativi alfanumerici non vengono trattati come prosa. Le celle mostrano soltanto la porzione di testo che entra nella colonna.
- Parole personali locali separate da backup e preferenze esportate; non vengono sincronizzate.
- Non provato: installazione su computer fisici puliti, controllo manuale con Microsoft Office, verifica linguistica di tutte le 400.680 forme, persistenza dopo riavvio dell'intero sistema operativo. Le prove automatiche includono il ricaricamento della pagina nello stesso profilo locale.
- Grafici XLSX non ancora implementati in questo passo: parte 3 successiva.

## 6. Bug noti o dubbi

I primi tentativi del nuovo smoke fallivano per selettori ambigui del test (Documenti nella barra e nelle impostazioni; apertura ed eliminazione bozza). Selettori corretti e test completo rieseguito. Restano i limiti Office descritti in README e docs/BUG.md e l'avviso dimensione bundle. Nessun fallimento nascosto nella sequenza riportata.

## 7. Hash del commit

Base CI verde: 0916ef7a74aeaebc87f8fb7ab9e1ee6f5488df45. Codice e report costituiscono un unico commit della parte 2; il suo hash effettivo è consultabile nella cronologia di questo file, senza inserire un hash autoreferenziale impossibile.

## 8. Prossimo passo consigliato

Implementare grafici nativi XLSX e provarli anche con LibreOffice; bloccare l'esportazione dei grafici importati non supportati per impedirne la cancellazione silenziosa.
