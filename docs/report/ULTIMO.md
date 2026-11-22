# Nome e recapito del titolare nella licenza A

## 1. Obiettivo

Compilare il segnaposto del titolare con i dati forniti dall’utente: Daniele Spalletti, danielespalletti@cosmonet.info. Nessuna modifica alle condizioni della licenza A, all’app o alla Release.

## 2. Cosa hai fatto

- LICENSE: sostituito il segnaposto in copyright e clausola del titolare. Confronto automatico con la base: esattamente questa sostituzione, nessun altro cambiamento al testo.
- README.md e docs/LICENZA-BOZZE.md: nome e email nei testi correnti, eliminato lo stato di dato mancante.
- docs/DECISIONI.md e ROADMAP.md: provenienza esplicita dai dati dell’utente, revisione professionale ancora necessaria.
- docs/BUG.md e VALIDATION.md: titolare compilato, LIC-001 ancora aperto per i futuri pacchetti.
- CHANGELOG.md: stato aggiornato in Non rilasciato, voce Modificato.
- docs/CI.md: esito verificato della CI del precedente commit di adozione A.
- Questo report e copia identica docs/report/ULTIMO.md.

Non modificati i report storici. Non modificati src/, electron/, script e workflow tracciati, manifesti, configurazione di packaging, impostazione aggiornamenti, schermate NSIS, versioni, tag, pacchetti e Release. Nessun indirizzo fisico o ragione sociale aggiunti. Nome e email usati esattamente come forniti; nessuna ricerca su identità o dati personali. Nessuna nuova dipendenza o consultazione di codice esterno. scripts/notices.mjs rieseguito, attribuzioni invariate.

## 3. Esiti reali di build e test

Comandi finali tutti exit 0. Output reali copiati sotto, rimossi soltanto gli spazi finali. Anche per questo passo documentale eseguiti i controlli richiesti prima del push. Desktop-smoke usa il pacchetto locale già presente per il codice applicativo invariato; non dimostra inclusione della nuova licenza nel pacchetto.

### npm run build — exit 0

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
dist/assets/DebugReport-CTeVRXx7.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-CKBMplBJ.js            2.31 kB │ gzip:   1.05 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-CxLqW8Jz.js            10.95 kB │ gzip:   4.19 kB
dist/assets/SettingsPage-Dm24br45.js         21.41 kB │ gzip:   7.32 kB
dist/assets/GridEditor-CAFYgh1V.js          203.81 kB │ gzip:  70.75 kB
dist/assets/import-docx-0ES-Zfgs.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CZEScb41.js             2,321.36 kB │ gzip: 696.28 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.16s
```

### npm test — exit 0

```text

> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (66.5878ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (74.0084ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (124.5195ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (179.2653ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (32.8233ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (35.2834ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (32.8813ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (28.5367ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.3013ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.9252ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (50.0933ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.6451ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (105.3153ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (91.229ms)
✔ unknown formulas retain their source without exporting a misleading cached number (16.2481ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.9292ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.497ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (9.7588ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.6286ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.8338ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (167.3615ms)
✔ references, arithmetic, precedence and percentages (6.1642ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0899ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8439ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8576ms)
✔ Excel address limits and column naming (1.5674ms)
✔ conditional sums, lookups, text, dates and error handling (4.2171ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5635ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4394ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.1978ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.66ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.9561ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.9609ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (266.758ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (42.7224ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (14.1282ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (99.9989ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (22.5152ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.5304ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (74.9076ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (2.6096ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (48.3068ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (126.0667ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (36.6229ms)
✔ damaged files and mismatched Office extensions are rejected before import (12.3602ms)
✔ unsupported parts produce specific warnings without changing the original file (46.7848ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.2407ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (13.8211ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (985.4631ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1854.5887ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.5946ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.388ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.7772ms)
✔ TLS Node: errore di certificato senza fallback (0.7973ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (25.2281ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (7.5119ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.4442ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.8864ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (17.4745ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (25.224ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.217ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.7479ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (23.0962ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (1.1598ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (30.4981ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.5267ms)
ℹ tests 66
ℹ suites 0
ℹ pass 66
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3255.2775
```

### npm run test:browser — exit 0

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
23:29:34 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

### npm run test:openxml — exit 0

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

Tempo trascorso 00:00:02.65
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

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### Controlli documentali, ambito e YAML — exit 0

```text
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
PASS: LICENSE differisce solo per il segnaposto sostituito con i dati forniti; clausole A identiche alla sezione adottata.
PASS: testi correnti senza segnaposto, report storici e codice/packaging/aggiornamenti invariati.
```

## 4. Cosa funziona, provato

Nome e recapito presenti nei testi correnti; nessun segnaposto rimasto nei sei file verificati. LICENSE differisce dalla base esclusivamente per quei dati e coincide con le clausole A riportate nella documentazione. B non adottata. Build, 66 unitari, browser, SDK, offline, desktop e quattro YAML passati. Nuovi esportati SDK validi, controlli negativi respinti ed eccezione storica mantenuta. Non introdotte connessioni o modifiche alla scelta degli aggiornamenti.

## 5. Cosa NON funziona o non hai potuto provare

Revisione professionale della licenza ancora da eseguire: il testo non è consulenza legale. L’indicazione dei dati su richiesta dell’utente non è una verifica legale della titolarità.

LIC-001 resta aperto: i futuri pacchetti vanno allineati al testo adottato e ai dati del titolare; questo passo non modifica author/copyright storici o configurazione. La 0.2.2 pubblicata conserva l’assetto precedente: vecchio LICENSE nel tag, assenza del file della licenza propria nei quattro payload rilevata dall’audit precedente. Nessuna nuova ispezione degli archivi o sostituzione di asset in questo passo; non si dichiara incluso il nuovo testo negli installer.

Installazioni pulite, hardware Mac, completamento NSIS/UAC e AppImage reale in uso restano non provati. Nessuna nuova versione o tag creati.

## 6. Bug e dubbi

Nessun nuovo bug trovato o corretto e nessun comando finale fallito in questo passo. Eventuali avvisi Vite, SDK/NuGet e rifiuti dei file negativi sono mantenuti negli output reali sopra. LIC-001 e i limiti applicativi restano invariati. Nessun dato anagrafico ulteriore inventato.

## 7. Hash del commit e CI

Base: 4180acd0b7bc4109859058e8f254e0cab0c7db78. Hash del passo: git log -1 --format=%H -- docs/report/2026-11-22_2329_dati-titolare-licenza.md; comunicato dopo il push, perché non può essere incluso nel contenuto dello stesso commit.

CI della base 4180acd, verificata su GitHub: [45075768129](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45075768129), cinque lavori success (checks, interop, Windows, Linux, Mac). La nuova run esisterà dopo il push: sarà controllata e comunicata con il link e l’esito reale, senza verde anticipato.

## 8. Prossimo passo

Pull --rebase e push su main dopo i controlli; verifica della nuova CI. Restano revisione professionale e istruzioni per l’allineamento dei futuri pacchetti. Nessuna modifica alle condizioni A, alla preferenza iniziale aggiornamenti, a 0.2.2 o al motore documentale.
