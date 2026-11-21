# Report CosmOffice — correzione CI Linux

## 1. Obiettivo del passo

Correggere prima di ogni altro lavoro la CI rossa del commit `defa84b`, eliminando il tentativo nativo di download dei dizionari che il NetLog ha rilevato su Linux.

## 2. Cosa hai fatto

- `electron/offline.cjs`: imposta la destinazione dei dizionari su un URL esclusivamente locale e svuota le lingue Hunspell, annullando i caricamenti pendenti prima del download. Rimangono ortografia disattivata e blocchi delle API di rete.
- `electron/main.cjs`: disabilita esplicitamente risolutore incorporato, Happy Eyeballs, DoH e tipi DNS aggiuntivi prima di creare la finestra.
- `scripts/offline-smoke.mjs`: conserva il divieto di ogni TCP/UDP/QUIC/DNS e aggiunge il fallimento per qualsiasi URL remoto presente nel NetLog.
- `tests/offline.test.mjs`: adegua il simulatore Session alle API che cancellano le lingue e impostano la destinazione locale.
- `docs/BUG.md`: registra NET-003 con riproduzione e run fallita.
- `docs/report/2026-11-21_2301_correzione-ci-linux.md` e `docs/report/ULTIMO.md`: questo report e la sua copia.

Nessuna nuova dipendenza, licenza o modifica alle funzioni PDF. Nessuna eccezione nel test per CDN o sonde IPv6. Il test è più severo rispetto al precedente.

## 3. Risultato di build e test

CI precedente realmente fallita: [run 44953248300](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44953248300), commit `defa84b70daa3df19285d776df0bdd4bf6aaaafa`. Build, 31 test, Playwright e Poppler passati; test Electron Linux fallito. Pacchetti e interoperabilità saltati dalla dipendenza del lavoro fallito.

Estratto reale del log GitHub, con i soli codici colore rimossi:

```text
2026-11-21T21:48:00.1377552Z ##[group]Run xvfb-run -a node scripts/offline-smoke.mjs
2026-11-21T21:48:00.1378046Z xvfb-run -a node scripts/offline-smoke.mjs
2026-11-21T21:48:00.1411004Z shell: /usr/bin/bash -e {0}
2026-11-21T21:48:00.1411520Z ##[endgroup]
2026-11-21T21:48:00.5948511Z Downloading Electron binary...
2026-11-21T21:48:20.5026572Z node:internal/modules/run_main:107
2026-11-21T21:48:20.5027853Z     triggerUncaughtException(
2026-11-21T21:48:20.5029365Z     ^
2026-11-21T21:48:20.5029550Z
2026-11-21T21:48:20.5030134Z AssertionError [ERR_ASSERTION]: NetLog Chromium contiene connessioni di rete
2026-11-21T21:48:20.5030881Z + actual - expected
2026-11-21T21:48:20.5031098Z
2026-11-21T21:48:20.5031389Z + [
2026-11-21T21:48:20.5031677Z +   {
2026-11-21T21:48:20.5031967Z +     params: {
2026-11-21T21:48:20.5032550Z +       address: '[2001:4860:4860::8888]:443'
2026-11-21T21:48:20.5033009Z +     },
2026-11-21T21:48:20.5033308Z +     phase: 1,
2026-11-21T21:48:20.5033630Z +     source: {
2026-11-21T21:48:20.5034013Z +       id: 19,
2026-11-21T21:48:20.5034381Z +       start_time: '186120',
2026-11-21T21:48:20.5034767Z +       type: 24
2026-11-21T21:48:20.5035077Z +     },
2026-11-21T21:48:20.5035385Z +     time: '186120',
2026-11-21T21:48:20.5035734Z +     type: 96
2026-11-21T21:48:20.5036051Z +   },
2026-11-21T21:48:20.5036346Z +   {
2026-11-21T21:48:20.5036650Z +     params: {
2026-11-21T21:48:20.5037018Z +       net_error: -109
2026-11-21T21:48:20.5037379Z +     },
2026-11-21T21:48:20.5037685Z +     phase: 2,
2026-11-21T21:48:20.5038020Z +     source: {
2026-11-21T21:48:20.5038342Z +       id: 19,
2026-11-21T21:48:20.5038724Z +       start_time: '186120',
2026-11-21T21:48:20.5039120Z +       type: 24
2026-11-21T21:48:20.5039448Z +     },
2026-11-21T21:48:20.5039782Z +     time: '186120',
2026-11-21T21:48:20.5040135Z +     type: 96
2026-11-21T21:48:20.5040451Z +   }
2026-11-21T21:48:20.5040739Z + ]
2026-11-21T21:48:20.5041031Z - []
2026-11-21T21:48:20.5041394Z
2026-11-21T21:48:20.5041962Z     at file:///home/runner/work/CosmOffice/CosmOffice/scripts/offline-smoke.mjs:48:10 {
2026-11-21T21:48:20.5042754Z   generatedMessage: false,
2026-11-21T21:48:20.5043183Z   code: 'ERR_ASSERTION',
2026-11-21T21:48:20.5043562Z   actual: [
2026-11-21T21:48:20.5043867Z     {
2026-11-21T21:48:20.5044335Z       params: { address: '[2001:4860:4860::8888]:443' },
2026-11-21T21:48:20.5044844Z       phase: 1,
2026-11-21T21:48:20.5045322Z       source: { id: 19, start_time: '186120', type: 24 },
2026-11-21T21:48:20.5045845Z       time: '186120',
2026-11-21T21:48:20.5046195Z       type: 96
2026-11-21T21:48:20.5046509Z     },
2026-11-21T21:48:20.5047363Z     {
2026-11-21T21:48:20.5047739Z       params: { net_error: -109 },
2026-11-21T21:48:20.5048175Z       phase: 2,
2026-11-21T21:48:20.5048660Z       source: { id: 19, start_time: '186120', type: 24 },
2026-11-21T21:48:20.5049177Z       time: '186120',
2026-11-21T21:48:20.5049528Z       type: 96
2026-11-21T21:48:20.5049845Z     }
2026-11-21T21:48:20.5050134Z   ],
2026-11-21T21:48:20.5050455Z   expected: [],
2026-11-21T21:48:20.5050858Z   operator: 'deepStrictEqual',
2026-11-21T21:48:20.5051660Z   diff: 'simple'
2026-11-21T21:48:20.5052021Z }
2026-11-21T21:48:20.5052190Z
2026-11-21T21:48:20.5052545Z Node.js v24.22.3
2026-11-21T21:48:20.5217626Z ##[error]Process completed with exit code 1.
```

