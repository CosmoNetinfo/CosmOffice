# Screenshot reali dell’app nel README

## 1. Obiettivo

Aggiungere la sezione “Com'è fatto” al README con nove PNG reali dell’interfaccia, rigenerabili automaticamente, esempi originali e nessun dato del computer. Un solo commit per questo passo. Il completamento Linux della Release è stato verificato prima di pubblicare le immagini.

## 2. Cosa hai fatto

- scripts/screenshots.mjs: genera DOCX con testo/tabella/illustrazione originale, XLSX con formule e grafico a barre e PDF originale; avvia la vera app browser con Playwright e contesto temporaneo; apre gli esempi con il normale file chooser; cattura nove pagine.
- docs/images/home.png: Home con i tre documenti di esempio; viewport più alta per mostrarli tutti.
- docs/images/write.png: CosmoWrite con il progetto della biblioteca, testo, tabella e illustrazione geometrica originale.
- docs/images/grid.png: CosmoGrid con dati, formula SOMMA e grafico nativo a barre.
- docs/images/view.png: CosmoView con PDF originale Una biblioteca per tutti.
- docs/images/impostazioni-chiaro.png e impostazioni-scuro.png: le vere impostazioni nei due temi.
- docs/images/prova-guidata.png: tutte le otto prove, esiti Non provato.
- docs/images/segnala-problema.png: rapporto browser reale con un evento tecnico simulato; nessun messaggio arbitrario.
- docs/images/layout-stretto.png: Home a 390 px.
- README.md: immagini incorporate con percorsi relativi e testi alternativi italiani, didascalia “anteprima di sviluppo, versione 0.2.2” per ciascuna.
- docs/SCREENSHOTS.md: comandi, contenuto, privacy e limiti della generazione.
- CHANGELOG.md, docs/DECISIONI.md, docs/ROADMAP.md, docs/VALIDATION.md: richiesta, metodo e verifiche.
- docs/BUG.md: DIST-001 chiuso soltanto dopo il download pubblico Linux verificato.
- docs/report/2026-11-22_1813_screenshot-readme.md e docs/report/ULTIMO.md: report e copia identica.

**Nessuna modifica a src/, electron/, stili, workflow o LICENSE per le immagini.** Nessuna nuova libreria. Sharp e Playwright erano già dipendenze. node scripts/notices.mjs eseguito, exit 0, “Attribuzioni e licenze raccolte.”; avvisi distribuiti invariati. Nessun marchio o logo di altre suite. I loghi visibili sono quelli già presenti di CosmOffice.

## 3. Esiti reali di build e test

Rigenerazione finale e tutti i controlli obbligatori eseguiti, tutti exit 0. Output reali, soli spazi a fine riga rimossi:

### catture — exit 0

