# Adozione della licenza d’uso A

## 1. Obiettivo

Adottare la sezione A di docs/LICENZA-BOZZE.md come licenza d’uso nel repository, su istruzione esplicita del titolare. Uso gratuito, codice originale e grafica riservati, nessuna redistribuzione degli installer, condivisione del link ufficiale consentita. B non adottata. Nessuna modifica dell’app o della Release.

## 2. Cosa hai fatto

### Modificato

- LICENSE: otto clausole italiane della bozza A; rimossi i riferimenti a bozza, inserito il segnaposto esatto del titolare, esplicitato il divieto di redistribuire installer e il link alle Release. Garanzie e responsabilità conservano la riserva dei diritti inderogabili, senza nuove condizioni o legge applicabile inventata. Terzi e lessico italiano separati.
- README.md: sezione Licenza, uso gratuito, limiti, link ufficiale, marchi/loghi, documenti dell’utente e revisione professionale necessaria. Riferimenti allo stato proprietario allineati.
- docs/LICENZA-BOZZE.md: A adottata, B conservata come alternativa non adottata. Clausole A e LICENSE confrontate automaticamente, stesso testo al netto del formato.
- docs/DECISIONI.md e ROADMAP.md: scelta esplicita datata 22 novembre 2026, dati mancanti e nessuna adozione di B o scelta del motore.
- docs/BUG.md: LIC-001 aperto per distribuzione della licenza propria e incoerenze dei metadati; nessuna falsa chiusura.
- docs/VALIDATION.md, CI.md e ricerca/CODICE-STUDIATO.md: verifiche, ultima CI delle bozze e consultazione tecnica NSIS registrata.
- CHANGELOG.md: voce in Non rilasciato, senza nuova versione.
- Questo report e copia identica docs/report/ULTIMO.md.

### Non toccato

src/, electron/, scripts/ e workflow tracciati, package.json, package-lock.json, electron-builder.config.cjs, preferenza predefinita degli aggiornamenti, interfaccia, schermate di accettazione e pagine NSIS. Nessun pacchetto pubblico, Release, asset, tag o versione modificato. Test effettuati con script esistenti; strumenti temporanei di audit solo nella cartella test-results ignorata da Git. Nessuna nuova libreria.

THIRD_PARTY_NOTICES.txt rigenerato con scripts/notices.mjs e rimasto invariato; le licenze dei singoli componenti e del lessico restano autonome. Nessun codice esterno copiato. Consultati soltanto i file MIT già installati app-builder-lib 26.18.0 out/targets/nsis/NsisTarget.js e out/util/license.js, per verificare il reperimento delle risorse NSIS. Il nuovo LICENSE senza estensione non introduce una risorsa license.txt/rtf/html; nessun file o opzione di accettazione aggiunti. Registro dei file in docs/ricerca/CODICE-STUDIATO.md.

## 3. Esiti reali di build e test

Tutti i comandi finali elencati sotto sono terminati con exit 0. Output reali copiati, rimossi soltanto gli spazi finali. Il desktop-smoke avvia il pacchetto Windows locale già presente: prova il codice applicativo invariato, non l’inclusione del nuovo LICENSE in un installer. Nessun nuovo installer viene costruito o pubblicato da questo passo.

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
✓ built in 1.62s
```

### npm test — exit 0

```text

> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (90.1035ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (89.4385ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (148.4523ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (201.7443ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (28.8447ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (34.7094ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (31.7193ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (25.8839ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (7.7261ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7215ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (49.15ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.0012ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (133.7696ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (103.2042ms)
✔ unknown formulas retain their source without exporting a misleading cached number (19.1613ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.3855ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (21.4689ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (11.9212ms)
✔ landscape DOCX uses a physically wider page with matching orientation (10.8198ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (13.8629ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (213.2239ms)
✔ references, arithmetic, precedence and percentages (4.8841ms)
✔ Italian aliases, absolute references, text and lazy IF (0.827ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6941ms)
✔ Excel address limits and column naming (1.5696ms)
✔ conditional sums, lookups, text, dates and error handling (4.364ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5604ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4421ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7726ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6407ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.8004ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (7.1054ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (234.3958ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (36.8833ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (9.3176ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (79.0495ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (17.8558ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (2.7758ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (50.911ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.9237ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (31.2337ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (149.759ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (49.1901ms)
✔ damaged files and mismatched Office extensions are rejected before import (14.2963ms)
✔ unsupported parts produce specific warnings without changing the original file (38.381ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (19.9751ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (15.0609ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (792.6389ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1854.996ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.712ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (4.2393ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (4.5467ms)
✔ TLS Node: errore di certificato senza fallback (1.15ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (23.2275ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (2.8165ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (3.1912ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.7091ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (17.0233ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (29.802ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (11.2067ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.8382ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (20.9705ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.857ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (35.2514ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.7793ms)
ℹ tests 66
ℹ suites 0
ℹ pass 66
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4570.7397
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
21:28:24 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:05.04
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

### Controllo YAML e ambito delle modifiche — exit 0

```text
PASS YAML: .github/workflows/build.yml
PASS YAML: .github/workflows/release-linux.yml
PASS YAML: .github/workflows/release-mac.yml
PASS YAML: .github/workflows/release.yml
PASS adozione: otto clausole corrispondenti ad A, B non adottata, segnaposto corretto e nessuno stato iniziale degli aggiornamenti nel testo.
PASS ambito: app, workflow, packaging, versione e avvisi di terzi invariati; nessuna pagina NSIS aggiunta.
```

### Ispezione statica dei metadati — exit 0

Quattro archivi aperti con 7-Zip 26.06; estratti in test-results soltanto i payload necessari a leggere package.json, Info.plist, nomi dei file di licenza e attribuzione del lessico. Nessun installer eseguito. SHA-256 dei download confrontati con i digest pubblici GitHub prima dell’estrazione e ricontrollati dopo tutte le prove.

| Pacchetto pubblico | SHA-256 | package.json incorporato |
| --- | --- | --- |
| CosmOffice-0.2.2-win-x64-Setup.exe | ce37586a69151fbe56dc555acf2f49f4fc031dfc62cc6e20a3e03c8052c1f69a | versione 0.2.2, private:true, author:Cosmonet, license assente |
| CosmOffice-0.2.2-linux-x86_64.AppImage | 6eb41f36df41d6bcfc1876430ae21abd0bbd59dc9cd7e26d8d4f476e17253792 | versione 0.2.2, private:true, author:Cosmonet, license assente |
| CosmOffice-0.2.2-mac-x64.dmg | bb4cb8652c9f8a3fde213aea897543b3faba9ddeeac1af12bceb17c457d136a0 | versione 0.2.2, private:true, author:Cosmonet, license assente |
| CosmOffice-0.2.2-mac-arm64.dmg | a572e8c51955d9c741e9e9a6ff4b46137dfe8d9ffe7d037aede9e8f4dc161fac | versione 0.2.2, private:true, author:Cosmonet, license assente |

Metadati PE Windows reali:

~~~text
ProductName     : CosmOffice
CompanyName     : Cosmonet
LegalCopyright  : Copyright © 2026 Cosmonet
ProductVersion  : 0.2.2
FileDescription : CosmOffice — CosmoWrite, CosmoGrid e CosmoView, suite desktop offline Cosmonet
Comments        :
~~~

I due Info.plist riportano CFBundleIdentifier=it.cosmonet.cosmoffice, CFBundleName=CosmOffice, CFBundleShortVersionString=0.2.2 e NSHumanReadableCopyright=Copyright © 2026 Cosmonet.

Risultato comune ai quattro payload: nessun LICENSE della propria applicazione nella radice ASAR o nelle risorse esterne, THIRD_PARTY_NOTICES.txt presente, LICENSE.electron.txt e LICENSES.chromium.html presenti, ATTRIBUZIONE.txt di Morph-it! nel dizionario con CC BY-SA 2.0. Le licenze Electron/Chromium non sono una dichiarazione di licenza di tutto CosmOffice.

Nel sorgente, package.json non ha campo license e mantiene author:Cosmonet; electron-builder.config.cjs mantiene copyright:Copyright © 2026 Cosmonet e non include LICENSE nelle risorse. Nessuna diversa licenza propria dichiarata esplicitamente nei metadati esaminati, ma licenza mancante e titolare storico non sono allineati al nuovo testo. Non sono stati cambiati in silenzio.

### Fallimenti e avvisi incontrati

Il primo comando rg sugli elenchi ha restituito exit 1 per il glob passato letteralmente su Windows:

~~~text
rg: test-results/licenza-a/*.listing.txt: IO error for operation on test-results/licenza-a/*.listing.txt: La sintassi del nome del file, della directory o del volume non è corretta. (os error 123)
~~~

Ripetuto con -g '*.listing.txt' e directory separata: exit 0, risultati letti. Non è un errore dell’app; gli elenchi 7-Zip erano già tutti stati generati con exit 0.

7-Zip nell’AppImage segnala “There are data after the end of archive”, Tail Size=141855, con exit 0: avviso conservato, non dichiarato assente. Hash uguale al digest pubblico; lettura dei file riuscita. Nei test SDK compaiono rifiuti intenzionali delle copie negative e del vecchio XLSX storico, non errori dei nuovi esportati. Eventuali avvisi Vite, PDF negativo e NU1900 sono mantenuti negli output sopra. Nessun fallimento dei comandi finali è stato nascosto.

## 4. Cosa funziona, provato

Il repository adotta A. Uso gratuito anche professionale e su più computer; codice originale, grafica e marchi riservati; installer non redistribuibili, link ufficiale condivisibile; documenti dell’utente esclusi dalla concessione di diritti al titolare. Otto clausole allineate fra bozza adottata e LICENSE. B non adottata e nessuna nuova licenza aperta applicata.

Build, 66 test unitari, browser, SDK, offline, desktop e quattro YAML passati. I 13 nuovi esportati passano SDK senza eccezioni; la copia storica continua a essere verificata a parte. Nessuna connessione aggiunta o modifica alla preferenza degli aggiornamenti; la licenza descrive il controllo come disattivabile senza dichiararlo acceso o spento all’avvio.

I quattro file pubblici sono byte-identici ai digest GitHub registrati. Il tag v0.2.2 resta sul commit 2128469f6682b377135503973fc910c98bc941e2. Nessuna richiesta di scrittura verso la Release è stata effettuata.

## 5. Cosa NON funziona o non hai potuto provare

### Dati e verifiche mancanti

- **Titolare e recapito: [TITOLARE E RECAPITO: DA COMPILARE].** Nessun nome, indirizzo o ragione sociale inventati. I riferimenti “Cosmonet” dei metadati sono osservazioni storiche, non dati anagrafici verificati del titolare.
- **Revisione professionale:** il testo definitivo deve essere rivisto da un professionista. Questa stesura non è consulenza legale; i test non certificano validità o titolarità.
- **Coerenza con versioni pubblicate:** la **0.2.2 pubblicata contiene ancora la licenza precedente nel suo assetto di rilascio**, non A. Precisazione verificata: il vecchio LICENSE è nel repository al tag v0.2.2, SHA-256 7e116e2af67da1731c58945412a0f5b266a0b90f4ae9db7a02d21a831ee05305; i quattro installer non contengono il file della licenza propria. Non si dichiara falsamente di aver trovato il vecchio LICENSE dentro i payload. Nessun pacchetto o nota della Release viene sostituito.
- **Distribuzione futura:** package.json senza license, configurazione senza inclusione di LICENSE e copyright storico restano da allineare, dopo definizione del titolare e istruzioni. LIC-001 resta aperto. Nessuna aggiunta implicita di pagina NSIS o accettazione.

Non provati installazioni pulite, hardware Mac, conclusione dell’installer/UAC, AppImage reale in uso, accettazione o validità del contratto. Non necessaria né effettuata una nuova prova funzionale del codice updater, che non cambia. Nessuna nuova versione o tag.

## 6. Bug e dubbi

LIC-001 aperto, distribuzione della licenza propria e metadati non allineati. Non risolto da una modifica solo al repository. Nessun bug applicativo chiuso da questo passo e nessuna libertà aggiuntiva introdotta nei testi. La scelta del motore e le altre idee di ricerca restano sospese.

## 7. Hash del commit e CI

Base: e775fb0823684ac450c00e6caab4703b0ce4181f. Hash di questo passo: git log -1 --format=%H -- docs/report/2026-11-22_2125_adozione-licenza-a.md; comunicato dopo il push. Il proprio hash non può essere incluso nel contenuto dello stesso commit.

CI della base e775fb0 verificata nuovamente: [45063906266](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45063906266), cinque lavori success. Anche updater 06945c6: [45056887388](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45056887388), cinque success.

La run del nuovo commit di adozione non esiste ancora al momento della scrittura. Dopo il push sarà controllata e il link con l’esito reale verrà comunicato; nessun verde anticipato.

## 8. Prossimo passo

Pull --rebase e push del solo commit di adozione su main; seguire la nuova CI e segnalare l’esito. Completare [TITOLARE E RECAPITO: DA COMPILARE] e revisione professionale. Per futuri pacchetti, definire l’allineamento del testo e dei metadati senza riscrivere 0.2.2 né introdurre pagine di accettazione non richieste. La scelta dello stato iniziale degli aggiornamenti resta dell’utente.