Controlli locali dopo la correzione: tutti terminati con codice di uscita 0. Output reali:

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2389 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CoQCUQZa.css               42.62 kB │ gzip:   9.89 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-CrpulAga.js            10.91 kB │ gzip:   4.18 kB
dist/assets/GridEditor-CIJ_ypaT.js           13.25 kB │ gzip:   5.25 kB
dist/assets/SettingsPage-CctHtDjA.js         20.00 kB │ gzip:   6.87 kB
dist/assets/import-docx-CIFFwOMP.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-BWjCyKgQ.js             2,219.19 kB │ gzip: 659.85 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.38s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ DOCX exports real text, bold marks and tables readable by another parser (98.3607ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (69.4265ms)
✔ unknown formulas retain their source without exporting a misleading cached number (12.5369ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.5604ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (9.814ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (13.5661ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.2062ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.1695ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (144.8476ms)
✔ references, arithmetic, precedence and percentages (3.7588ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7653ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6724ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6526ms)
✔ Excel address limits and column naming (1.366ms)
✔ conditional sums, lookups, text, dates and error handling (3.1798ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.3243ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.2475ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.517ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5491ms)
✔ Il processo principale non contiene updater o caricamenti da server (5.1875ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (159.2131ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (29.2125ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (8.5703ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (79.0362ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (14.5915ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (96.3568ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (37.2606ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.7058ms)
✔ unsupported parts produce specific warnings without changing the original file (42.3964ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.7614ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (10.8063ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1634.9377
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
22:58:05 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

## 4. Cosa funziona, provato davvero

- 31 test locali passati, compresi i blocchi delle API di rete.
- Suite Playwright passate su tutti i 13 file: modifiche, salvataggio e riapertura, comprese le rotazioni PDF persistenti e il recupero dopo quota esaurita.
- Electron reale su Windows: apertura DOCX/XLSX/PDF senza tentativi spontanei, richiesta intenzionale dal main bloccata, nessuna connessione o URL remoto nel NetLog con il controllo rafforzato.
- Il NetLog della CI precedente ha permesso di identificare esattamente il download `en-us-10-2.bdic` da `redirector.gvt1.com`, prima della sonda IPv6. Il blocco JavaScript da solo non bastava.

## 5. Cosa NON funziona o non hai potuto provare

- La correzione Linux non è ancora verificata su GitHub Actions al momento di scrivere il report: attendo la nuova run prima di concludere. La prova Windows non sostituisce quella Linux.
- Controllo ortografico desktop non disponibile finché non saranno incorporati dizionari locali con licenze verificate.
- Restano i limiti PDF del report precedente: niente OCR, modifica testo, annotazioni o firma; i PDF cifrati e le firme/campi firma rilevati non sono modificabili.
- Nessuna nuova prova di installer su macchina pulita o dispositivi fisici macOS/Linux in questo passo.

## 6. Bug noti o dubbi

NET-003 è una perdita di isolamento offline realmente rilevata dalla CI. L’iniziale interpretazione come semplice sonda IPv6 era incompleta: l’artefatto integrale mostra la richiesta del dizionario avviata dal codice nativo. Il [costruttore Session di Electron](https://github.com/electron/electron/blob/main/shell/browser/api/electron_api_session.cc) inizializza i dizionari prima che l’app possa gestire la nuova sessione; disabilitare soltanto il controllo ortografico non cancella tutti i caricamenti. La correzione agisce sulla coda dei dizionari e sul loro indirizzo di origine, senza ignorare il traffico nei controlli.

Non dichiaro ancora risolto il caso Linux: serve il nuovo risultato CI. Gli esiti locali e il fallimento precedente restano riportati integralmente.

## 7. Hash del commit

Correzione verificata localmente: `6b7649b7b6ae1c17b214ec550670cadaa40a2c37`.

Il report è aggiunto nel commit documentale immediatamente successivo e pubblicato nello stesso push. Non contiene un hash autoreferenziale.

## 8. Prossimo passo consigliato

Verificare subito la nuova CI, con particolare attenzione al NetLog Linux. Se fallisce, correggere quella causa prima di qualsiasi altra attività. Se passa, attendere anche tutti i pacchetti e il lavoro di interoperabilità, poi registrare l’esito finale.
