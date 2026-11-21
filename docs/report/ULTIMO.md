# Report CosmOffice — verifica CI completata

## 1. Obiettivo del passo

Verificare realmente su GitHub Actions la correzione rete/PDF e chiudere il passo solo con tutti i lavori verdi, conservando traccia del precedente fallimento Linux.

## 2. Cosa hai fatto

- `docs/BUG.md`: NET-003 segnato come risolto dopo il risultato Linux, con link alla run fallita e a quella riuscita.
- `docs/report/2026-11-21_2310_verifica-ci.md`: questo report con gli esiti reali della CI.
- `docs/report/ULTIMO.md`: copia identica di questo report.

Nessun codice applicativo, dipendenza, licenza o test è stato modificato in questo passo documentale. Il report precedente descrive la correzione del download ortografico; quello rete/PDF descrive l’implementazione e le prove Windows.

## 3. Risultato di build e test

[GitHub Actions run 44954563150](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44954563150), commit `0caf1cb3fd01b4c2d4c822620f8a2a5af2421e86`: stato reale `completed`, conclusione reale `success`.

Esiti reali dei cinque lavori dall’API GitHub, con i passi di confezionamento:

```json
[
  {
    "name": "checks",
    "status": "completed",
    "conclusion": "success",
    "steps": []
  },
  {
    "name": "desktop (windows-latest, --win --x64, Windows-x64)",
    "status": "completed",
    "conclusion": "success",
    "steps": [
      {
        "name": "Run npx electron-builder --config electron-builder.config.cjs --win --x64 --publish never",
        "status": "completed",
        "conclusion": "success"
      }
    ]
  },
  {
    "name": "interop",
    "status": "completed",
    "conclusion": "success",
    "steps": []
  },
  {
    "name": "desktop (ubuntu-latest, --linux --x64, Linux-x64)",
    "status": "completed",
    "conclusion": "success",
    "steps": [
      {
        "name": "Run npx electron-builder --config electron-builder.config.cjs --linux --x64 --publish never",
        "status": "completed",
        "conclusion": "success"
      }
    ]
  },
  {
    "name": "desktop (macos-latest, --mac --x64 --arm64, macOS-Intel-AppleSilicon)",
    "status": "completed",
    "conclusion": "success",
    "steps": [
      {
        "name": "Run npx electron-builder --config electron-builder.config.cjs --mac --x64 --arm64 --publish never",
        "status": "completed",
        "conclusion": "success"
      }
    ]
  }
]
```

Estratti effettivi dei log dei comandi di verifica, con i soli codici colore rimossi:

### Test del motore

