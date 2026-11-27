# Android: compatibilità PDF con WebView 124

## 1. Obiettivo

Correggere la causa dimostrata del rifiuto PDF Android e continuare il collaudo dell’APK. Nessuna nuova funzione o scelta di motore.

## 2. Cosa hai fatto

- scripts/android-prepare.mjs: build Vite Android separata, alias esatti per API/worker legacy di PDF.js 6.5.438, stessa versione già installata. Guardie realpath prima delle directory generate. Build desktop invariata.
- scripts/android-check-apk.mjs: verifica reale nell’archivio APK della compatibilità incorporata in API e worker, oltre a licenze, dizionario e zero permessi.
- scripts/android-pdf-browser.mjs e .github/workflows/android.yml: regressione sugli asset Android di produzione, con URL.parse nativo rimosso; PDF renderizzato/ruotato/salvato/riaperto. Porta simulata esplicitamente distinta dagli otto casi APK, che restano obbligatori. Chromium installato esplicitamente nella CI.
- scripts/LICENSE-core-js.txt, scripts/notices.mjs e THIRD_PARTY_NOTICES.txt: core-js 3.51.0, già incluso upstream nel legacy, MIT con copyright e testo integrale. Nessuna nuova dipendenza npm.
- CHANGELOG.md, docs/ANDROID.md, BUG.md, CI.md, DECISIONI.md, ROADMAP.md, VALIDATION.md, ricerca/CODICE-STUDIATO.md, report e ULTIMO.md.
- Ricompilato e firmato APK locale con la stessa chiave privata fuori Git; nessun caricamento della chiave. Ricostruito NSIS locale per verificare le attribuzioni aggiornate: nessun installer pubblico sostituito.
- Non toccati src/, electron/, Android/main, motori DOCX/XLSX/PDF, rapporto tester, Prova guidata, condizioni LICENSE, preferenze aggiornamenti, versione/tag/Release pubblica 0.2.3.

## 3. Esiti reali di build e test

effae92c861d74c3c8622529f47017ac5e7118ad: [CI Android 46059522929](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522929) failure confermato. Diagnosi sul PDF originale: WebView 124.0.6367.219, TypeError: URL.parse is not a function, dentro il modulo PDF. Home/DOCX/XLSX avevano passato. [Desktop 46059522912](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522912): tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS nel runner. 4912020 / desktop 46056425321 già osservata con tutti sei success.

Fallimento intermedio locale reale: test:browser 12/13 nel corpus, PDF scansione in timeout. Durante quel test ho modificato src/android.mjs e rigenerato asset Android, causando page reload espliciti nel log Vite. Ho fermato le modifiche e ripetuto l’intera suite senza indebolire asserzioni o saltare campioni. La correzione puntuale di URL.parse non è stata pubblicata: lasciava scoperte altre API e il worker; è stata sostituita dalla distribuzione ufficiale compatibile. Log reale del tentativo fallito:

### Tentativo intermedio test:browser — exit 1

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
20:56:44 [vite] (client) page reload android/app/src/main/assets/www/index.html
20:56:45 [vite] (client) page reload android/app/src/main/assets/www/dictionaries/CC-BY-SA-2.0.html
20:56:45 [vite] (client) page reload android/app/src/main/assets/www/index.html
20:56:49 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
20:56:57 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
20:56:57 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
20:56:58 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
PASS 01-testo-stili.docx
20:57:00 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/index.html
20:57:00 [vite] (client) page reload android/app/build/intermediates/assets/debug/mergeDebugAssets/www/dictionaries/CC-BY-SA-2.0.html
PASS 02-tabella.docx
20:57:15 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
20:57:15 [vite] (client) page reload android/app/build/reports/lint-results-debug.html
20:57:15 [vite] (client) page reload android/build/reports/problems/problems-report.html
PASS 03-immagine.docx
PASS 04-elenchi.docx
PASS 05-intestazioni.docx
PASS 01-formule.xlsx
PASS 02-piu-fogli.xlsx
PASS 03-formati.xlsx
PASS 04-unioni-immagine.xlsx
PASS 05-dati-filtro.xlsx
PASS 01-testo.pdf
20:57:58 [vite] (client) page reload src/android.mjs
FAIL 02-scansione.pdf: page.waitForFunction: Timeout 30000ms exceeded.
20:58:32 [vite] (client) page reload android/app/src/main/assets/www/index.html
20:58:33 [vite] (client) page reload android/app/src/main/assets/www/dictionaries/CC-BY-SA-2.0.html
20:58:33 [vite] (client) page reload android/app/src/main/assets/www/dictionaries/CC-BY-SA-2.0.html
20:58:33 [vite] (client) page reload android/app/src/main/assets/www/index.html
PASS 03-venti-pagine.pdf
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: tutti i 13 file selezionati del corpus; diagnostica:

