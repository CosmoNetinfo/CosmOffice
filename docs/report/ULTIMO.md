# Release pubblica Android 0.2.3, build 3

## 1. Obiettivo

Pubblicare APK corretto e aggiornamenti Android autorizzati con «Fallo», senza cambiare Release desktop o latest.

## 2. Cosa hai fatto

- Release ordinaria https://github.com/CosmoNetinfo/CosmOffice/releases/tag/android-v0.2.3-3, titolo «CosmOffice Android 0.2.3 (anteprima, build 3)», make_latest=false. Note generate da CHANGELOG: novità, correzioni PDF, limiti, prove mancanti, prossimi passi e quattro domande «Cosa ti aspetti da CosmOffice?», risposte nei commenti Facebook.
- Cinque asset: APK firmato, ANDROID-UPDATE.json, due checksum individuali e SHA256SUMS.txt. Tutti riscaricati senza credenziali e confrontati con gli hash attesi. Chiave privata e password mai caricate. /releases/latest resta desktop v0.2.3.
- Payload unsigned CI a1149df identico al locale: SHA-256 e17554796e0fde62db4d70b7c8e232b0446dd71b23add03a94990f3bd3f4b0aa. ZIP artifact verificato con SHA-256 6bbcc420bfbb45a6d5f0825039fb2417b64cdf4af5ae8603e95dc302d4f7d0be. Certificato APK 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e, stessa chiave delle build precedenti.
- README/ANDROID con link pubblico, CI/VALIDATION/BUG/ROADMAP aggiornati con prove osservate, CHANGELOG, report e ULTIMO identici. Nessuna nuova modifica runtime in questo passo.
- Non toccati desktop 0.2.3 e 0.2.2 pubblici, LICENSE/condizioni, motori DOCX/XLSX/PDF, Prova guidata/rapporto tester o firma privata. Nessuna dipendenza aggiunta; notices eseguito e invariato.

## 3. Esiti reali di build e test

### CI osservata

- 045cea6: desktop https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064190 sei success; Android https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064203 success al secondo tentativo, primo ANR Pixel Launcher.
- 6bcefd6: desktop https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354242 sei success; Android https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354250 failure dopo nove PASS, secondo runner non registrato; correzione e516616.
- e516616: desktop https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501770 sei success; Android https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501778 due failure per ANR esterni Pixel Launcher/Messages, catture verificate; correzione del test a1149df.
- a1149df: Android https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46148736951 completed/success, nove casi, vero installatore, bozze conservate e probe HTTPS. Desktop https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46148737111 tutti sei i lavori success, anche Windows NSIS installato e disinstallato. Stato verificato prima della pubblicazione, imposto dal pubblicatore.

Il nuovo commit documentale avvierà la propria CI dopo il push: nessun esito futuro inventato. I precedenti fallimenti locali sono conservati nei report del 28 novembre 0907/1414, compreso il timeout Markdown non riprodotto, causa sconosciuta. La suite completa attuale passa senza indebolire asserzioni.