```text
2026-11-21T22:02:01.8318491Z ##[group]Run npm test
2026-11-21T22:02:01.8318795Z npm test
2026-11-21T22:02:01.8357163Z shell: /usr/bin/bash -e {0}
2026-11-21T22:02:01.8357440Z ##[endgroup]
2026-11-21T22:02:01.9555631Z
2026-11-21T22:02:01.9556348Z > cosmoffice@0.2.2 test
2026-11-21T22:02:01.9557028Z > node --test tests/*.test.mjs
2026-11-21T22:02:01.9557275Z
2026-11-21T22:02:02.6583969Z ✔ DOCX exports real text, bold marks and tables readable by another parser (146.311672ms)
2026-11-21T22:02:02.7323549Z ✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (131.101813ms)
2026-11-21T22:02:02.7583364Z ✔ unknown formulas retain their source without exporting a misleading cached number (23.657989ms)
2026-11-21T22:02:02.7587095Z ✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (6.274389ms)
2026-11-21T22:02:02.7953486Z ✔ cross-sheet formulas survive XLSX round trips and get calculated results (20.039851ms)
2026-11-21T22:02:02.8049078Z ✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (19.783163ms)
2026-11-21T22:02:02.8082246Z ✔ landscape DOCX uses a physically wider page with matching orientation (10.200279ms)
2026-11-21T22:02:02.8176677Z ✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.720777ms)
2026-11-21T22:02:02.8350553Z ✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (226.386962ms)
2026-11-21T22:02:02.8352025Z ✔ references, arithmetic, precedence and percentages (4.537296ms)
2026-11-21T22:02:02.8353203Z ✔ Italian aliases, absolute references, text and lazy IF (0.724376ms)
2026-11-21T22:02:02.8354558Z ✔ cycles, division by zero and unknown functions are visible and propagated (1.050196ms)
2026-11-21T22:02:02.8356057Z ✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.735236ms)
2026-11-21T22:02:02.8357317Z ✔ Excel address limits and column naming (1.478569ms)
2026-11-21T22:02:02.8358372Z ✔ conditional sums, lookups, text, dates and error handling (2.772491ms)
2026-11-21T22:02:02.8359100Z ✔ quoted sheet names, absolute references and cycles across sheets (0.465231ms)
2026-11-21T22:02:02.8360258Z ✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.458508ms)
2026-11-21T22:02:02.8361462Z ✔ literal text resembling errors stays text while actual formula errors propagate (1.240944ms)
2026-11-21T22:02:02.8362785Z ✔ empty strings, blank cells and boolean predicates retain their separate types (1.086464ms)
2026-11-21T22:02:02.8363540Z ✔ Il processo principale non contiene updater o caricamenti da server (9.112984ms)
2026-11-21T22:02:02.8364268Z ✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (112.561217ms)
2026-11-21T22:02:02.8364977Z ✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (68.354924ms)
2026-11-21T22:02:02.8366158Z ✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (19.238889ms)
2026-11-21T22:02:02.8366939Z ✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (66.868288ms)
2026-11-21T22:02:02.8367848Z ✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (29.872214ms)
2026-11-21T22:02:03.1688036Z ✔ Excel exports do not mutate the open workbook, even when exported concurrently (95.14226ms)
2026-11-21T22:02:03.1903519Z ✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (26.525879ms)
2026-11-21T22:02:03.2304519Z ✔ damaged files and mismatched Office extensions are rejected before import (7.961698ms)
2026-11-21T22:02:03.2417899Z ✔ unsupported parts produce specific warnings without changing the original file (42.168178ms)
2026-11-21T22:02:03.2549303Z ✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.134266ms)
2026-11-21T22:02:03.2624520Z ✔ XLSX caches keep literal error-like strings separate from actual error cells (9.36754ms)
2026-11-21T22:02:03.2766636Z ℹ tests 31
2026-11-21T22:02:03.2766956Z ℹ suites 0
2026-11-21T22:02:03.2767860Z ℹ pass 31
2026-11-21T22:02:03.2768267Z ℹ fail 0
2026-11-21T22:02:03.2768621Z ℹ cancelled 0
2026-11-21T22:02:03.2768981Z ℹ skipped 0
2026-11-21T22:02:03.2769316Z ℹ todo 0
2026-11-21T22:02:03.2769704Z ℹ duration_ms 1286.283631
```

### Compilazione

```text
2026-11-21T22:02:03.6815854Z ##[group]Run npm run build
2026-11-21T22:02:03.6816146Z npm run build
2026-11-21T22:02:03.6850823Z shell: /usr/bin/bash -e {0}
2026-11-21T22:02:03.6851075Z ##[endgroup]
2026-11-21T22:02:03.7867742Z
2026-11-21T22:02:03.7868472Z > cosmoffice@0.2.2 build
2026-11-21T22:02:03.7869206Z > node scripts/pdf-assets.mjs && vite build
2026-11-21T22:02:03.7869636Z
2026-11-21T22:02:03.9012194Z Font, mappe caratteri e decoder PDF disponibili offline.
2026-11-21T22:02:04.1176429Z vite v8.3.8 building client environment for production...
2026-11-21T22:02:04.1328250Z transforming...
2026-11-21T22:02:04.5405648Z ✓ 2389 modules transformed.
2026-11-21T22:02:04.7115008Z rendering chunks...
2026-11-21T22:02:05.1278863Z computing gzip size...
2026-11-21T22:02:05.1680021Z dist/index.html                               0.93 kB │ gzip:   0.50 kB
2026-11-21T22:02:05.1680819Z dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
2026-11-21T22:02:05.1682290Z dist/assets/index-CoQCUQZa.css               42.62 kB │ gzip:   9.89 kB
2026-11-21T22:02:05.1683854Z dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
2026-11-21T22:02:05.1685421Z dist/assets/PdfViewer-CrpulAga.js            10.91 kB │ gzip:   4.18 kB
2026-11-21T22:02:05.1687072Z dist/assets/GridEditor-CIJ_ypaT.js           13.25 kB │ gzip:   5.25 kB
2026-11-21T22:02:05.1688922Z dist/assets/SettingsPage-CctHtDjA.js         20.00 kB │ gzip:   6.87 kB
2026-11-21T22:02:05.1690439Z dist/assets/import-docx-CIFFwOMP.js         301.70 kB │ gzip:  89.24 kB
2026-11-21T22:02:05.1691979Z dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
2026-11-21T22:02:05.1693256Z dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
2026-11-21T22:02:05.1694544Z dist/assets/index-BWjCyKgQ.js             2,219.19 kB │ gzip: 659.85 kB
2026-11-21T22:02:05.1695120Z
2026-11-21T22:02:05.1695599Z [plugin builtin:vite-reporter]
2026-11-21T22:02:05.1696486Z (!) Some chunks are larger than 1900 kB after minification. Consider:
2026-11-21T22:02:05.1697233Z - Using dynamic import() to code-split the application
2026-11-21T22:02:05.1698249Z - Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
2026-11-21T22:02:05.1699293Z - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
2026-11-21T22:02:05.1721899Z ✓ built in 1.05s
```

