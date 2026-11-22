# Preparazione della Release pubblica 0.2.2 — Windows e Linux

## 1. Obiettivo

Pubblicare una Release ordinaria “CosmOffice 0.2.2 (anteprima)” con installer Windows x64 e AppImage Linux x64 non firmati, SHA-256 e note oneste derivate dal CHANGELOG. Il DMG Mac e l’aggiornamento TLS Node seguono in passi distinti, nell’ordine richiesto.

## 2. Cosa hai fatto

- .github/workflows/release.yml: tag v*, controlli comuni bloccanti (browser, SDK, offline e interoperabilità inclusi), build Windows/Linux indipendenti, upload e pubblicazione con il solo GITHUB_TOKEN. Una piattaforma fallita è dichiarata nelle note e non nasconde l’installer riuscito.
- scripts/check-release.mjs: i certificati sono richiesti soltanto dal percorso firmato esplicito, non dal percorso di anteprima senza firma.
- scripts/publish-preview.mjs: estrazione note dalla sezione della versione nel CHANGELOG; SHA-256 dei byte; file .sha256 individuali e SHA256SUMS.txt; upload in bozza e pubblicazione ordinaria/latest soltanto dopo gli upload. Nessun installer disponibile blocca la pubblicazione. Una Release già pubblica o una bozza con asset omonimi richiedono controllo, senza sovrascrittura automatica.
- tests/release-preview.test.mjs: checksum reali su file sintetici, note e piattaforma mancante, API simulate per sequenza upload/pubblicazione, tag errato e assenza di installer.
- CHANGELOG.md: sezione 0.2.2 con novità, correzioni, limiti, prove mancanti, prossimi passi e quattro domande “Cosa ti aspetti da CosmOffice?”.
- README.md: procedura di tag, pubblicazione, checksum, avviso Windows e assenza attuale dell’updater.
- docs/DECISIONI.md, docs/ROADMAP.md, docs/BUG.md e docs/VALIDATION.md: scelta autorizzata della pubblicazione senza firma e limiti delle prove.
- docs/report/2026-11-22_1600_release-windows-linux.md e docs/report/ULTIMO.md: report e copia identica.

Nessuna nuova libreria; node scripts/notices.mjs: “Attribuzioni e licenze raccolte.”, exit 0, file avvisi invariato. Nessuna idea dello studio o motore implementato. Il codice del renderer e del processo principale non cambia.

## 3. Esiti reali di build e test

Comandi eseguiti, tutti exit 0: npm run build, npm test, npm run test:browser, npm run test:openxml, node scripts/offline-smoke.mjs, node scripts/desktop-smoke.mjs. Output reali, con soli spazi a fine riga rimossi per Markdown:

### build — exit 0

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2412 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-pN1N-dEe.css               45.73 kB │ gzip:  10.56 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-qsGKJ-59.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-C9S9kaM_.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-82GBY_vP.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-DugKEgZk.js         20.56 kB │ gzip:   7.03 kB
dist/assets/GridEditor-DpyLzQHz.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-CTUhEFW8.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Vzw8i3fV.js             2,320.77 kB │ gzip: 696.13 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.13s
```

### unit — exit 0

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (70.4303ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (67.9981ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (117.6433ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (177.0766ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (24.065ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (38.563ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (31.9647ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (29.0798ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.0561ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (2.4634ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (60.4631ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.4056ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (91.3876ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (89.1891ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.2245ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4138ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.3797ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.4436ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.2859ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.1253ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (154.6612ms)
✔ references, arithmetic, precedence and percentages (4.9764ms)
✔ Italian aliases, absolute references, text and lazy IF (1.3461ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8986ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.1123ms)
✔ Excel address limits and column naming (2.0191ms)
✔ conditional sums, lookups, text, dates and error handling (5.0929ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.7812ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.6181ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.0078ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.8546ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.5721ms)
✔ Il processo principale non contiene updater o caricamenti da server (10.0406ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (252.433ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (43.9159ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.6697ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (113.5053ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.2493ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (2.5093ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (54.5587ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (111.1367ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (43.0611ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.3557ms)
✔ unsupported parts produce specific warnings without changing the original file (37.6206ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (15.618ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.6201ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (836.9917ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1863.5155ms)
ℹ tests 48
ℹ suites 0
ℹ pass 48
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3144.3906
```