```text
{
  "result": "PASS",
  "captured": [
    {
      "name": "write",
      "width": 1440,
      "height": 1000,
      "bytes": 31883
    },
    {
      "name": "grid",
      "width": 1440,
      "height": 1000,
      "bytes": 29585
    },
    {
      "name": "view",
      "width": 1440,
      "height": 1000,
      "bytes": 25009
    },
    {
      "name": "home",
      "width": 1440,
      "height": 1160,
      "bytes": 39927
    },
    {
      "name": "layout-stretto",
      "width": 390,
      "height": 844,
      "bytes": 18518
    },
    {
      "name": "impostazioni-chiaro",
      "width": 1440,
      "height": 1000,
      "bytes": 31392
    },
    {
      "name": "impostazioni-scuro",
      "width": 1440,
      "height": 1000,
      "bytes": 30451
    },
    {
      "name": "prova-guidata",
      "width": 1440,
      "height": 1440,
      "bytes": 92403
    },
    {
      "name": "segnala-problema",
      "width": 1440,
      "height": 1000,
      "bytes": 57218
    }
  ],
  "external": []
}
```

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

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (75.2523ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (73.792ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (125.2207ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (185.3762ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (27.7434ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (40.2417ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (33.6059ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (29.4715ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.7212ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (1.1246ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (50.4003ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (5.6886ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.6812ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (85.1834ms)
✔ unknown formulas retain their source without exporting a misleading cached number (14.4195ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.0754ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (18.0813ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (9.6333ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.9984ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (9.4841ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (155.2505ms)
✔ references, arithmetic, precedence and percentages (4.0832ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7931ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.291ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.9748ms)
✔ Excel address limits and column naming (1.6939ms)
✔ conditional sums, lookups, text, dates and error handling (4.2417ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.7761ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4686ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8265ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.5954ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.777ms)
✔ Il processo principale non contiene updater o caricamenti da server (7.4079ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (235.1533ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (40.9219ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.9404ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (79.611ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (21.0133ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (61.1613ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.9182ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (37.8121ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (116.3487ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (39.9083ms)
✔ damaged files and mismatched Office extensions are rejected before import (11.5486ms)
✔ unsupported parts produce specific warnings without changing the original file (38.1535ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (12.8818ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (13.5429ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (819.5148ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1858.6279ms)
ℹ tests 49
ℹ suites 0
ℹ pass 49
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3131.0348
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
18:07:48 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:02.05
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

Controllo aggiuntivo locale, exit 0:

```text
PASS README locale: nove link relativi, testi alternativi italiani, PNG presenti e ottimizzate senza metadati personali.
```

git diff --check: exit 0, output vuoto. Le PNG e i collegamenti del README esistono nel tree da pubblicare. La verifica HTTP dalla pagina GitHub richiede il push delle immagini nuove e verrà eseguita subito dopo: non è falsamente presentata come prova già effettuata prima della pubblicazione.

Le righe FAIL del validatore sono i negativi intenzionali e la copia XLSX storica autorizzata. I 13 nuovi esportati passano. Avvisi reali rimasti: chunk Vite grande, indicizzazione PDF nel campione di errore e NU1900 dell’audit NuGet.

## 4. Cosa funziona, provato

Nove catture dell’interfaccia reale, generate più volte dallo script e ispezionate visivamente (contatto completo, rapporto e Home anche a piena dimensione). Nessuna modifica manuale alle PNG, nessun ritocco o mockup. Le avvertenze reali dell’app non sono state nascoste.

Tutte larghe 1440 px, salvo il layout 390 px; Home alta 1160 px, guida 1440 px, le altre 1000 px (telefono 844 px). Peso per file circa 18–92 KB, totale inferiore a 400 KB. EXIF, XMP e ICC assenti. Controllati testo e campi prima della cattura: nessun nome utente, lettera di unità o percorso personale. Nessun errore pagina o richiesta esterna. Il rapporto usa il filtro vero dell’app con un solo evento simulato.

49 unit test e tutti i test browser, SDK, offline e pacchetto Windows passati. Il codice dell’app resta invariato rispetto alla Release.

### Release ordinaria e CI, esiti effettivi

[Release v0.2.2](https://github.com/CosmoNetinfo/CosmOffice/releases/tag/v0.2.2) e /releases/latest verificati senza autenticazione con GET HTTPS. Installer Windows scaricato nella prima verifica; Linux scaricato nella seconda. Nella seconda Windows è stato nuovamente confrontato dal file già scaricato e i checksum pubblici ricontrollati. Entrambi coincidono con file .sha256, SHA256SUMS.txt e digest GitHub:

- Windows, 128.031.094 byte: ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a.
- Linux, 134.019.591 byte: 6eb41f36df41d6bcfc1876430ae21abd0bbd59dc9cd7e26d8d4f476e17253792.

Host della verifica esterna di sviluppo: github.com, api.github.com, release-assets.githubusercontent.com. Nessuna rete aggiunta all’app. Il mancato accesso del tool web per cache miss è stato superato con richieste HTTPS anonime, non con account o token.

CI base b769647 [45047079340](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079340): cinque lavori completed/success verificati. Completamento Linux [45047079344](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079344): success. Base Release 2128469 [45035934913](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035934913): success; tag [45035965421](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035965421): success, con difetto iniziale DIST-001 poi corretto.

Precedenti, tutti 5/5 success verificati: 94d93db [45034728552](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45034728552), e0fe801 [45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708), e8faf0b [45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005), 9e3173e [45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220), 5a493a4 [45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835), 3185603 [45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728).

## 5. Cosa NON funziona o non hai potuto provare

Le immagini sono della versione browser di sviluppo: nessun finto collaudo dell’installer o della finestra nativa. Il rapporto indica realmente che i dati Electron/OS non sono disponibili nel browser. Evento tecnico simulato, non crash reale. Le prove guidate restano Non provato. Il layout 390 px non equivale a un’app mobile installata.

Il controllo su testi/campi e la revisione visiva non sono un OCR universale o una garanzia su immagini future. I documenti sono originali proprio per non introdurre dati reali. Non sono stati aperti archivi o profili personali.

La risoluzione dei link relativa su GitHub sarà verificata dopo il push, perché i nuovi file prima non esistono sul server. Non provate installazioni su sistemi puliti, hardware Mac/Linux o ogni funzione Office. DMG e updater appartengono ai passi successivi.

## 6. Bug e dubbi

Nessun errore applicativo trovato dalle catture. Il primo inquadramento Home mostrava solo parte dell’elenco: aumentata l’altezza della cattura, senza alterare l’interfaccia. Segnalazione e guida sono catturate attraverso i comandi reali delle impostazioni, non ricostruite in una pagina finta.

I limiti di compatibilità visibili restano reali e non sono rimossi per le foto. DIST-001 Linux è ora verificato anche sul server; la prima CI verde non aveva garantito presenza dell’asset. Windows non è stato sostituito.

## 7. Hash del commit

Base: b769647, correzione della pubblicazione Linux. Questo passo si identifica con git log -1 --format=%H -- docs/report/2026-11-22_1813_screenshot-readme.md; il proprio hash viene comunicato dopo il push, perché inserirlo nel medesimo commit lo cambierebbe. Nessun secondo commit artificiale delle sole immagini.

## 8. Prossimo passo

Rigenerazione: npm run build, poi node scripts/screenshots.mjs; dettagli Windows e Chromium CI in docs/SCREENSHOTS.md. Alla prossima versione aggiornare didascalie dopo aver controllato le nuove catture.

Dopo il push verificare la pagina GitHub senza autenticazione, tutti i nove URL PNG e confronto byte per byte con i file locali. Poi proseguire con DMG Mac non firmati e guida “Aprire CosmOffice su Mac”, riportando anche questa verifica nel report successivo. L’updater TLS Node seguirà nel proprio commit e con tutte le condizioni autorizzate, senza altre idee o scelta del motore.
