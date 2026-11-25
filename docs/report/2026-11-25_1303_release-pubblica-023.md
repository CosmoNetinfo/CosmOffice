# Release pubblica CosmOffice 0.2.3 (anteprima)

## 1. Obiettivo

Pubblicare la versione aggiornata autorizzata dal titolare, con installer Windows/Linux e DMG Mac, note sincere e checksum. Verificare download senza account e feed degli aggiornamenti Windows. Completato: Release ordinaria [v0.2.3](https://github.com/CosmoNetinfo/CosmOffice/releases/tag/v0.2.3), id 458039039, raggiunta da [/releases/latest](https://github.com/CosmoNetinfo/CosmOffice/releases/latest).

## 2. Cosa hai fatto

- README.md, docs/AGGIORNAMENTI.md, ROADMAP.md: Release pubblica e distinzione dal precedente stato di prova; primo passaggio manuale dalla 0.2.2 o da build già numerate 0.2.3.
- CHANGELOG.md: note 0.2.3 e stato documentazione in Non rilasciato; nessuna nuova versione o funzione aggiunta nel controllo finale.
- docs/BUG.md, VALIDATION.md, CI.md, DECISIONI.md: esiti reali, primo fallimento Mac e recupero dichiarati, limiti fisici conservati.
- docs/report/2026-11-25_1303_release-pubblica-023.md e docs/report/ULTIMO.md: copia di questo report, inclusi output e hash.

La Release usa i sorgenti applicativi del tag bbad3f6; per i DMG il workflow di completamento ha verificato identici src/, electron/, public/ e manifesti npm prima della build. Nessun installer pubblico 0.2.2 sostituito. Nessuna modifica ai motori, alle condizioni LICENSE, al rapporto tester, alla Prova guidata o alla politica degli aggiornamenti.

## 3. Esiti reali di build e test

Tre sequenze locali: 17 comandi verdi prima della preparazione (report 2026-11-25_1236), 17 prima della correzione DMG (report 2026-11-25_1248), e i 12 richiesti nuovamente prima di questo push documentale, tutti exit 0. 73 test unitari passati, zero fallimenti. Di seguito gli output integrali della terza sequenza (solo ANSI e percorsi personali sostituiti). I FAIL SDK sono i due controlli negativi e la copia storica immutata, non errori dei 13 nuovi esportati.

### npm run build — exit 0

```text

> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2416 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.01 kB │ gzip:   0.51 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-rY2NpnMD.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BSHHaqIc.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-rKan74uA.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-Brb5dcWk.js         24.10 kB │ gzip:   8.19 kB
dist/assets/MarkdownEditor-DRFsXuKN.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-ByTPASlU.js          203.80 kB │ gzip:  70.76 kB
dist/assets/import-docx-0jbPGvRB.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-Inivkjgl.js             2,322.90 kB │ gzip: 696.69 kB

✓ built in 1.17s
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (75.6096ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (90.8364ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (133.7504ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (193.0814ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (24.1359ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (36.1957ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (30.6469ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (27.04ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.5364ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.5504ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (37.6411ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.8782ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.9855ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (79.6524ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.3318ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3488ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.6628ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.2743ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.6044ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.8552ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (153.4471ms)
✔ references, arithmetic, precedence and percentages (5.7123ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0416ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8399ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.7239ms)
✔ Excel address limits and column naming (1.5143ms)
✔ conditional sums, lookups, text, dates and error handling (4.0622ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5547ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4213ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.974ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6959ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.8794ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.4213ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.458ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.2649ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (238.3965ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (50.8577ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (12.2159ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (144.4805ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (19.3783ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.8972ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (2.9105ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (67.6639ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.5446ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (37.9018ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (117.8863ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (33.5339ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.2035ms)
✔ unsupported parts produce specific warnings without changing the original file (34.2042ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.187ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.9879ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (900.5708ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1846.7493ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.9246ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.4853ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.0976ms)
✔ TLS Node: errore di certificato senza fallback (0.9676ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (18.3622ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.6754ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (125.0224ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.669ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (3.9077ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (148.251ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.222ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.1559ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (20.0867ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (23.4432ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (9.5135ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.1784ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (27.305ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.6949ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (35.6823ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.1189ms)
ℹ tests 73
ℹ suites 0
ℹ pass 73
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3185.8593
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs

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
PASS Informazioni browser: versione 0.2.3, testi uguali ai file locali, attribuzioni, migrazione vecchio attivo e nessuna richiesta esterna.
PASS Markdown browser: creazione, apertura UTF-8/BOM/CRLF, modifica, export identico, riapertura dopo ricarica, backup, vuoto, HTML ostile, file grande, 390px, nessuna rete esterna.
12:52:59 [vite] (client) [console.warn] Warning: Indexing all PDF objects
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> <cartella>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
<cartella>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:02.05
PASS <cartella>\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS <cartella>\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS <cartella>\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL <cartella>\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL <cartella>\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
FAIL <cartella>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
[Part Uri=/xl/drawings/cosmoDrawing1.xml],
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml],
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
```

### node scripts/offline-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "checks": [
    "Avvio Electron da file locale",
    "Nessun tentativo spontaneo di rete dal processo principale",
    "Controllo aggiornamenti spento: zero richieste nell’audit Node",
    "DOCX, XLSX e PDF aperti senza connessioni",
    "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
    "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
  ],
  "errors": []
}
```

### node scripts/desktop-smoke.mjs — exit 0

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

### node scripts/update-network-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "package": false,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/update-network-smoke.mjs --package — exit 0

```text
{
  "result": "PASS",
  "package": true,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### node scripts/legal-smoke.mjs --package — exit 0

```text
PASS Informazioni pacchetto: file locali identici, attribuzioni, percorso arbitrario respinto e zero richieste Node.
```

### node scripts/package-resources-check.mjs — exit 0

```text
{
  "result": "PASS",
  "checked": [
    {
      "package": "CosmOffice-0.2.3-win-x64-Setup.exe",
      "version": "0.2.3",
      "hashes": {
        "LICENSE": "f2649c4c63c51b60799de533efbc3c09a71639df963f677492bbe5e865f9006f",
        "THIRD_PARTY_NOTICES.txt": "8e5674f231a242ced415f0bdd5589f8a0abe2960ae0eeefbb8f3946a9ba5d6db"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

### node test-results/release023/postpub/checks.mjs — exit 0

```text
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
PASS motori Office/PDF, diagnostica, prova guidata, aggiornamenti, corpus e LICENSE invariati.
PASS versione 0.2.3, tag 0.2.3 autorizzato, marked 18.3.0 attribuito.
PASS note Release 0.2.3 complete, generabili dal CHANGELOG e passaggio manuale documentato.
PASS script e sorgenti app invariati rispetto al commit del completamento Mac.
```

### Audit pubblico reale — exit 0

Richieste senza cookie, credenziali o account. HTTP 200 su latest, redirect al tag 0.2.3; nomi presenti nella pagina pubblica degli asset. Quattro file verificati: SHA-256 dei byte uguale a manifesto, relativo sidecar e digest GitHub. I download Windows/Linux eseguiti nell’audit iniziale sono stati riusati e ricontrollati nell’audit a quattro file; entrambi i DMG scaricati dopo il completamento.

```json
{
  "status": "PASS",
  "latest": "https://github.com/CosmoNetinfo/CosmOffice/releases/tag/v0.2.3",
  "tag": "v0.2.3",
  "releaseId": 458039039,
  "files": [
    {
      "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
      "size": 128054418,
      "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
      "anonymous": true
    },
    {
      "name": "CosmOffice-0.2.3-linux-x86_64.AppImage",
      "size": 134077592,
      "sha256": "fe58fecf61bf4cd2b19fe17a05f4196cf96c39d1b23d29d7b3006d917808c9df",
      "anonymous": true
    },
    {
      "name": "CosmOffice-0.2.3-mac-x64.dmg",
      "size": 133116716,
      "sha256": "422d518ad732db0e99aba036a3fb67618de4a5bde4ad6043c16c5a6d64fe4bd6",
      "anonymous": true
    },
    {
      "name": "CosmOffice-0.2.3-mac-arm64.dmg",
      "size": 129075842,
      "sha256": "4a690b26e84745ce633ad37beb86977815a0a94fafef739ac9413949f39241ef",
      "anonymous": true
    }
  ],
  "metadata": {
    "name": "CosmOffice 0.2.3 (anteprima)",
    "draft": false,
    "prerelease": false
  },
  "manifest": "fe58fecf61bf4cd2b19fe17a05f4196cf96c39d1b23d29d7b3006d917808c9df  CosmOffice-0.2.3-linux-x86_64.AppImage\n4a690b26e84745ce633ad37beb86977815a0a94fafef739ac9413949f39241ef  CosmOffice-0.2.3-mac-arm64.dmg\n422d518ad732db0e99aba036a3fb67618de4a5bde4ad6043c16c5a6d64fe4bd6  CosmOffice-0.2.3-mac-x64.dmg\n0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18  CosmOffice-0.2.3-win-x64-Setup.exe\n"
}
```

```text
PASS note pubbliche identiche al generatore CHANGELOG: novità, limiti, prove mancanti, prossimi passi, domande Facebook e primi job Mac falliti dichiarati.
PASS vecchia Release 0.2.2: titolo, corpo, ID asset, dimensioni e digest invariati.
```

Il primo confronto delle note era fallito: i fine riga Windows erano CRLF, quelli prodotti dalla CI Linux LF (prima differenza al carattere 177). Verificata uguaglianza completa dopo sola normalizzazione CRLF→LF; controllo corretto e ripetuto, passato. Nessuna frase o sezione ignorata; nessun difetto nei contenuti pubblicati.

### Controllo dell’installer Windows pubblico e del feed reale

```json
{
  "result": "PASS",
  "checked": [
    {
      "package": "CosmOffice-0.2.3-win-x64-Setup.exe",
      "version": "0.2.3",
      "hashes": {
        "LICENSE": "f2649c4c63c51b60799de533efbc3c09a71639df963f677492bbe5e865f9006f",
        "THIRD_PARTY_NOTICES.txt": "8e5674f231a242ced415f0bdd5589f8a0abe2960ae0eeefbb8f3946a9ba5d6db"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

Prova dell’updater nel pacchetto: download effettivo 0.2.3 verificato e nessun installer eseguito.

```json
{
  "status": "PASS",
  "downloaded": {
    "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
    "size": 128054418,
    "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
    "integrity": true,
    "installed": false
  },
  "startupNodeRequests": 0,
  "chromiumConnections": 0,
  "networkOffAfterwards": true
}
```

### CI e recupero Mac

- [Main bbad3f6, 45606070290](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45606070290): sei lavori success, inclusa installazione/disinstallazione NSIS reale nel runner.
- [Prima pipeline del tag, 45606125748](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45606125748): conclusione failure. Controllo comune, Windows, Linux e pubblicazione success; i due job Mac falliscono dopo la costruzione del DMG nel controllo che cerca anche l’altra architettura. Questa run non viene dichiarata verde.
- [Completamento Mac, 45608286513](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45608286513): x64, arm64 e pubblicazione tutti success. Licenze/ASAR, hdiutil, architettura e assenza Developer ID verificati. Solo i DMG mancanti aggiunti; Windows/Linux preservati, manifesto aggiornato dopo gli upload.
- CI della correzione dfa6c7e: [45608286556](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45608286556), tutti e sei i lavori completed/success, inclusa installazione/disinstallazione NSIS reale. Verificata di nuovo il 25 novembre prima del push finale. Nessun esito futuro della CI di questo report anticipato.

Errori reali originali:

Job 139180581549:

```text
2026-11-25T11:44:07.7081740Z   • building        target=DMG arch=arm64 file=release/CosmOffice-0.2.3-mac-arm64.dmg
2026-11-25T11:44:37.1134500Z   • building block map  blockMapFile=release/CosmOffice-0.2.3-mac-arm64.dmg.blockmap
2026-11-25T11:44:44.0755600Z Error: Command failed: hdiutil attach -readonly -nobrowse -mountpoint /Users/runner/work/CosmOffice/CosmOffice/test-results/package-legal-be4d0bd7-3a6d-471f-9b9a-ea1e59e1889a/x64 /Users/runner/work/CosmOffice/CosmOffice/release/CosmOffice-0.2.3-mac-x64.dmg
2026-11-25T11:44:44.0757020Z hdiutil: attach failed - No such file or directory
```

Job 139180581749:

```text
2026-11-25T11:44:00.9071490Z   • building        target=DMG arch=x64 file=release/CosmOffice-0.2.3-mac-x64.dmg
2026-11-25T11:44:29.8490790Z   • building block map  blockMapFile=release/CosmOffice-0.2.3-mac-x64.dmg.blockmap
2026-11-25T11:44:37.8694600Z Error: Command failed: hdiutil attach -readonly -nobrowse -mountpoint /Users/runner/work/CosmOffice/CosmOffice/test-results/package-legal-c2f9ffc1-3561-42d1-9a4e-73225ce5aea4/arm64 /Users/runner/work/CosmOffice/CosmOffice/release/CosmOffice-0.2.3-mac-arm64.dmg
2026-11-25T11:44:37.8697750Z hdiutil: attach failed - No such file or directory
```

## 4. Cosa funziona, provato

Release ordinaria pubblica intitolata «CosmOffice 0.2.3 (anteprima)», draft false, prerelease false. Quattro installer, quattro sidecar e SHA256SUMS.txt, nove asset. Download pubblico senza account; corrispondenza dei tre riferimenti di integrità ai byte scaricati. Feed latest versione 0.2.3 riconosciuto dal parser dell’app con i quattro pacchetti. Smoke aggiornamenti ripetuti dopo la pubblicazione: download reale della 0.2.3, host ammessi soltanto, dominio estraneo bloccato, zero rete all’avvio e spegnimento al termine.

| File | Byte | SHA-256 |
| --- | ---: | --- |
| CosmOffice-0.2.3-win-x64-Setup.exe | 128054418 | 0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18 |
| CosmOffice-0.2.3-linux-x86_64.AppImage | 134077592 | fe58fecf61bf4cd2b19fe17a05f4196cf96c39d1b23d29d7b3006d917808c9df |
| CosmOffice-0.2.3-mac-x64.dmg | 133116716 | 422d518ad732db0e99aba036a3fb67618de4a5bde4ad6043c16c5a6d64fe4bd6 |
| CosmOffice-0.2.3-mac-arm64.dmg | 129075842 | 4a690b26e84745ce633ad37beb86977815a0a94fafef739ac9413949f39241ef |

I due installer Windows/Linux conservano gli stessi ID e digest fra prima pubblicazione e completamento Mac. I due DMG sono stati controllati nelle risorse durante la build corretta e il loro contenuto di licenza non è dedotto dalla sola configurazione. La versione propria di tutti i pacchetti è 0.2.3.

Note italiane dal CHANGELOG: novità (Markdown, aggiornamenti su richiesta, Informazioni e licenze locali), correzioni, limiti, prove mancanti, prossimi passi, istruzioni per pacchetti non firmati e quattro domande Facebook. Nessun certificato o segreto di firma necessario. Titolo esatto «Aprire CosmOffice su Mac» presente nel README. Vecchio tag/asset 0.2.2 invariati. Git v0.2.3 ancora sul commit originale, senza force.

## 5. Cosa NON funziona o non hai potuto provare

Suite ancora di anteprima: compatibilità Office parziale e tutti i limiti DOCX/XLSX/PDF/Markdown dichiarati nel CHANGELOG. Nessuna firma/notarizzazione, nessuna certificazione di sicurezza o fedeltà completa. SHA-256 dalla stessa fonte HTTPS non equivale a una firma indipendente.

Non provati: PC Windows fisico pulito, SmartScreen, UAC con antivirus e utente normale, completamento di un aggiornamento tra due Release pubbliche su PC fisico, AppImage realmente in uso, Mac fisico/Gatekeeper. Il titolare ha detto di aver installato su Windows, senza confermare versione, PC pulito o singoli esiti: non trasformato in collaudo riuscito. La prova NSIS reale nel runner non sostituisce quel PC e non collauda il selettore file manuale. Il consenso dell’updater usa uno spy e non lancia un vero installer sul PC dell’utente. Revisione professionale della licenza ancora necessaria.

Le vecchie 0.2.2 richiedono un primo aggiornamento manuale; una build di prova già chiamata 0.2.3 non trova come aggiornamento un’altra 0.2.3: installare manualmente questa Release. Il pulsante cerca numeri superiori; controlli periodici spenti di default e nessuna rete all’avvio, senza modifiche a questa scelta.

## 6. Bug e dubbi

CI-MAC-001 corretto e verificato nel completamento: selettore esplicito per la singola architettura, default su entrambe conservato. Il tag e la prima run storica non sono riscritti; la failure resta documentata nelle note e qui. Nessun installer esistente eliminato; solo riepilogo checksum rigenerato dopo gli upload. Limiti MD-001/002 e documentali ancora validi. Avviso Vite sul bundle grande ancora presente, riportato negli output. Nessuna nuova idea dello studio o scelta del motore.

## 7. Hash dei commit

- Release/tag v0.2.3 e preparazione: bbad3f6f877868b52ccd7c2873558f326eef8464.
- Correzione DMG e workflow di completamento: dfa6c7eacebad2ba32b208b26134f5333451e4d0.
- Commit di questo rapporto: git log -1 --format=%H -- docs/report/2026-11-25_1303_release-pubblica-023.md; comunicato dopo il push, perché non può essere scritto nello stesso contenuto di cui calcola l’hash.

## 8. Prossimo passo

Il titolare installa la Release ufficiale sul proprio Windows e compila la Prova guidata; invia eventuale rapporto nei commenti Facebook. Raccogliere esiti fisici su Windows, Linux e Mac e problemi dei documenti reali, senza pubblicare documenti personali. Future versioni superiori potranno essere trovate dal pulsante. Nessuna nuova versione, motore o funzione decisa in questo audit finale.