### Secondo timeout browser locale prima della suite finale — exit 1

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

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
locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Lettera professionale/ })[22m

    at V:\CosmonetOffice\scripts\reliability-smoke.mjs:25:69 {
  log: [
    "  - waiting for getByRole('button', { name: /Lettera professionale/ })"
  ],
  name: 'TimeoutError'
}
```

Il test di affidabilità isolato con errori/richieste/schermata diagnostica è poi passato. Nella suite finale è stato aggiunto solo un osservatore locale Playwright da test-results (nessuna modifica all’app o alle asserzioni); l’intera suite passa. I due timeout iniziali non sono stati riprodotti e la causa resta non accertata, quindi non vengono dichiarati corretti. La diagnostica conserva abort del worker su chiusura pagina e blocco CSP del campione HTML ostile, eventi previsti delle prove, senza nuovi errori non gestiti.

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### npm run build — exit 0

```text

> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.09 kB │ gzip:   0.53 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-BbtcNglp.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-1eY_n1gJ.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-CdRxfKpw.js               2.52 kB │ gzip:   1.21 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-DNZPJU-7.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-B4gigDOI.js         27.03 kB │ gzip:   8.96 kB
dist/assets/MarkdownEditor-3HgGdhT9.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-DMccLee0.js          203.80 kB │ gzip:  70.76 kB
dist/assets/import-docx-s2L4lFoO.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-BijVdz4n.js             2,324.72 kB │ gzip: 697.43 kB

[plugin builtin:vite-reporter] 
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.13s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Release Android: manifest coerente, stesso package e chiave, URL solo progetto (1.429ms)
✔ Release Android: note derivate dal solo CHANGELOG, complete e senza confondere desktop (0.6481ms)
✔ Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi (2.8329ms)
✔ Compatibilità Android: API esistente preservata, installazione idempotente (1.185ms)
✔ Compatibilità Android: costruttori non validi rifiutati (2.3554ms)
✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (11.8275ms)
✔ Android: soli permessi di rete aggiornamenti e installazione confermata, nessuno storage esteso (5.8916ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (71.9604ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (63.7701ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (117.334ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (173.3996ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (21.4312ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (38.291ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (31.8277ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (22.1208ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.1364ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7747ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (38.0353ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.0449ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (95.6515ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (81.9748ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.2203ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.6771ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (14.7179ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.3809ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.4876ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.9797ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (141.7285ms)
✔ references, arithmetic, precedence and percentages (5.6299ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0048ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.1809ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8126ms)
✔ Excel address limits and column naming (1.6128ms)
✔ conditional sums, lookups, text, dates and error handling (4.3579ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5776ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4153ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.693ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5677ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.3326ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.3752ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.908ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.3468ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (251.3869ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (41.4195ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (14.0873ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (117.4528ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (19.1828ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.3747ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (5.0986ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (78.5171ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.8547ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (66.4719ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (105.2366ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (33.9067ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.1882ms)
✔ unsupported parts produce specific warnings without changing the original file (34.4835ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.2903ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.9184ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (933.879ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1761.5198ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.5047ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.8687ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.8486ms)
✔ TLS Node: errore di certificato senza fallback (1.0824ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (23.7416ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (2.6934ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (129.2688ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.3056ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.9968ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.5082ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.7612ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.7973ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (22.3321ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (30.1824ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.2864ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.2419ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (24.4955ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.822ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (37.6573ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.7105ms)
ℹ tests 80
ℹ suites 0
ℹ pass 80
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3191.719
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

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
14:29:28 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
14:31:24 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
  Tutti i progetti sono aggiornati per il ripristino.
  OpenXmlCheck -> V:\CosmonetOffice\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.
    Avvisi: 0
    Errori: 0

Tempo trascorso 00:00:02.61
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

### node scripts/debug-smoke.mjs — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### node scripts/guided-smoke.mjs — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
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
        "THIRD_PARTY_NOTICES.txt": "d743f96b9aeb6e6281f4d4bad5bc8787c3c275787cdc7e34467ba5fbece19678"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

### node test-results/android/yaml-check.mjs — exit 0

```text
PASS YAML: android.yml
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
```

### node --check scripts/android-smoke.mjs — exit 0

```text

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

### CI Android: emulator-report.json

```text
{
  "result": "PASS",
  "emulator": true,
  "physicalDevice": false,
  "tests": 9,
  "realAndroidPicker": true,
  "realClipboard": true,
  "exportedFilesCheckedIndependently": true,
  "originalFilesUnchanged": true,
  "guestNetworkDisabledDuringDocuments": true,
  "updatesOffByDefault": true,
  "updatePolicyHashCertificateCancelTested": true,
  "realAndroidInstallerConfirmation": true,
  "realUpgradePreservesFourDraftsAndTheme": true,
  "liveGitHubCheck": true,
  "zeroUidBytesAtStartup": true,
  "networkEnabledForUpdateProbe": true
}
```

### CI Android: upgrade-install.log

```text
INSTRUMENTATION_STATUS: phase=USER_CONFIRMATION_REQUIRED
INSTRUMENTATION_STATUS_CODE: 2
INSTRUMENTATION_RESULT: shortMsg=Process crashed.
INSTRUMENTATION_CODE: 0
```

### CI Android: upgrade-preservation.log

```text
INSTRUMENTATION_RESULT: stream=PASS aggiornamento reale con consenso Android: quattro bozze e tema mantenuti, versione 4, nessuna richiesta all’avvio.

INSTRUMENTATION_RESULT: upgrade=PASS
INSTRUMENTATION_CODE: -1
```

### CI Android: update-online.log

```text
INSTRUMENTATION_RESULT: audit=[{"kind":"request","host":"github.com"},{"kind":"request","host":"github.com"},{"kind":"request","host":"github.com"}]
INSTRUMENTATION_RESULT: online=PASS
INSTRUMENTATION_RESULT: stream=PASS rete reale: zero byte UID all’avvio, controllo HTTPS GitHub manuale e trasporto spento al termine.

INSTRUMENTATION_CODE: -1
```

La riga «Process crashed» nella prima instrumentation è l’interruzione del processo durante la sostituzione della propria app. Non è usata come successo: il test richiede codice installato 4 e una seconda instrumentation che riapre effettivamente quattro bozze e il tema. Entrambe passate. Il peer per scaricare l’APK futuro è simulato, il vero PackageInstaller e il suo consenso no.

### Verifica pubblicazione e download anonimi

```json
{
  "result": "PASS",
  "tag": "android-v0.2.3-3",
  "head": "a1149df37f5a8cfc5efc7db96f14dca8c24be52b",
  "release": "https://github.com/CosmoNetinfo/CosmOffice/releases/tag/android-v0.2.3-3",
  "ordinary": true,
  "desktopLatestUnchanged": true,
  "assets": [
    {
      "name": "CosmOffice-0.2.3-android-3.apk",
      "sha256": "fbf21e2a3487bcf2ffc8cf8b3507846786132a535fb9c391996b46683987ba95",
      "url": "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-3/CosmOffice-0.2.3-android-3.apk",
      "anonymousDownload": true
    },
    {
      "name": "ANDROID-UPDATE.json",
      "sha256": "aa34e79304041c46be36430a343c15fa7384cfdff766b9e5cf316a5db3dfdc72",
      "url": "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-3/ANDROID-UPDATE.json",
      "anonymousDownload": true
    },
    {
      "name": "CosmOffice-0.2.3-android-3.apk.sha256",
      "sha256": "a8a40c8851ec4f699e44368410c0a15e9e37940b9e020fcd4171c4411a273739",
      "url": "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-3/CosmOffice-0.2.3-android-3.apk.sha256",
      "anonymousDownload": true
    },
    {
      "name": "ANDROID-UPDATE.json.sha256",
      "sha256": "87065ee99198fec2e5e8c81bd07228ba64693dbbdf9ca42935739e398821f93d",
      "url": "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-3/ANDROID-UPDATE.json.sha256",
      "anonymousDownload": true
    },
    {
      "name": "SHA256SUMS.txt",
      "sha256": "e479d749ce4b08ada5c70638c87c0b49dce192edf6a8cce36124a7fc3a8cb18c",
      "url": "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-3/SHA256SUMS.txt",
      "anonymousDownload": true
    }
  ]
}
```

## 4. Cosa funziona, provato

Ottanta unitari e sedici controlli locali verdi. Nove casi Android: apertura/modifica/salvataggio/riapertura DOCX/XLSX/PDF/MD, originali invariati e export letti indipendentemente, appunti Android, tema/licenze e blocco WebView. Controlli di host/repository/redirect, SHA-256, firma, timer e annullamento. Installazione debug 3→4 con consenso reale e mantenimento di quattro bozze e tema. Wi-Fi attivo nel probe finale: zero byte UID all’avvio, nessuna richiesta nativa implicita, tre richieste reali a github.com soltanto su controllo manuale e rete spenta al termine.

APK pubblico con correzione Promise.withResolvers nella pagina e nel worker; tre PDF di esempio passano anche senza l’API. Scaricamento anonimo verificato di tutti cinque gli asset pubblici e latest desktop invariato. Aggiornamenti Android spenti di default, manuale e periodici opt-in ogni sei ore in primo piano; sempre conferma prima dell’installazione.

## 5. Cosa NON funziona o non hai potuto provare

Telefono fisico con questa build, conferma dei PDF sul telefono segnalato, aggiornamento con chiave di distribuzione su dispositivo reale, Android dei produttori, tastiera virtuale/gesti e dispositivi con poca memoria. Il test installazione usa la chiave debug e un peer simulato; non certifica il download nativo di un futuro APK pubblico dal CDN, perché una versione successiva pubblica non esiste ancora. Il probe live ha contattato solo github.com; il CDN è verificato nella politica e nel download pubblico del pubblicatore, non in un aggiornamento telefonico reale.

Periodici solo con app in primo piano, non con app chiusa/background. Android può chiedere autorizzazione per installare da CosmOffice. Nessuna installazione silenziosa. Non Google Play. Niente stampa/Word→PDF/OCR Android; limite 10 MB per trasferimento e consueti limiti documentali. Nessuna nuova prova su PC Windows fisico pulito, SmartScreen/UAC/antivirus, AppImage reale in uso o Mac fisico.

## 6. Bug e dubbi

AND-014 resta aperto: catture native possono mostrare il frame precedente. I due ANR precedenti appartenevano a Pixel Launcher/Messages, provati nelle catture; nella run verde non compare externalEmulatorAnr, quindi la chiusura automatica dei due avvisi non è stata esercitata in questa run e non viene dichiarata provata. La CI verde prova le funzioni percorse, non la stabilità di ogni immagine o dispositivo. Timeout Markdown locale precedente non riprodotto e causa non accertata. Nessun problema nascosto.

Fonti usate: API Android PackageInstaller https://developer.android.com/reference/android/content/pm/PackageInstaller.SessionParams#setRequireUserAction(int), GitHub Release https://docs.github.com/en/rest/releases/releases#create-a-release, log/catture/manifesti del nostro progetto e file indicati in CODICE-STUDIATO. Nessun algoritmo esterno copiato, nuova dipendenza o scelta del motore.

## 7. Hash dei commit

- 6bcefd6f00ce4d8bca8b393ef24c2c6c8988a416: implementazione updater/preparazione Release.
- e51661670724433d3a4580d827e7ae04df08f7c9: runner unico.
- a1149df37f5a8cfc5efc7db96f14dca8c24be52b: gestione circoscritta ANR esterni nel test, sorgenti del tag pubblico android-v0.2.3-3.
- Commit documentale contenente questo report: git log -1 --format=%H -- docs/report/2026-11-28_1435_android-release-pubblica.md. Non è inventato un hash autoreferenziale. Base al momento della scrittura: a1149df37f5a8cfc5efc7db96f14dca8c24be52b.

## 8. Prossimo passo

Sul telefono installare manualmente questo APK sopra build 1/2, senza disinstallare e dopo esportazione di copie dei documenti importanti. Provare prima il PDF che dava errore. Dalla build 3 usare Impostazioni → Controlla aggiornamenti ora per le future versioni superiori. I periodici restano facoltativi. Raccogliere il rapporto senza dati personali nei commenti del post Facebook di CosmOffice; non inviare documenti o chiave di firma.
