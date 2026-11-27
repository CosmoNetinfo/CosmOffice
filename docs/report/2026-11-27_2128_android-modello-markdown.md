# Android: PDF nativo verificato e modello Markdown

## 1. Obiettivo

Proseguire gli otto casi Android, documentando il PDF finalmente passato e correggendo il selettore del test per il modello Markdown.

## 2. Cosa hai fatto

- android/app/src/androidTest/java/it/cosmonet/cosmoffice/SmokeInstrumentation.java: click con aria-label, altrimenti titolo strong, altrimenti testo completo; confronto esatto sempre richiesto. Il pulsante «Nuovo Markdown» contiene anche la didascalia «CosmoWrite · .md», che prima impediva al driver di riconoscerlo. Nessun cambiamento del prodotto.
- Verificati DOCX/XLSX/PDF realmente esportati nella seconda run f60184a con Mammoth, ExcelJS, PDF-lib, Open XML SDK e Poppler.
- Aggiornati CHANGELOG.md, docs/BUG.md, VALIDATION.md, CI.md, ROADMAP.md, report e ULTIMO.md.
- Non toccati src/, electron/, Android/main, motori, licenze/attribuzioni, preferenze aggiornamenti, versione, tag e pacchetti/Release pubblici. Nessuna dipendenza aggiunta. APK firmato locale riprodotto identico con la stessa chiave esterna.

## 3. Esiti reali di build e test

f60184ad5bd1fe01e583a71e847ffb181152d150: [desktop 46061575262](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575262) tutti sei i lavori completed/success osservati, inclusa NSIS installata/disinstallata nel runner. effae92 / desktop 46059522912 e 4912020 / desktop 46056425321 già osservati con sei success.

[Android 46061575296 tentativo 1](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575296/attempts/1): failure sul primo DOCX. Screenshot verificato: «Pixel Launcher isn't responding» copre DocumentsUI; i file sono presenti dietro il dialogo. Non è stata modificata l’app o disabilitato il controllo: rilanciato lo stesso job dopo aver identificato l’ANR esterno.

[Android 46061575296 tentativo 2](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575296/attempts/2): Home, DOCX, XLSX e PDF PASS. Si ferma prima di creare Markdown: etichetta del driver incompleta. Non è una CI Android verde.

Artifact ZIP SHA-256 8135223feb397a7ae59ea24f0547d702952115923265d00148b3d28a04a1e9ce confrontato e uguale a GitHub. File di output raccolti anche se il test è fallito. Log reale:

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
INSTRUMENTATION_STATUS: stack=java.lang.AssertionError: Attesa scaduta: Array.from(document.querySelectorAll('button')).some(b=>(b.getAttribute('aria-label')||b.textContent.trim())==="Nuovo Markdown"&&!b.disabled)
INSTRUMENTATION_STATUS: test=Markdown crea salva riapri
INSTRUMENTATION_STATUS_CODE: -2
INSTRUMENTATION_RESULT: cosmoffice=FAIL
INSTRUMENTATION_RESULT: stream=
FAIL Android: java.lang.AssertionError: Attesa scaduta: Array.from(document.querySelectorAll('button')).some(b=>(b.getAttribute('aria-label')||b.textContent.trim())==="Nuovo Markdown"&&!b.disabled)

INSTRUMENTATION_CODE: -1

```

### Verifica indipendente export — exit 0

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
```

### Open XML SDK sui veri export Android — exit 0, zero errori

```text
{
  "result": "PASS",
  "sdk": "DocumentFormat.OpenXml 3.5.1",
  "schema": "Microsoft365",
  "files": [
    {
      "file": "V:\\CosmonetOffice\\test-results\\android\\artifact-f601retry\\android-write-salvato.docx",
      "errors": []
    },
    {
      "file": "V:\\CosmonetOffice\\test-results\\android\\artifact-f601retry\\android-grid-salvato.xlsx",
      "errors": []
    }
  ]
}
```

### Poppler rendering e confronto visivo esistente — exit 0

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

### APK firmato e confronto degli asset — exit 0

```text
PASS: APK firmato SHA-256 verificato; 232 asset incorporati confrontati con gli asset Android definitivi. Il packager ha espanso morph-it_048_utf8.txt.gz: contenuto verificato byte per byte contro gunzip del sorgente; tutti gli altri asset byte-identici.
```

Controlli supplementari non riusciti al primo tentativo: pdftotext non installato (Error: spawnSync pdftotext ENOENT); confronto del testo non eseguito. Il Python predefinito è un alias non eseguibile, nessuna libreria installata per aggirarlo. Usati pdfinfo e pdftoppm già disponibili: controllo visivo originale→rotazione con l’algoritmo esistente di scripts/pdf-independent.mjs, soltanto adattato al file esportato e alla prima pagina. Differenza media 6.302, sotto la soglia preesistente 25, contenuto visivo conservato. Nessun test ufficiale indebolito.

