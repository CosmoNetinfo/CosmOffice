# Android: APK firmato e primo collaudo funzionale completo

## 1. Obiettivo

Concludere la prima preparazione dell’APK Android autorizzato dal titolare, con nuova chiave privata, prove reali in emulatore, file verificati e limiti dichiarati. Non pubblicare una nuova Release né modificare quella desktop.

## 2. Cosa hai fatto

- README.md: primo collaudo Android e limiti, senza proporre come installer l’artifact unsigned.
- docs/ANDROID.md: otto casi passati, differenza debug/release, firma/payload, limiti della cattura e dispositivo fisico, istruzioni per ricostruire/provare.
- CHANGELOG.md, docs/ROADMAP.md, BUG.md (AND-011/012/013 verificati nel percorso provato, AND-014 aperto), VALIDATION.md e CI.md: stato aggiornato, cronologia degli errori preservata.
- Questo report e copia ULTIMO.md. Nessun codice src/, electron/, Android o script modificato in questo passo. Nessuna nuova dipendenza o attribuzione: core-js MIT già attribuito nel commit f60184a, notices rigenerati invariati.
- Consegna locale separata da Git: CosmOffice-0.2.3-Android.apk, sidecar SHA-256 e LEGGIMI.txt; copia verificata dell’APK firmato, 8.761.580 byte. Nessun APK, chiave o password aggiunti al repository.
- Non toccati motori/condizioni LICENSE, rapporto tester/Prova guidata, versione/tag, aggiornamenti desktop e pacchetti/Release pubblici 0.2.2/0.2.3.

## 3. Esiti reali di build e test

Commit 770596758c41a8cffefc4fe5f33b5f27d8cede93: [Android 46110959197](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959197) completed/success, tutti otto i casi e controlli host passati. [Desktop 46110959196](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196) tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS sul runner pulito. La prova CI non sostituisce un PC o telefono reale.

### CI dei commit Android precedenti — esiti osservati, non riscritti

| Commit | Android | Desktop |
| --- | --- | --- |
| 9421c6a | [46009717455](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455), failure prima dell’installazione, storage | [46009717586](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717586), sei success |
| d3f9aef | [46012068702](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068702), failure selettore/riapertura | [46012068280](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068280), sei success |
| a57fed7 | [46014692576](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692576), failure preparazione storage | [46014692885](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692885), cancelled |
| 427942b | [46016839526](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839526), failure ritorno azione SAVE del driver | [46016839517](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839517), sei success |
| f48c5b9 | [46051701831](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701831), failure tocco del driver non apre DOCX | [46051701838](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701838), sei success |
| 7e9f9c7 | [46053874675](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874675), DOCX PASS, input XLSX non applicato | [46053874698](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874698), sei success |
| 4912020 | [46056425324](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425324), DOCX/XLSX PASS, PDF rifiutato | [46056425321](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425321), sei success |
| effae92 | [46059522929](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522929), failure con causa PDF URL.parse/WebView 124 identificata | [46059522912](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522912), sei success |
| f60184a | [46061575296](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575296): tentativo 1 ANR Pixel Launcher, tentativo 2 DOCX/XLSX/PDF PASS, driver modello MD fallisce | [46061575262](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575262), sei success |
| 32232a6 | [46063967606](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967606), failure input B3 prima dell’export | [46063967642](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967642), sei success |
| 7705967 | [46110959197](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959197), otto casi e controlli finali success | [46110959196](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196), sei success |

