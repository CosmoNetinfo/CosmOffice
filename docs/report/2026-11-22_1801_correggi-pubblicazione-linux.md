# Correzione DIST-001 e verifica della Release pubblica

## 1. Obiettivo

Completare la Release ordinaria CosmOffice 0.2.2 (anteprima) con l’AppImage Linux mancante, preservando l’installer Windows già pubblico. Nessuna nuova idea dello studio, nessun motore scelto o updater attivato.

## 2. Cosa hai fatto

- scripts/publish-preview.mjs: usa linux-x86_64.AppImage, il nome realmente prodotto da electron-builder, e rifiuta altre AppImage inattese invece di ignorarle.
- scripts/complete-preview.mjs: aggiunge solo gli installer mancanti alla Release pubblica; rifiuta sostituzioni degli installer esistenti, conserva i loro hash GitHub, rigenera SHA256SUMS.txt e aggiorna le note dal CHANGELOG.
- .github/workflows/release-linux.yml: al push di questo workflow verifica che src/electron/public/package siano identici al tag v0.2.2, costruisce l’AppImage e completa la Release senza certificati di firma.
- tests/release-preview.test.mjs: regressione sul nome reale, completamento Linux con hash Windows invariato, sola sostituzione del riepilogo e rifiuto di nomi inattesi.
- CHANGELOG.md, docs/BUG.md, docs/DECISIONI.md, docs/VALIDATION.md: causa, correzione e limiti documentati.
- docs/report/2026-11-22_1801_correggi-pubblicazione-linux.md e docs/report/ULTIMO.md: report e copia.

Gli screenshot richiesti nel nuovo prompt sono già generati in locale con uno script separato e rimangono esclusi da questo commit di correzione; seguiranno nel proprio commit. Nessun codice dell’app o dipendenza modificati.

## 3. Esiti reali di build e test