12 !== 13

    at file:///<progetto>/scripts/corpus-smoke.mjs:190:10 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 12,
  expected: 13,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.13.1
```

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
✓ built in 1.13s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (10.7658ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.5027ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (65.4422ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (59.5413ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (111.6078ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (162.4413ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (25.983ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (37.251ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (33.8935ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (21.7368ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.7807ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7914ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (48.5267ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (7.375ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (95.9223ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (72.9614ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.1368ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.6485ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (16.1888ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.3565ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.0013ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.8318ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (146.5414ms)
✔ references, arithmetic, precedence and percentages (5.6219ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0356ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.9935ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6807ms)
✔ Excel address limits and column naming (1.2212ms)
✔ conditional sums, lookups, text, dates and error handling (5.1854ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6634ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (1.1812ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.0304ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6402ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.7417ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (1.8852ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.7727ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.8535ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (247.0137ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (43.6677ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.4783ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (107.8241ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (18.4292ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.5626ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.3456ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (59.8369ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.7961ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (42.5791ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (105.8888ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (34.503ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.3133ms)
✔ unsupported parts produce specific warnings without changing the original file (33.6642ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (14.5623ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (12.0504ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (832.1002ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1727.4517ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.7476ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.9644ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.3116ms)
✔ TLS Node: errore di certificato senza fallback (0.8108ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (19.6144ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.0183ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (125.2788ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.3492ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.673ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (151.1034ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.1235ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.1616ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (16.7226ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (20.7091ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.5755ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.1061ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (23.0885ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.6289ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (24.8869ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (6.1064ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3025.6469
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
21:01:55 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
21:03:52 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.60
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

### Build Windows NSIS locale — exit 0

```text

> cosmoffice@0.2.3 dist
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --publish never --win nsis --x64


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
✓ built in 1.17s

> cosmoffice@0.2.3 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=<progetto>\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=<progetto>\release\win-unpacked
  • searching for node modules  pm=npm searchDir=<progetto>
  • no node modules found in collection, trying next search directory  pm=npm searchDir=<progetto>
  • searching for node modules  pm=traversal searchDir=<progetto>
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=<progetto>
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
  • building        target=nsis file=release\CosmOffice-0.2.3-win-x64-Setup.exe archs=x64 oneClick=false perMachine=false
  • no code signing certificate configured, signing is skipped  path=<utente>\AppData\Local\Temp\t-olxvHb\elevate-staging-1\resources\elevate.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.__uninstaller.exe
  • no code signing certificate configured, signing is skipped  path=release\CosmOffice-0.2.3-win-x64-Setup.exe
  • building block map  blockMapFile=release\CosmOffice-0.2.3-win-x64-Setup.exe.blockmap
```

### Build asset Android compatibili — exit 0

```text
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
test-results/android/web/index.html                               1.09 kB │ gzip:   0.53 kB
test-results/android/web/assets/pdf.worker.min-B5Yc7dP4.mjs   1,327.59 kB
test-results/android/web/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
test-results/android/web/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
test-results/android/web/assets/DebugReport-D4v1NHOA.js           1.83 kB │ gzip:   0.87 kB
test-results/android/web/assets/GuidedTest-BcmbuZOQ.js            2.31 kB │ gzip:   1.05 kB
test-results/android/web/assets/android-BuIAeMDG.js               2.41 kB │ gzip:   1.18 kB
test-results/android/web/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
test-results/android/web/assets/PdfViewer-BNN3lzrz.js            11.03 kB │ gzip:   4.23 kB
test-results/android/web/assets/SettingsPage-D60LyM46.js         24.69 kB │ gzip:   8.40 kB
test-results/android/web/assets/MarkdownEditor-BCppG8v1.js       54.73 kB │ gzip:  16.85 kB
test-results/android/web/assets/GridEditor-DpwgSTcv.js          203.80 kB │ gzip:  70.76 kB
test-results/android/web/assets/import-docx-C2kA9G92.js         301.70 kB │ gzip:  89.24 kB
test-results/android/web/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
test-results/android/web/assets/pdf-engine-CO03xg8S.js          499.54 kB │ gzip: 152.66 kB
test-results/android/web/assets/index-wFZ-P5o7.js             2,324.24 kB │ gzip: 697.27 kB

