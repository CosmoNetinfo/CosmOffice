# DMG Mac non firmati, guida e stato CI

## 1. Obiettivo

Aggiungere DMG Intel e Apple Silicon alla Release ordinaria 0.2.2, senza certificati o notarizzazione, guida con titolo esatto “Aprire CosmOffice su Mac” e stato onesto delle ultime CI. Windows e Linux già pubblici devono restare intatti. Trasporto TLS Node rinviato al commit successivo, senza altre idee dello studio.

## 2. Cosa hai fatto

- electron-builder.config.cjs: anteprima con identity:null, hardenedRuntime:false, notarize:false; vecchio percorso firmato esplicito separato.
- .github/workflows/release-mac.yml: due build indipendenti x64/arm64, sorgenti dell’app confrontati con il tag, hdiutil verify, lipo per architettura e controllo Developer ID assente; pubblicazione dei DMG riusciti senza sostituire Windows/Linux.
- .github/workflows/release.yml: futuri tag costruiscono anche entrambi i DMG, con fail-fast disattivato e verifica del contenitore.
- scripts/publish-preview.mjs: nomi DMG verificati nei log reali della precedente CI, elenco delle quattro piattaforme e istruzioni Mac nelle note.
- scripts/complete-preview.mjs: se Mac fallisce completamente aggiorna soltanto le note con il fallimento; nessun installer o checksum esistente cancellato. Con pacchetti nuovi aggiunge file e checksum, conserva gli hash precedenti e rigenera il riepilogo.
- tests/release-preview.test.mjs: configurazione Mac realmente senza identità/firma forzata/notarizzazione; caso senza pacchetti e failure nelle note, nessuna cancellazione.
- README.md: sezione esatta “Aprire CosmOffice su Mac”, passi del primo avvio e dichiarazione di mancato collaudo su computer fisici.
- docs/MAC.md: guida, checksum, differenza fra verifiche CI e prova di avvio reale.
- docs/CI.md: nove ultimi commit principali con link e stato verificato, run di pubblicazione e correzione Linux.
- CHANGELOG.md, docs/DECISIONI.md, docs/ROADMAP.md, docs/VALIDATION.md e docs/ricerca/CODICE-STUDIATO.md: stato, fonti consultate e decisione autorizzata.
- docs/report/2026-11-22_1837_dmg-mac-e-ci.md e docs/report/ULTIMO.md: report e copia.

Nessuna modifica a src/ o electron/ e nessuna nuova dipendenza. node scripts/notices.mjs: exit 0, “Attribuzioni e licenze raccolte.”; avvisi invariati.