Primo confronto diretto asset non trovava morph-it_048_utf8.txt: il packager ha espanso il .gz. Contenuto confrontato con gunzip del sorgente, byte identici; gli altri asset sono confrontati direttamente. Una seconda build/firma produce lo stesso APK e SHA-256. Il primo estrattore locale di PNG appiattiva i nomi e sovrascriveva view.png con l’icona del brand presente negli asset: corretto nell’estrazione locale, letta la cattura dal percorso emulator/. La vera cattura PDF mostra il testo e una ripresa di caricamento: non è una schermata definitiva e non viene promossa nel README. Il round trip nativo e il confronto Poppler sul file salvato sono le prove dichiarate.

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
✓ built in 1.16s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (14.2353ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.8938ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (64.943ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (65.93ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (113.1794ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (173.6366ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (33.1877ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (47.3694ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (34.7951ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (29.8165ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.304ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.6134ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (43.4352ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.499ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (116.9155ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (85.5326ms)
✔ unknown formulas retain their source without exporting a misleading cached number (16.6381ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.7351ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (19.3883ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.5825ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.7915ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.9912ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (171.8395ms)
✔ references, arithmetic, precedence and percentages (4.8887ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0564ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.9019ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.684ms)
✔ Excel address limits and column naming (1.4754ms)
✔ conditional sums, lookups, text, dates and error handling (4.6131ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6066ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.895ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.4046ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7008ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6916ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (3.9695ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.0621ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (9.895ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (254.8143ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (51.5831ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (13.3423ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (104.5571ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (22.0746ms)
✔ Release corrente: note complete per la versione realmente distribuita (6.9427ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.6542ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (71.4482ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.5833ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (49.3052ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (135.8345ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (39.8229ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.7719ms)
✔ unsupported parts produce specific warnings without changing the original file (38.2718ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (16.6624ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.9623ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (898.6997ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1818.534ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (4.8651ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.5608ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.5239ms)
✔ TLS Node: errore di certificato senza fallback (0.5706ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (21.3511ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.2675ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (138.2897ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (2.75ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.5892ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.0891ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (4.1139ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.3948ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (19.5876ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (30.2475ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (7.7582ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (5.098ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (48.0208ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.9631ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (41.4757ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (5.3786ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3186.9555
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
21:19:44 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
21:21:41 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  Tutti i progetti sono aggiornati per il ripristino.
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
  OpenXmlCheck -> <progetto>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.

<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
<progetto>\scripts\openxml-validator\OpenXmlCheck.csproj : warning NU1900: Si è verificato un errore durante il recupero dei dati sulla vulnerabilità del pacchetto: Non è possibile caricare l'indice del servizio per l'origine https://api.nuget.org/v3/index.json.
    Avvisi: 2
    Errori: 0

Tempo trascorso 00:00:02.59
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
> Task :app:desugarDebugFileDependencies
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:processDebugManifestForPackage
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:mergeDebugJavaResource
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
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
> Task :app:processDebugResources
> Task :app:mergeDebugAndroidTestAssets
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:desugarDebugAndroidTestFileDependencies
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:validateSigningDebugAndroidTest
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
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource
> Task :app:collectReleaseDependencies
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:generateDebugAndroidTestLintModel
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:processReleaseManifestForPackage
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
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

BUILD SUCCESSFUL in 23s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

## 4. Cosa funziona (provato)

Quattro casi nativi PASS: avvio senza permesso Internet, DOCX modifica/salvataggio/riapertura, XLSX con B2=701/B3=2, PDF rendering/rotazione/salvataggio/riapertura. DOCX/XLSX esportati: zero errori Open XML SDK. Poppler indipendente conferma PDF 90° e conservazione visiva del contenuto. 16 controlli locali tutti exit 0, 75 test unitari; APK/lint compilati senza errori. La modifica del titolo nel driver è compilata, non ancora osservata nella nuova CI.

APK firmato locale CosmOffice-0.2.3-android-22fd42cf2736.apk, SHA-256 c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084. Certificato SHA-256 32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e, chiave non caricata. Test nativi sul debug, firma del release verificata separatamente.

## 5. Cosa NON funziona o non hai potuto provare

Il test completo non passa ancora: creazione Markdown non raggiunta a causa del selettore del driver, correzione in attesa di CI. Informazioni/tema, appunti del rapporto e controllo finale rete/originali non ancora raggiunti. Nessun telefono/tablet fisico, tastiera software, installazione/aggiornamento del release firmato su dispositivo, Android 10/16, provider cloud, rotazione schermo, prestazioni o arresti reali provati. Stampe e Word→PDF Android assenti. Nessun APK pubblico/tag e nessuna modifica della Release desktop 0.2.3. Non si estende il risultato del singolo PDF a tutti i PDF reali.

## 6. Bug e dubbi

AND-011 verificato sul campione PDF 01; AND-012 driver modello corretto ma da osservare. ANR del Pixel Launcher nel primo tentativo conservato come fallimento infrastrutturale, non nascosto. Il confronto degli originali via hash attende il completamento dello smoke; nessuna affermazione che sia già passato. Nessuna nuova idea dello studio, motore o dipendenza.

## 7. Hash dei commit

Applicazione Android 9421c6a355ccd335fcc1fe22ade4eed4de9a533b, test celle 491202025b2b4f5d9bd4eb9d4dea6e133d13bef0, diagnosi effae92c861d74c3c8622529f47017ac5e7118ad, compatibilità PDF f60184ad5bd1fe01e583a71e847ffb181152d150. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-27_2128_android-modello-markdown.md; CI del nuovo commit ancora da osservare.

## 8. Prossimo passo

Osservare il nuovo smoke fino a Markdown, Informazioni/tema, appunti e rete; recuperare quattro export e hash degli originali e sette schermate. Consegnare come pacchetto collaudato soltanto dopo il test completo. Telefono fisico resta una prova distinta.