### Playwright e corpus

```text
2026-11-21T22:02:30.1183189Z ##[group]Run npm run test:browser
2026-11-21T22:02:30.1183516Z npm run test:browser
2026-11-21T22:02:30.1215505Z shell: /usr/bin/bash -e {0}
2026-11-21T22:02:30.1215748Z env:
2026-11-21T22:02:30.1215939Z   COSMO_BROWSER: chromium
2026-11-21T22:02:30.1216167Z ##[endgroup]
2026-11-21T22:02:30.2245712Z
2026-11-21T22:02:30.2246561Z > cosmoffice@0.2.2 test:browser
2026-11-21T22:02:30.2247618Z > node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs
2026-11-21T22:02:30.2248599Z
2026-11-21T22:02:40.3299735Z {
2026-11-21T22:02:40.3300420Z   "result": "PASS",
2026-11-21T22:02:40.3300949Z   "scenarios": [
2026-11-21T22:02:40.3301768Z     "DOCX import/modifica/export",
2026-11-21T22:02:40.3302629Z     "Ripristino bozza dopo riavvio",
2026-11-21T22:02:40.3303449Z     "XLSX import/formule/modifica/export",
2026-11-21T22:02:40.3304142Z     "Fogli multipli",
2026-11-21T22:02:40.3304937Z     "PDF rendering/navigazione/ricerca/copia identica",
2026-11-21T22:02:40.3305744Z     "Layout 390px",
2026-11-21T22:02:40.3306315Z     "Zero richieste esterne"
2026-11-21T22:02:40.3306943Z   ],
2026-11-21T22:02:40.3307491Z   "errors": [],
2026-11-21T22:02:40.3308008Z   "external": []
2026-11-21T22:02:40.3308449Z }
2026-11-21T22:02:48.4125926Z {
2026-11-21T22:02:48.4126781Z   "result": "PASS",
2026-11-21T22:02:48.4127450Z   "scenarios": [
2026-11-21T22:02:48.4127946Z     "Incolla intervalli, annulla/ripristina",
2026-11-21T22:02:48.4128554Z     "Rinomina e duplica fogli",
2026-11-21T22:02:48.4129429Z     "Tema/colore/scala/densità/barra laterale applicati",
2026-11-21T22:02:48.4130053Z     "Font/margini/ortografia applicati",
2026-11-21T22:02:48.4130527Z     "Trova e sostituisci",
2026-11-21T22:02:48.4130943Z     "Preferenze persistenti",
2026-11-21T22:02:48.4131749Z     "Backup e ripristino senza sovrascrittura",
2026-11-21T22:02:48.4132329Z     "Conferma svuotamento archivio",
2026-11-21T22:02:48.4132815Z     "Impostazioni a 390px"
2026-11-21T22:02:48.4133190Z   ],
2026-11-21T22:02:48.4133480Z   "errors": []
2026-11-21T22:02:48.4133795Z }
2026-11-21T22:02:53.5935852Z {
2026-11-21T22:02:53.5936268Z   "result": "PASS",
2026-11-21T22:02:53.5936663Z   "scenarios": [
2026-11-21T22:02:53.5937254Z     "Errore quota: documento conservato e navigazione bloccata",
2026-11-21T22:02:53.5938010Z     "Riprova salvataggio e recupero dopo riavvio",
2026-11-21T22:02:53.5938828Z     "DOCX/PDF danneggiati e estensioni errate respinti senza creare bozze",
2026-11-21T22:02:53.5939624Z     "Avviso specifico per commenti Word",
2026-11-21T22:02:53.5940358Z     "Ripristino archivio atomico anche in caso di dati non scrivibili"
2026-11-21T22:02:53.5940976Z   ],
2026-11-21T22:02:53.5941456Z   "errors": []
2026-11-21T22:02:53.5941788Z }
2026-11-21T22:02:57.7255653Z PASS 01-testo-stili.docx
2026-11-21T22:03:00.1572219Z PASS 02-tabella.docx
2026-11-21T22:03:02.4569461Z PASS 03-immagine.docx
2026-11-21T22:03:04.7229779Z PASS 04-elenchi.docx
2026-11-21T22:03:08.2081249Z PASS 05-intestazioni.docx
2026-11-21T22:03:10.7075597Z PASS 01-formule.xlsx
2026-11-21T22:03:13.1924615Z PASS 02-piu-fogli.xlsx
2026-11-21T22:03:15.6580447Z PASS 03-formati.xlsx
2026-11-21T22:03:18.3059862Z PASS 04-unioni-immagine.xlsx
2026-11-21T22:03:22.2642300Z PASS 05-dati-filtro.xlsx
2026-11-21T22:03:28.4540700Z PASS 01-testo.pdf
2026-11-21T22:03:33.2550185Z PASS 02-scansione.pdf
2026-11-21T22:03:39.3516982Z PASS 03-venti-pagine.pdf
```