### browser — exit 0

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs

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
15:54:43 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
PASS grafici: categorie nelle celle, nuovi XLSX senza fogli nascosti, dati aggiornati e file riaperti; vecchia anteprima in sola lettura con copia identica; grafici esterni con export bloccato; nessuna richiesta esterna.
PASS prova guidata nel browser: 24 radio, rapporto aggiornato e schermata acquisita.
```

### openxml — exit 0

```text
> cosmoffice@0.2.2 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> V:\CosmonetOffice\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
V:\CosmonetOffice\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:02.70
PASS V:\CosmonetOffice\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS V:\CosmonetOffice\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL V:\CosmonetOffice\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL V:\CosmonetOffice\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
FAIL V:\CosmonetOffice\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
[Part Uri=/xl/drawings/cosmoDrawing1.xml],
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml],
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
```

### offline — exit 0

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

### desktop — exit 0

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

Altri controlli effettivi, exit 0:

```text
PASS struttura workflow release
Configurazione release verificata.
PASS anteprima note generata dal CHANGELOG, API non contattate
```

Il controllo di configurazione è stato eseguito con GITHUB_REF_NAME=v0.2.2 senza segreti di firma. I test del publisher usano API simulate: non sono pubblicazioni reali. Il primo test preparatorio stampava la risposta simulata come “Release pubblicata”; il log è stato spostato nel solo entry point CLI per non creare equivoci. La suite completa successiva non stampa un falso upload.

Le righe FAIL del SDK sono controlli negativi intenzionali e la copia storica autorizzata: 13 nuovi esportati senza errori, nessuna eccezione per essi. Avvisi rimasti: chunk Vite grande, indicizzazione PDF nel campione difettoso, NU1900 per audit NuGet non raggiungibile.

### CI degli ultimi sei commit prima di questo passo

Verificati i singoli lavori GitHub, non soltanto il colore della pagina:

| Commit | Run | Esito |
| --- | --- | --- |
| 94d93db | [45034728552](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45034728552) | 5/5 success |
| e0fe801 | [45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708) | 5/5 success |
| e8faf0b | [45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005) | 5/5 success |
| 9e3173e | [45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220) | 5/5 success |
| 5a493a4 | [45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835) | 5/5 success |
| 3185603 | [45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728) | 5/5 success |

Ogni run comprende checks, interop e pacchetti Windows/Linux/macOS. La CI del nuovo commit e la run del tag non esistono ancora al momento di scrivere questo file: saranno controllate dopo il push. I relativi esiti, gli asset pubblici e i checksum effettivi saranno riportati nel prossimo report operativo.

## 4. Cosa funziona, provato

48 test passati. Il publisher genera checksum e note con piattaforme mancanti dichiarate e programma una Release ordinaria, non una prerelease. La configurazione non richiede segreti di firma nel percorso di anteprima. Browser, corpus, SDK e offline sono verdi. Il pacchetto Windows locale apre DOCX/XLSX/PDF, ruota e riapre il PDF con verifica Poppler, conserva l’originale in caso di errore e non tenta rete.

## 5. Cosa NON funziona o non hai potuto provare

La pubblicazione effettiva della nuova Release, /releases/latest e il download anonimo dei nuovi installer **non sono ancora provati al momento di questo commit**: serve prima il push di codice e tag. Non dichiariamo pubblicato un risultato di API simulate.

Installazione su computer puliti, avvio AppImage su distribuzioni reali, Windows SmartScreen su macchina nuova e hardware Mac non provati. Desktop-smoke usa il pacchetto Windows già costruito, non l’installer pubblico appena generato. DMG Mac e updater non sono inclusi in questo passo. Il codice attuale continua a bloccare la rete.

## 6. Bug e dubbi

Il vecchio workflow firmato impediva l’anteprima pubblica senza certificati: il nuovo percorso è esplicitamente senza firma, senza fallback silenzioso. La sola pubblicazione ancora dipende dai permessi contents: write di GITHUB_TOKEN nella CI; non da segreti di firma. Errori di upload lasciano la bozza non pubblicata e vanno diagnosticati prima di riprovare.

Limiti documentali e vecchio XLSX con MIME difettoso restano invariati. Non è certificata la compatibilità totale Office. Nessun host updater è autorizzato o contattato dall’app in questo commit.

## 7. Hash del commit

Base: 94d93db7cbf63da5a62b75e55f99b66b789818fe. Questo passo si identifica con git log -1 --format=%H -- docs/report/2026-11-22_1600_release-windows-linux.md; l’hash proprio non può essere inserito nello stesso commit senza modificarlo. Verrà comunicato dopo commit e push, insieme alla run del tag quando disponibile.

## 8. Prossimo passo

Push su main dopo pull --rebase, creazione e push del tag v0.2.2. Seguire la run, diagnosticare eventuali errori, verificare /releases/latest e scaricare anonimamente installer e checksum confrontandoli. Poi DMG Mac non firmati Intel/Apple Silicon e guida “Aprire CosmOffice su Mac”; aggiornare CI e report. Soltanto in un commit successivo implementare il trasporto TLS Node autorizzato con tutte le otto condizioni.