Fonti: [supporto Apple](https://support.apple.com/it-it/102445), metadati e codice compilato già installato di app-builder-lib 26.18.0 MIT (macPackager.js, MacTargetHelper.js, macCodeSign.js), package.json e licenza del progetto electron-builder installato. File e tipo di materiale nel registro. Nessun codice copiato. Il tag GitHub v26.18.0 non era disponibile e non è inventato come riferimento: si identifica la versione npm e il lockfile.

## 3. Esiti reali di build e test

Una prima esecuzione completa è passata. Dopo aver aggiunto la gestione del fallimento completo Mac e il relativo test, sono stati ripetuti build e tutti i controlli sul codice definitivo, con gli output seguenti. Non si tratta di una costruzione DMG locale su Windows.

Comandi: npm run build; npm test; npm run test:browser; npm run test:openxml; node scripts/offline-smoke.mjs; node scripts/desktop-smoke.mjs. Tutti exit 0; soli spazi finali rimossi dagli output:

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
✓ built in 1.14s
```

### unit — exit 0

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (69.4612ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (65.5054ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (121.4852ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (179.9026ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (32.8605ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (34.3255ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (37.5123ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (25.1035ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.2502ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (2.2086ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (49.5777ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.4945ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (96.0598ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (81.8068ms)
✔ unknown formulas retain their source without exporting a misleading cached number (20.5014ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4266ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.0322ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.1407ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.8073ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.8229ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (155.5306ms)
✔ references, arithmetic, precedence and percentages (4.6848ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0461ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.1051ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.7114ms)
✔ Excel address limits and column naming (3.1063ms)
✔ conditional sums, lookups, text, dates and error handling (5.0213ms)
✔ quoted sheet names, absolute references and cycles across sheets (1.0987ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.5622ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.807ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.9524ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.4092ms)
✔ Il processo principale non contiene updater o caricamenti da server (10.5283ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (255.3244ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (41.2628ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (12.3103ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (108.1988ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (19.3919ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.6851ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (66.5539ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.3484ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (38.1276ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (109.9366ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (41.7307ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.842ms)
✔ unsupported parts produce specific warnings without changing the original file (39.3916ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.1071ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.7124ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (837.7394ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1843.5116ms)
ℹ tests 50
ℹ suites 0
ℹ pass 50
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3126.148
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
18:30:53 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:00.33
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

Controllo YAML, exit 0:

```text
PASS YAML release e DMG Mac
```

git diff --check: iniziale riga vuota di documentazione a fine VALIDATION rimossa; controllo finale exit 0 e output vuoto. Nessun errore applicativo nascosto. I FAIL SDK sono i negativi intenzionali e la vecchia copia XLSX autorizzata; 13 nuovi esportati validi.

## 4. Cosa funziona, provato

50 test e tutti i controlli locali passati. La configurazione Mac non richiede né seleziona certificati. Il publisher tratta esplicitamente il caso Mac senza output e conserva gli asset esistenti. L’interfaccia e i documenti dell’app restano quelli della Release.

La build precedente b769647 produceva già i nomi DMG mac-x64 e mac-arm64, verificati nei log della run 45047079340; ciò non è presentato come verifica dei nuovi controlli aggiunti qui. I nuovi job hdiutil/lipo e upload si eseguiranno solo dopo il push.

**Screenshot conclusi:** commit 5ee891b pubblicato. Verificata senza account la pagina GitHub del repository, i nove riferimenti PNG del README, ogni risposta HTTP 200 con Content-Type image/png e identità byte per byte con i file locali. Tutte nove immagini passano. Rigenerazione: npm run build, poi node scripts/screenshots.mjs; guida in docs/SCREENSHOTS.md. Nessuna modifica manuale delle immagini o dati personali.

**Release Windows/Linux conclusa:** ordinaria su /releases/latest e tag v0.2.2; download anonimo e SHA-256 verificati. Windows ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a, Linux 6eb41f36df41d6bcfc1876430ae21abd0bbd59dc9cd7e26d8d4f476e17253792. Il completamento Mac deve preservarli.

## 5. Cosa NON funziona o non hai potuto provare

**Non provato:** hardware Mac fisico, Gatekeeper al primo avvio con il nuovo download, installazione su computer puliti e uso degli editor su Mac. La guida lo dichiara in modo esplicito.

Al momento di questo commit i nuovi DMG non sono ancora stati pubblicati dalla nuova run: niente falso successo di hdiutil/lipo eseguiti su Windows. Stato e download dei nuovi asset saranno verificati dopo il push. Se Mac diventa rosso, lo si riporterà: Windows/Linux già pubblici non verranno rimossi né bloccati.

Nessun updater TLS Node incluso o installazione automatica provata. Nessuna modifica chirurgica dei grafici esterni o nuovo motore implementati.

## 6. Bug e dubbi

DIST-001 Linux risolto con prova pubblica; si sono controllati i nomi DMG effettivi prima di configurarli. Firma Vendor di eventuali componenti Electron non è firma Developer ID applicata da CosmOffice; il percorso di build salta esplicitamente la firma dell’app.

Nessun pacchetto nuovo: il publisher Mac può aggiornare solo le note con failure, senza sostituire checksum. Pacchetti nuovi: solo il riepilogo checksum viene sostituito dopo gli upload; l’API non offre sostituzione atomica del riepilogo. Installer già pubblici mai sostituiti automaticamente.

Avvisi rimasti nei log: chunk Vite grande, PDF indicizzato nel campione negativo e audit NuGet non raggiungibile. Test e build passati non equivalgono a compatibilità Office completa. Vecchio XLSX conserva il difetto MIME come eccezione autorizzata.

## 7. Hash del commit e CI

Base 5ee891b (screenshot). Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-22_1837_dmg-mac-e-ci.md; verrà comunicato dopo il push.

[Stato completo delle nove CI](../CI.md), tutti i cinque lavori principali success per ciascuna:

- 5ee891b: [45048363758](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45048363758).
- b769647: [45047079340](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079340).
- 2128469: [45035934913](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035934913).
- 94d93db: [45034728552](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45034728552).
- e0fe801: [45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708).
- e8faf0b: [45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005).
- 9e3173e: [45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220).
- 5a493a4: [45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835).
- 3185603: [45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728).

Pubblicazione tag [45035965421](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035965421) e completamento Linux [45047079344](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079344): success, con asset realmente controllati dopo DIST-001. Le nuove run Mac di questo commit non esistono ancora al momento della scrittura e saranno controllate dopo il push.

## 8. Prossimo passo

Push dopo pull --rebase; seguire la nuova run Mac e la CI principale. Verificare DMG, checksum e preservazione di Windows/Linux con download anonimo. Aggiornare il report con eventuali rossi Mac senza bloccare gli altri pacchetti. Poi, in un commit distinto, trasporto TLS Node con HTTPS verificato, host chiusi anche nei redirect, nessuna richiesta con controllo spento, intestazioni minime, SHA-256, conferma prima dell’installazione, audit Node e NetLog Chromium senza connessioni.