### Lettore PDF indipendente

```text
2026-11-21T22:03:43.6686614Z ##[group]Run node scripts/pdf-independent.mjs
2026-11-21T22:03:43.6687009Z node scripts/pdf-independent.mjs
2026-11-21T22:03:43.6720225Z shell: /usr/bin/bash -e {0}
2026-11-21T22:03:43.6720481Z ##[endgroup]
2026-11-21T22:03:43.9990652Z {"file":"01-testo.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":1,"rotatedPage":1,"otherPagesUnchanged":true,"contentPixelDifference":6.302,"pixelAlignment":{"dx":-1,"dy":0},"result":"PASS"}
2026-11-21T22:03:44.3479972Z {"file":"02-scansione.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":1,"rotatedPage":1,"otherPagesUnchanged":true,"contentPixelDifference":3.369,"pixelAlignment":{"dx":0,"dy":0},"result":"PASS"}
2026-11-21T22:03:44.5731805Z {"file":"03-venti-pagine.pdf","reader":"Poppler pdfinfo e pdftoppm","pages":20,"rotatedPage":20,"otherPagesUnchanged":true,"contentPixelDifference":5.897,"pixelAlignment":{"dx":-1,"dy":0},"result":"PASS"}
```

### Electron e rete su Linux

```text
2026-11-21T22:03:44.5896793Z ##[group]Run xvfb-run -a node scripts/offline-smoke.mjs
2026-11-21T22:03:44.5897551Z xvfb-run -a node scripts/offline-smoke.mjs
2026-11-21T22:03:44.5945645Z shell: /usr/bin/bash -e {0}
2026-11-21T22:03:44.5946088Z ##[endgroup]
2026-11-21T22:03:45.5415149Z Downloading Electron binary...
2026-11-21T22:04:08.8339374Z {
2026-11-21T22:04:08.8339848Z   "result": "PASS",
2026-11-21T22:04:08.8340300Z   "checks": [
2026-11-21T22:04:08.8340810Z     "Avvio Electron da file locale",
2026-11-21T22:04:08.8341911Z     "Nessun tentativo spontaneo di rete dal processo principale",
2026-11-21T22:04:08.8342954Z     "IPC aggiornamenti disabilitati anche con vecchie preferenze abilitate",
2026-11-21T22:04:08.8343839Z     "DOCX, XLSX e PDF aperti senza connessioni",
2026-11-21T22:04:08.8344851Z     "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
2026-11-21T22:04:08.8345885Z     "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
2026-11-21T22:04:08.8346594Z   ],
2026-11-21T22:04:08.8346894Z   "errors": []
2026-11-21T22:04:08.8347227Z }
```

### Corpus con LibreOffice