✓ built in 1.18s
Asset Android pronti: editor, worker/font PDF, dizionario italiano, licenze e icona Cosmonet locali. Tre campioni originali e Markdown per il solo APK di test.
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
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
> Task :app:checkDebugAarMetadata
> Task :app:javaPreCompileDebug
> Task :app:processDebugNavigationResources
> Task :app:compileDebugNavigationResources
> Task :app:generateDebugResValues
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:parseDebugLocalResources
> Task :app:mergeDebugResources
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
> Task :app:processDebugResources
> Task :app:mergeReleaseJniLibFolders
> Task :app:processDebugAndroidTestResources

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses
> Task :app:generateReleaseBuildConfig
> Task :app:javaPreCompileRelease
> Task :app:checkReleaseAarMetadata
> Task :app:bundleDebugClassesToCompileJar
> Task :app:processReleaseNavigationResources
> Task :app:mergeProjectDexDebug
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
> Task :app:mergeReleaseResources
> Task :app:extractDeepLinksRelease
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
> Task :app:generateDebugLintReportModel
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:processReleaseManifestForPackage
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

BUILD SUCCESSFUL in 36s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### PDF asset Android di produzione — exit 0

```text
PASS asset Android di produzione senza URL.parse nativo: PDF renderizzato, ruotato, esportato e riaperto; rotazione 90 verificata con pdf-lib, zero richieste esterne. Porta nativa simulata: non è il test APK.
```

### Controllo APK reale — exit 0

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "minAndroid": 10,
  "permissions": [],
  "legalFilesIdentical": true,
  "localDictionary": true,
  "localPdfWorker": true,
  "compatiblePdfApiAndWorker": true,
  "privateKeyInApk": false,
  "signed": false,
  "installable": false
}
```

### Firma APK — exit 0

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

## 4. Cosa funziona (provato)

Tutti 16 controlli locali exit 0, 75 test unitari, corpus browser ripassato completo. Build/lint Android riusciti. API/worker compatibili, licenze e dizionario presenti nell’APK senza permessi. Prova browser di produzione senza URL.parse: rendering PDF, rotazione, export e riapertura; pdf-lib conferma 90°, zero richieste esterne. Non è la prova nativa del selettore. DOCX/XLSX round trip nativi precedenti confermati anche sugli export con Mammoth/ExcelJS.

## 5. Cosa NON funziona o non hai potuto provare

Rendering PDF e intero smoke nativo con questa build ancora da osservare in CI. Markdown, appunti, tema/Informazioni, controllo finale originali/rete non ancora passati nell’emulatore precedente. Nessun telefono/tablet fisico, tastiera software, aggiornamento in luogo, installazione release firmato su dispositivo fisico, Android 10/16, provider cloud o rotazione schermo provati. Nessun APK pubblico/tag. Stampa e Word→PDF Android restano assenti. La Release desktop pubblica 0.2.3 non cambia.

## 6. Bug e dubbi

AND-011 causa identificata, correzione compilata e provata sugli asset; resta aperto finché il PDF passa nel vero APK. core-js MIT aggiunge circa 56 KB non compressi per API e altrettanti per worker. Nessun codice upstream tradotto o copiato manualmente. Warning Gradle/Java e SDK Platform-Tools preservati nei log. Non dedurre certificazione Office o collaudo fisico dai test. Chiave privata sempre esterna e mai caricata.

Fonti: [PDF.js distribuzione 6.5.438](https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-6.5.438.tgz), file package.json/legacy/build/pdf.mjs/legacy/build/pdf.worker.mjs e ricerca dei nomi API in build/pdf.mjs e build/pdf.worker.mjs; [core-js LICENSE v3.51.0](https://github.com/zloirock/core-js/blob/v3.51.0/LICENSE). Dettagli in CODICE-STUDIATO.md. Nessuna fonte GPL/AGPL.

## 7. Hash dei commit

Base effae92c861d74c3c8622529f47017ac5e7118ad, APK originario 9421c6a355ccd335fcc1fe22ade4eed4de9a533b, test celle 491202025b2b4f5d9bd4eb9d4dea6e133d13bef0. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-27_2108_android-pdf-compatibile.md. Da leggere dopo commit/push; la CI del nuovo commit non è ancora osservata al momento della scrittura.

## 8. Prossimo passo

Osservare la CI Android di questa correzione: otto casi nativi, selettore/filesystem reali, parsing indipendente dei quattro export, originali byte-identici e sette schermate effettive. Consegnare come APK collaudato solo dopo questi controlli. Telefono fisico resta da provare, chiave da conservare per futuri aggiornamenti.