Comandi completi eseguiti, tutti exit 0: npm run build, npm test, npm run test:browser, npm run test:openxml, node scripts/offline-smoke.mjs, node scripts/desktop-smoke.mjs. Output reali, soli spazi finali rimossi:

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
✓ built in 3.56s
```

### unit — exit 0

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (85.1543ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (78.5435ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (135.7346ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (202.2559ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (33.534ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (42.0411ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (41.3596ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (30.1087ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (9.5531ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.819ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (52.061ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.6603ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (110.0719ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (91.7209ms)
✔ unknown formulas retain their source without exporting a misleading cached number (16.0167ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.6809ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (19.5591ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (16.4554ms)
✔ landscape DOCX uses a physically wider page with matching orientation (12.3016ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (12.6455ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (190.5077ms)
✔ references, arithmetic, precedence and percentages (5.476ms)
✔ Italian aliases, absolute references, text and lazy IF (1.6162ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7934ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.7844ms)
✔ Excel address limits and column naming (1.7734ms)
✔ conditional sums, lookups, text, dates and error handling (6.9405ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6984ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (1.9516ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.1226ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.752ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6669ms)
✔ Il processo principale non contiene updater o caricamenti da server (8.146ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (245.6781ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (41.5973ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (11.5915ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (86.6133ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.8678ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (64.495ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.0744ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (33.6814ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (130.3643ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (41.4621ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.0498ms)
✔ unsupported parts produce specific warnings without changing the original file (36.2645ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (16.1041ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (16.0539ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (937.3677ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1901.3166ms)
ℹ tests 49
ℹ suites 0
ℹ pass 49
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3283.0934
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
17:55:09 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:04.82
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

Controllo YAML:

```text
PASS YAML completamento Linux
```

git diff --check: exit 0, output vuoto. La prova di completamento usa API simulate: non è presentata come upload effettivo. Le righe FAIL SDK riguardano i controlli negativi intenzionali e la copia storica, mentre i 13 nuovi esportati passano.

## 4. Cosa funziona, provato

- 49 test superati; tutti i browser/corpus, SDK, offline e pacchetto Windows locali verdi.
- Release ordinaria realmente creata: [v0.2.2](https://github.com/CosmoNetinfo/CosmOffice/releases/tag/v0.2.2), titolo CosmOffice 0.2.2 (anteprima), draft=false, prerelease=false.
- Verificata senza autenticazione la destinazione /releases/latest e l’API pubblica, con nome/tag corrispondenti. Il tool web non riusciva ad aprire la pagina per cache miss: la verifica effettiva è stata fatta con GET HTTPS anonime e scaricamento del file, senza account o token.
- Installer Windows scaricato realmente, 128.031.094 byte; hash SHA-256 ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a, uguale a SHA256SUMS.txt, checksum individuale e digest GitHub.
- Il codice di completamento non cancella né sovrascrive l’installer Windows.

## 5. Cosa NON funziona o non hai potuto provare

La prima pubblicazione manca di Linux, nonostante la build fosse verde. **Al momento di questo commit l’AppImage pubblica non è ancora verificata**: il workflow di completamento si attiva con il push e il risultato sarà controllato prima di dichiarare conclusa la Release.

Non provate installazioni su computer puliti, avvio AppImage su hardware Linux, hardware Mac o SmartScreen su una nuova installazione. Il download Windows non è un’installazione. Nessun DMG pubblico o updater incluso in questo passo. Gli screenshot browser non certificano le installazioni desktop.

## 6. Bug e dubbi

DIST-001: atteso linux-x64, prodotto linux-x86_64. Il publisher saltava il file e le note dichiaravano Linux non disponibile; il workflow rimaneva verde. Ora il nome è corretto e nomi inattesi sono un errore. La prova reale degli asset è necessaria anche con CI verde.

Solo SHA256SUMS.txt viene sostituito per includere entrambi i pacchetti; l’API non offre una sostituzione atomica del riepilogo. Il vecchio riepilogo è rimosso dopo gli upload dei nuovi asset, poi caricato nuovamente: un breve intervallo senza riepilogo è possibile. Nessun installer viene rimosso. In caso di errore il report dovrà indicarlo, senza tentativi che sovrascrivano gli installer.

La verifica HTTPS anonima ha contattato github.com, api.github.com e release-assets.githubusercontent.com; il CDN usa il percorso del repository 1466711071. Questa è una verifica di sviluppo esterna all’app, non un’attivazione della rete di CosmOffice. I limiti del futuro updater restano da provare nel suo passo.

Avvisi preesistenti: chunk Vite grande, PDF indicizzato nel campione difettoso e audit NuGet non raggiungibile. La copia storica XLSX conserva il difetto MIME autorizzato, non provata con Excel reale.

## 7. Hash del commit

Base e tag v0.2.2: 2128469f6682b377135503973fc910c98bc941e2. Commit di questo report individuabile con git log -1 --format=%H -- docs/report/2026-11-22_1801_correggi-pubblicazione-linux.md; hash finale comunicato dopo il push.

CI della base 2128469: [45035934913](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035934913), completed/success. Release del tag: [45035965421](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035965421), tutti quattro i lavori success, ma asset Linux mancante per DIST-001. Non è chiamata “Release completa” solo per questo colore verde.

CI precedenti verificate 5/5 success: 94d93db [45034728552](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45034728552), e0fe801 [45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708), e8faf0b [45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005), 9e3173e [45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220), 5a493a4 [45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835), 3185603 [45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728).

## 8. Prossimo passo

Push del completamento, seguire la run Linux e verificare anonimamente entrambi gli asset e tutti i checksum, preservando l’hash Windows sopra. Poi commit separato degli screenshot richiesti (già generati, nessuna modifica all’app), DMG Mac e guida, report CI aggiornato. Updater TLS Node soltanto nel commit successivo dedicato, con tutte le condizioni autorizzate.