```text
2026-11-21T22:04:55.3627625Z ##[group]Run node scripts/fixtures-office.mjs
2026-11-21T22:04:55.3628011Z node scripts/fixtures-office.mjs
2026-11-21T22:04:55.3648464Z shell: /usr/bin/bash -e {0}
2026-11-21T22:04:55.3648737Z env:
2026-11-21T22:04:55.3649081Z   COSMO_BROWSER: chromium
2026-11-21T22:04:55.3649382Z ##[endgroup]
2026-11-21T22:04:58.0334270Z {"file":"01-testo-stili.docx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:04:58.5716715Z {"file":"01-testo-stili.docx","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:04:59.0760518Z {"file":"02-tabella.docx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:04:59.5930394Z {"file":"02-tabella.docx","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:00.1763893Z {"file":"03-immagine.docx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:00.8921287Z {"file":"03-immagine.docx","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:01.3916866Z {"file":"04-elenchi.docx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:01.9086044Z {"file":"04-elenchi.docx","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:02.4425840Z {"file":"05-intestazioni.docx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:02.9926796Z {"file":"05-intestazioni.docx","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:03.4775950Z {"file":"01-formule.xlsx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:03.9789927Z {"file":"01-formule.xlsx","variant":"esportato","pages":2,"result":"PASS"}
2026-11-21T22:05:04.5130085Z {"file":"02-piu-fogli.xlsx","variant":"originale","pages":2,"result":"PASS"}
2026-11-21T22:05:05.0558112Z {"file":"02-piu-fogli.xlsx","variant":"esportato","pages":3,"result":"PASS"}
2026-11-21T22:05:05.5607922Z {"file":"03-formati.xlsx","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:06.1185069Z {"file":"03-formati.xlsx","variant":"esportato","pages":3,"result":"PASS"}
2026-11-21T22:05:06.6873287Z {"file":"04-unioni-immagine.xlsx","variant":"originale","pages":3,"result":"PASS"}
2026-11-21T22:05:07.2541230Z {"file":"04-unioni-immagine.xlsx","variant":"esportato","pages":3,"result":"PASS"}
2026-11-21T22:05:07.8180249Z {"file":"05-dati-filtro.xlsx","variant":"originale","pages":3,"result":"PASS"}
2026-11-21T22:05:08.4296327Z {"file":"05-dati-filtro.xlsx","variant":"esportato","pages":4,"result":"PASS"}
2026-11-21T22:05:08.7632297Z {"file":"01-testo.pdf","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:09.1298086Z {"file":"01-testo.pdf","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:09.4315454Z {"file":"02-scansione.pdf","variant":"originale","pages":1,"result":"PASS"}
2026-11-21T22:05:09.7137869Z {"file":"02-scansione.pdf","variant":"esportato","pages":1,"result":"PASS"}
2026-11-21T22:05:10.5903273Z {"file":"03-venti-pagine.pdf","variant":"originale","pages":20,"result":"PASS"}
2026-11-21T22:05:11.4499014Z {"file":"03-venti-pagine.pdf","variant":"esportato","pages":20,"result":"PASS"}
```

### Interoperabilità con conversione indipendente

```text
2026-11-21T22:05:11.5178991Z ##[group]Run npm run test:interop
2026-11-21T22:05:11.5179286Z npm run test:interop
2026-11-21T22:05:11.5198548Z shell: /usr/bin/bash -e {0}
2026-11-21T22:05:11.5198899Z env:
2026-11-21T22:05:11.5199174Z   COSMO_BROWSER: chromium
2026-11-21T22:05:11.5199424Z ##[endgroup]
2026-11-21T22:05:11.5878858Z
2026-11-21T22:05:11.5879397Z > cosmoffice@0.2.2 test:interop
2026-11-21T22:05:11.5880061Z > node scripts/interop.mjs
2026-11-21T22:05:11.5880294Z
2026-11-21T22:05:14.8702637Z {
2026-11-21T22:05:14.8703250Z   "result": "PASS",
2026-11-21T22:05:14.8703733Z   "engine": "LibreOffice, profilo isolato e conversioni headless",
2026-11-21T22:05:14.8704297Z   "scenarios": [
2026-11-21T22:05:14.8705073Z     "DOCX → ODT → DOCX: testo italiano, tabella e carattere riletti",
2026-11-21T22:05:14.8705662Z     "XLSX → ODS → XLSX: codici, formule, testo e veri errori distinti",
2026-11-21T22:05:14.8706254Z     "XLSX: date, riferimenti tra fogli e celle unite conservati",
2026-11-21T22:05:14.8707002Z     "PDF prodotto da LibreOffice aperto da CosmoView"
2026-11-21T22:05:14.8707376Z   ],
2026-11-21T22:05:14.8708101Z   "limitations": "Controllo su un corpus ristretto. Non è un collaudo di Microsoft Word/Excel né una prova di compatibilità totale."
2026-11-21T22:05:14.8708960Z }
```

