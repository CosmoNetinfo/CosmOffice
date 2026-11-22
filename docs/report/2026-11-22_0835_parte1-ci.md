# Report — parte 1: CI

## 1. Obiettivo

Controllare che tutti i lavori dell'ultimo commit su main siano verdi prima delle altre parti richieste.

## 2. Cosa hai fatto

Verificata la run https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44996749215 del commit 48628402b8c182be3aec8589966c69686f3574a8. Tutti i cinque lavori sono completed/success: checks, interop, desktop Windows x64, Linux x64 e macOS Intel/Apple Silicon. Nessuna correzione necessaria. Creato questo report e aggiornata la copia docs/report/ULTIMO.md. Nessuna modifica applicativa o alle dipendenze.

## 3. Esiti reali di build e test

Tutti i comandi seguenti terminati con codice 0. Desktop-smoke ha usato il pacchetto Windows già costruito dallo stesso codice 4862840, senza modifiche applicative successive.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2405 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-D-Rba5BH.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-DzuMz7TE.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-BEv3ap87.js          203.05 kB │ gzip:  70.48 kB
dist/assets/import-docx-DQAi6B3O.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Du0-VHjk.js             2,319.77 kB │ gzip: 695.45 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.13s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (122.7667ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (26.6732ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (32.6905ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (28.0575ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.7811ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (89.1138ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (85.4976ms)
✔ unknown formulas retain their source without exporting a misleading cached number (16.0995ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.7061ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (12.0281ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (14.1813ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.9251ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (8.8398ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (158.3073ms)
✔ references, arithmetic, precedence and percentages (4.5575ms)
✔ Italian aliases, absolute references, text and lazy IF (0.8562ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.86ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.808ms)
✔ Excel address limits and column naming (1.5657ms)
✔ conditional sums, lookups, text, dates and error handling (3.5899ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5793ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (1.0583ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.4119ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (1.6858ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.0637ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (205.7799ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (35.4419ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.0685ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (107.9544ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (16.126ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (97.3527ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (31.5178ms)
✔ damaged files and mismatched Office extensions are rejected before import (7.5063ms)
✔ unsupported parts produce specific warnings without changing the original file (48.2806ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (19.0174ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.6823ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (696.2939ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1797.5684ms)
ℹ tests 38
ℹ suites 0
ℹ pass 38
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2752.9563
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs

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
08:30:37 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS ortografia italiana: Write, Grid, impostazioni, parole personali, riavvio pagina e nessuna richiesta esterna.
PASS grafici: barre, linee, torta, aggiornamento dati, titolo/etichette/legenda, bozza e XLSX riaperti; grafici esterni in sola lettura con export bloccato; nessuna richiesta esterna.
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

## 4. Cosa funziona (provato)

Cinque lavori CI verdi; 38 test del motore, corpus di 13 file, ortografia, grafici, verifica offline e pacchetto Windows passati nella nuova esecuzione locale.

## 5. Cosa NON funziona o non hai potuto provare

Le parti 2–8 di questa nuova richiesta non sono ancora completate. Restano i limiti già documentati: stampa dei grafici spezzata, foglio tecnico nascosto per categorie personalizzate, nessun validatore SDK in CI, aggiornamenti online disabilitati e grafici esterni non modificabili. Non provato: Microsoft Office e macOS/Linux su computer fisici.

## 6. Bug e dubbi

Nessun lavoro CI rosso e nessun fallimento nella sequenza locale di questo passo. Nessun cambiamento di rete anticipato: gli aggiornamenti sono previsti solo nella parte 5.

## 7. Hash del commit

Commit verificato: 48628402b8c182be3aec8589966c69686f3574a8. Questo passo aggiunge solo il report; il suo hash finale è nella cronologia del file. Un file non può contenere l'hash del proprio commit senza cambiarlo.

## 8. Prossimo passo

Parte 2: adattamento di stampa degli XLSX con grafici e prova indipendente PDF con LibreOffice per CHART-002.