I report datati precedenti conservano i log dei fallimenti, compreso il test browser interrotto da mie modifiche/rigenerazione mentre girava. Nessun errore viene presentato come successo. In questo passo: tutti 16 controlli locali exit 0; 75 test unitari, build/browser/Open XML/offline/desktop/aggiornamenti/pacchetto/YAML. Output integrali, con soli ANSI/percorsi personali/spazi finali normalizzati:

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
dist/assets/DebugReport-DFYIwS3f.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BF6AjW4l.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-BuIAeMDG.js               2.41 kB │ gzip:   1.18 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BZBx0KUz.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-DZf3hTRd.js         24.69 kB │ gzip:   8.40 kB
dist/assets/MarkdownEditor-Bc92OywY.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-h7KgLGG3.js          203.80 kB │ gzip:  70.77 kB
dist/assets/import-docx-Ctf4domh.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-C2WGQL4F.js             2,324.24 kB │ gzip: 697.27 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.11s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (13.1985ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.1384ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (67.8387ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (67.8899ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (118.805ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (183.9094ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (32.8006ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (47.4094ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (37.2323ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (23.8084ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.1849ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.8497ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (39.9241ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.0352ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (108.1391ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (78.3145ms)
✔ unknown formulas retain their source without exporting a misleading cached number (14.244ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4318ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.4764ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.5281ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.6863ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.9055ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (162.3265ms)
✔ references, arithmetic, precedence and percentages (4.1696ms)
✔ Italian aliases, absolute references, text and lazy IF (0.916ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7514ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.7067ms)
✔ Excel address limits and column naming (1.3184ms)
✔ conditional sums, lookups, text, dates and error handling (4.1298ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.7022ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4179ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.882ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.9527ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.5135ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.201ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.8089ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.6515ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (222.225ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (45.8773ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.5513ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (118.7547ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.3455ms)
✔ Release corrente: note complete per la versione realmente distribuita (8.1521ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.1815ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (68.4524ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.986ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (45.8477ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (122.5783ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (35.8894ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.5148ms)
✔ unsupported parts produce specific warnings without changing the original file (33.0461ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.5539ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (10.9561ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (847.9452ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1768.6436ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (4.9789ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (5.382ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.1905ms)
✔ TLS Node: errore di certificato senza fallback (2.001ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (22.9698ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.6959ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (123.3948ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.753ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (2.79ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (148.5788ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.298ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.26ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (17.8904ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (24.2776ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.5248ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.1421ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (24.0467ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.751ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (28.7623ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (6.1743ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3047.1407
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
06:14:30 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
06:16:28 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
  Tutti i progetti sono aggiornati per il ripristino.
  OpenXmlCheck -> <progetto>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.
    Avvisi: 0
    Errori: 0

Tempo trascorso 00:00:02.08
PASS <progetto>\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL <progetto>\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL <progetto>\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
FAIL <progetto>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
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

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### Gradle APK debug/test/release e lint — exit 0

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
Checking the license for package Android SDK Platform-Tools in <progetto>\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:clean
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug
> Task :app:checkDebugAarMetadata
> Task :app:processDebugNavigationResources
> Task :app:generateDebugResValues
> Task :app:compileDebugNavigationResources
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:mergeDebugResources
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:processDebugManifestForPackage
> Task :app:desugarDebugFileDependencies
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
> Task :app:mergeDebugJavaResource
> Task :app:compressDebugAssets
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:preDebugAndroidTestBuild SKIPPED
> Task :app:processDebugAndroidTestManifest
> Task :app:generateDebugAndroidTestBuildConfig
> Task :app:javaPreCompileDebugAndroidTest
> Task :app:checkDebugAndroidTestAarMetadata
> Task :app:processDebugAndroidTestNavigationResources
> Task :app:compileDebugAndroidTestNavigationResources
> Task :app:generateDebugAndroidTestResValues
> Task :app:mapDebugAndroidTestSourceSetPaths
> Task :app:generateDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestShaders
> Task :app:compileDebugAndroidTestShaders NO-SOURCE
> Task :app:generateDebugAndroidTestAssets UP-TO-DATE
> Task :app:mergeDebugAndroidTestAssets
> Task :app:desugarDebugAndroidTestFileDependencies
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:processDebugResources
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:validateSigningDebugAndroidTest
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:writeDebugAndroidTestSigningConfigVersions
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:mergeReleaseJniLibFolders
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses
> Task :app:generateReleaseBuildConfig
> Task :app:javaPreCompileRelease
> Task :app:checkReleaseAarMetadata
> Task :app:mergeProjectDexDebug
> Task :app:bundleDebugClassesToCompileJar
> Task :app:processReleaseNavigationResources
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:compileReleaseNavigationResources
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:packageReleaseResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :app:mergeReleaseResources
> Task :app:parseReleaseLocalResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeExtDexRelease
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:mergeReleaseAssets
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource
> Task :app:collectReleaseDependencies
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:generateDebugAndroidTestLintModel
> Task :app:processReleaseManifestForPackage
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:processReleaseResources
> Task :app:compressReleaseAssets

> Task :app:compileReleaseJavaWithJavac

> Task :app:dexBuilderRelease
> Task :app:mergeReleaseGlobalSynthetics
> Task :app:generateReleaseLintVitalReportModel
> Task :app:mergeDexRelease
> Task :app:compileReleaseArtProfile
> Task :app:optimizeReleaseResources
> Task :app:lintAnalyzeDebugUnitTest
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintVitalAnalyzeRelease
> Task :app:lintVitalReportRelease
> Task :app:lintVitalRelease
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease
> Task :app:lintAnalyzeDebug

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html

> Task :app:lintDebug

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 25s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Instrumentation nativa della CI — otto PASS

```text
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=1
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=1
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Avvio APK e permessi offline
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=2
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=2
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=DOCX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=3
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=3
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=XLSX apri modifica salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=4
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=PDF visualizza ruota salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=4
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=PDF visualizza ruota salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=5
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Markdown crea salva riapri
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=5
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Markdown crea salva riapri
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=6
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Informazioni licenza locale e tema
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=6
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Informazioni licenza locale e tema
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=7
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Rapporto privacy e appunti Android
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=7
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Rapporto privacy e appunti Android
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=8
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Nessuna connessione esterna
INSTRUMENTATION_STATUS_CODE: 1
INSTRUMENTATION_STATUS: class=it.cosmonet.cosmoffice.SmokeInstrumentation
INSTRUMENTATION_STATUS: current=8
INSTRUMENTATION_STATUS: id=CosmOfficeAndroid
INSTRUMENTATION_STATUS: numtests=8
INSTRUMENTATION_STATUS: test=Nessuna connessione esterna
INSTRUMENTATION_STATUS_CODE: 0
INSTRUMENTATION_RESULT: cosmoffice=PASS
INSTRUMENTATION_RESULT: prove=8
INSTRUMENTATION_RESULT: stream=
PASS Android reale in emulatore: otto prove, selettore e filesystem reali, nessun permesso Internet.

INSTRUMENTATION_CODE: -1
```

### Rapporto host della CI — PASS

```text
{
  "result": "PASS",
  "emulator": true,
  "physicalDevice": false,
  "tests": 8,
  "realAndroidPicker": true,
  "realClipboard": true,
  "exportedFilesCheckedIndependently": true,
  "originalFilesUnchanged": true,
  "guestNetworkDisabled": true
}
```

### Verifica locale dei veri export — exit 0

```text
PASS: SHA-256 artifact GitHub verificato; Mammoth DOCX modificato; ExcelJS B2=701/B3=2; PDF-lib e Poppler pdfinfo rotazione 90. pdftotext non disponibile: confronto del testo non eseguito, controllo visivo separato con pdftoppm.
Title:           about:blank
Creator:         Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/158.0.0.0 Safari/537.36
Producer:        Skia/PDF m158
CreationDate:    Sat Nov 21 21:29:08 2026 ora solare Europa occidentale
ModDate:         Sat Nov 21 21:29:08 2026 ora solare Europa occidentale
Custom Metadata: no
Metadata Stream: no
Tagged:          no
UserProperties:  no
Suspects:        no
Form:            none
JavaScript:      no
Pages:           1
Encrypted:       no
Page    1 size:  594.96 x 841.92 pts (A4)
Page    1 rot:   90
File size:       32237 bytes
Optimized:       no
PDF version:     1.7

PASS Markdown byte esatti e SHA-256 dei tre originali invariati.
```

### Open XML SDK sui due export Android — exit 0

```text
{
  "result": "PASS",
  "sdk": "DocumentFormat.OpenXml 3.5.1",
  "schema": "Microsoft365",
  "files": [
    {
      "file": "V:\\CosmonetOffice\\test-results\\android\\artifact-770\\android-write-salvato.docx",
      "errors": []
    },
    {
      "file": "V:\\CosmonetOffice\\test-results\\android\\artifact-770\\android-grid-salvato.xlsx",
      "errors": []
    }
  ]
}
```

### Markdown esatto e SHA-256 originali — exit 0

```text
{
  "markdownExact": true,
  "originals": [
    {
      "sample": "01-testo-stili.docx",
      "sha256": "66bcf25e599925b72484c8dac7c6d3c8e77976db5cb6eb17a13e249a091b20a7",
      "unchanged": true
    },
    {
      "sample": "01-formule.xlsx",
      "sha256": "dec2eeb4a9c4c46cac91cb4916f7f3e6d183ae1fda8f04dcc68feb3157201ca3",
      "unchanged": true
    },
    {
      "sample": "01-testo.pdf",
      "sha256": "7917dec9e4e94e288c663034d1ea6b15f0249ee718ed348e17da8ffce00d1029",
      "unchanged": true
    }
  ]
}
```

### Poppler rendering indipendente — exit 0

```text
{
  "result": "PASS",
  "results": [
    {
      "file": "01-testo.pdf",
      "reader": "Poppler pdfinfo e pdftoppm",
      "pages": 1,
      "rotatedPage": 1,
      "otherPagesUnchanged": true,
      "contentPixelDifference": 6.302,
      "pixelAlignment": {
        "dx": -1,
        "dy": 0
      },
      "result": "PASS"
    }
  ]
}
```

### Confronto release unsigned CI / firmato locale — exit 0

```text
{
  "result": "PASS",
  "ciArtifactSha256": "8f9ebcad3cb03049a9f7f8ef50d1684389e75b75da1ee342e612922424b9f593",
  "ciUnsignedSha256": "22fd42cf2736a7b06da2c30d0697a94d1aca395974db65c5a4169f176787dfbd",
  "localSignedSha256": "c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084",
  "entriesCompared": 240,
  "different": [],
  "additionalSignatureFiles": [
    "META-INF/COSMOFFI.SF",
    "META-INF/COSMOFFI.RSA",
    "META-INF/MANIFEST.MF"
  ],
  "identicalPayload": true,
  "unsignedArchiveIdenticalToLocalSigningSource": true
}
```

### Firma locale e impronta pubblica — exit 0

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "signed": true,
  "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e",
  "apkSha256": "c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084",
  "unsignedSha256": "22fd42cf2736a7b06da2c30d0697a94d1aca395974db65c5a4169f176787dfbd",
  "privateKeyUploaded": false,
  "physicalDeviceTested": false
}
```

### Esiti CI desktop osservati

```text
[
  {
    "name": "checks",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140874151899"
  },
  {
    "name": "desktop (ubuntu-latest, --linux --x64, Linux-x64)",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140875568700"
  },
  {
    "name": "desktop (windows-latest, --win --x64, Windows-x64)",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140875568706"
  },
  {
    "name": "interop",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140875568712"
  },
  {
    "name": "desktop (macos-latest, --mac --x64 --arm64, macOS-Intel-AppleSilicon)",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140875568727"
  },
  {
    "name": "windows-installed",
    "status": "completed",
    "conclusion": "success",
    "html_url": "https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196/job/140877276315"
  }
]
```

Artifact verifiche SHA-256 da47d09afbd336c0f07cf8e38b8e46d1638fec11cc7bd51ab6f61e5adcb8b561 e artifact unsigned 8f9ebcad3cb03049a9f7f8ef50d1684389e75b75da1ee342e612922424b9f593 confrontati con i digest GitHub. L’intero APK unsigned CI è identico alla fonte locale della firma (22fd42cf2736a7b06da2c30d0697a94d1aca395974db65c5a4169f176787dfbd). Tutti 240 i file del payload sono identici nel firmato, con sole aggiunte META-INF/COSMOFFI.SF, META-INF/COSMOFFI.RSA e META-INF/MANIFEST.MF. Il primo confronto contava queste firme come aggiunte generiche: identificate e verificate, nessun file extra accettato fuori da questo elenco. Non è stata inviata la chiave.

## 4. Cosa funziona (provato)

- Installazione APK debug e avvio della vera Activity/WebView nell’emulatore API 35, permesso Internet assente.
- DOCX: apertura di campione originale, testo aggiunto via editor, copia su filesystem Android, riapertura; Mammoth trova la modifica e SDK zero errori.
- XLSX: B2=701/B3=2 tramite input Android, conferma con blur, salvataggio/riapertura; ExcelJS verifica valori numerici e SDK zero errori.
- PDF: rendering, rotazione, copia e riapertura; pdf-lib/pdfinfo 90°, confronto visivo pdftoppm PASS, contenuto visivo conservato (differenza media 6.302, soglia esistente 25). pdftotext non disponibile: nessuna prova distinta del testo dichiarata.
- Markdown: creazione, digitazione, salvataggio/riapertura, contenuto di 56 byte esatto e ritorno nativo alla Home.
- Informazioni legge la licenza locale, tema scuro impostato; rapporto copiato negli appunti Android reali e controllato contro nomi/contenuti/percorsi del campione.
- Richiesta esterna bloccata; rete guest spenta, APK senza permessi. Tre originali su Android byte-identici ai campioni.
- Release locale allineato/firmato, certificato verificato, licenze/dizionario/worker/wasm incorporati e nessuna chiave dentro l’APK. SHA-256 della copia consegnata identico al firmato: c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084.

## 5. Cosa NON funziona o non hai potuto provare

- Nessun telefono/tablet fisico collaudato, né installazione/aggiornamento in luogo del release firmato su un dispositivo. Prove native sul debug, release verificato per firma/payload, non confondere le due cose.
- Sette PNG reali prodotte, ma alcune catture sono un frame precedente: Informazioni ancora «Lettura», rapporto non ancora visibile mentre gli appunti reali sono corretti. Causa da investigare tra sincronizzazione cattura e rendering WebView; collaudo visivo completo **non superato**, immagini non promosse come anteprima nel README. AND-014 resta aperto.
- Tastiera software, gesti tattili, percorso Enter del vecchio driver, Android 10/16/altri WebView/modelli, prestazioni, provider cloud, schermo ruotato, arresti OS/Chromium/Java e recupero dopo crash fisico non provati. Fatal Java non raccolti dal registro JS: nessuna promessa aggiunta.
- Un solo campione per formato nel round trip nativo non certifica tutta la compatibilità Office/PDF. Una run completa verde non dimostra stabilità statistica su tutti i dispositivi.
- Stampa e DOCX→PDF Android non implementati; aggiornamenti APK manuali, limite 10 MB. iOS assente. Nessuna Release Android pubblica, artifact CI unsigned da firmare.
- La Release desktop 0.2.3 già pubblicata resta invariata; nessun tag o installer sostituito. Nessun PC pulito fisico/SmartScreen/UAC-antivirus/utente normale, AppImage in uso o Mac fisico provati in questo passo.

## 6. Bug e dubbi

AND-011/012 e nuova sequenza AND-013 verificati nel percorso corrente; non si attribuisce al prodotto una perdita mai dimostrata, né si certifica il precedente percorso tastiera. AND-014 resta aperto sulla resa delle catture. Il primo ANR Pixel Launcher e tutti i tentativi rossi restano documentati. Warning SDK Platform-Tools/licenza non accettata, deprecazioni Java/Gradle e dimensioni chunk restano nei log; build/lint riusciti, nessuna falsa affermazione di licenza SDK accettata.

Fonte delle prove: log/metadata/artifact dei link CI sopra, file originali tests/fixtures e validatori locali indicati negli output. Nessuna nuova fonte/codice di terzi studiata o copiata in questo passo. core-js MIT e PDF.js Apache-2.0 già documentati nel report f60184a e CODICE-STUDIATO.md; nessuna scelta di motore.

## 7. Hash dei commit

- APK originale: 9421c6a355ccd335fcc1fe22ade4eed4de9a533b.
- Diagnosi PDF: effae92c861d74c3c8622529f47017ac5e7118ad.
- Compatibilità PDF: f60184ad5bd1fe01e583a71e847ffb181152d150.
- Modello Markdown nel driver: 32232a6a1e804ea13460127d4d40b506a266f42f.
- Codice del test completo verde: 770596758c41a8cffefc4fe5f33b5f27d8cede93.
- Questo aggiornamento documentale: git log -1 --format=%H -- docs/report/2026-11-28_0626_android-primo-collaudo.md, disponibile dopo il commit. Nessuna modifica runtime in questo commit; sua CI da osservare dopo il push, non dichiarata già verde.

## 8. Prossimo passo

Provare il release firmato su telefono Android 10+ reale: installazione, resa visiva/AND-014, tastiera/gesti e gli stessi quattro formati con copie originali. Nessun risultato fisico anticipato. Conservare privatamente la chiave per i futuri aggiornamenti; non pubblicarla. Eventuale pubblicazione APK sarà distinta dalla consegna locale e non è stata eseguita. Nessuna nuova idea dello studio o scelta di motore proposta/implementata.