## 4. Cosa funziona, provato davvero

- CI completamente verde: verifiche, interoperabilità e pacchetti Windows x64, Linux x64 e macOS Intel/Apple Silicon.
- 31 test del motore e tutte le suite Playwright passate; tutti i 13 file del corpus modificati, salvati e riaperti.
- PDF: rotazione persistente della sola pagina selezionata; altre pagine e contenuti conservati sui campioni. Poppler indipendente conferma gli orientamenti, il numero delle pagine e il contenuto renderizzato; la prova dei flussi binari verifica testo, immagini e font invariati.
- Processo principale: API di rete bloccate e aggiornamenti online rimossi. Il test Electron Linux ora passa anche con il controllo rafforzato che rifiuta qualsiasi URL remoto nel NetLog, oltre a TCP/UDP/QUIC/DNS. Il tentativo intenzionale del test viene rilevato e bloccato prima della connessione.
- Corretto NET-003: nessuna eccezione al test per il download del dizionario o per la sonda IPv6. La precedente run rossa resta consultabile.
- Il pacchetto Windows è stato inoltre avviato e verificato localmente nel passo rete/PDF: salvataggio su disco, riapertura della pagina ruotata, lettura Poppler e preservazione della destinazione in caso di errore.

## 5. Cosa NON funziona o non hai potuto provare

- Ortografia desktop disabilitata: i dizionari locali non sono ancora incorporati.
- Nessun aggiornamento online o automatico da cartella locale: si installa manualmente un nuovo pacchetto locale.
- PDF: niente OCR, modifica del testo, annotazioni, compilazione moduli o firma. Cifratura e firme/campi firma rilevati bloccano la modifica; non certifico la validità delle firme e non ho coperto tutte le varianti di PDF protetti.
- Word/Excel mantengono i limiti dichiarati nel README: impaginazione Word non identica, intestazioni non visualizzate nell’editor, elementi complessi rilevati che bloccano l’export DOCX e motore Excel parziale.
- La creazione dei pacchetti macOS/Linux è provata in CI; non è una prova di installazione su computer fisici puliti. Firma/notarizzazione con certificati reali e app mobili restano da collaudare o implementare.
- Il controllo rete verifica i processi e i percorsi dell’app eseguiti nei test, non il traffico di tutti i processi del sistema operativo. Il corpus non certifica compatibilità universale Office.

## 6. Bug noti o dubbi

I bug e i limiti sono in `docs/BUG.md`. Il precedente [fallimento Linux](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/44953248300) ha mostrato un download Hunspell anticipato non visibile ai soli blocchi JavaScript. È stato corretto nel prodotto, senza attenuare la verifica; la nuova run è riuscita.

Rimangono avvisi di dimensione del bundle e alcuni messaggi PDF.js sui font dei PDF generati da LibreOffice. Le anteprime non sono firmate. Non presento questi risultati come equivalenza completa a Microsoft Office o come garanzia su ogni documento possibile.

## 7. Hash del commit

Commit effettivamente verificato dalla CI: `0caf1cb3fd01b4c2d4c822620f8a2a5af2421e86`.

Codice rete/PDF: `ea86a064003e9228c9c64acd3b0c230a31b8caa1`. Correzione Linux: `6b7649b7b6ae1c17b214ec550670cadaa40a2c37`. Il presente commit aggiunge soltanto la ricevuta documentale e lo stato verificato di NET-003; un file non può contenere l’hash del proprio commit senza cambiarlo.

## 8. Prossimo passo consigliato

Prima di aggiungere funzioni, provare gli installer su macchine pulite e ampliare il corpus con documenti rappresentativi degli utenti. Valutare poi dizionari ortografici locali con licenze verificate. Mantenere i test rete e PDF obbligatori e l’app priva di chiamate a server.
