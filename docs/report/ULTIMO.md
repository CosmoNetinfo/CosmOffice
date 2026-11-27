# Test Android: disponibilità reale dello storage al cold boot

## 1. Obiettivo

Stabilizzare la preparazione dei campioni nel runner Android, senza aggirare permessi o sostituire le operazioni reali. APK ancora in collaudo: non si nasconde il terzo fallimento.

## 2. Cosa hai fatto

- scripts/android-smoke.mjs: attesa fino a 90 secondi della creazione e rilettura di un piccolo file prova nella Download; cancellato soltanto quel file del test. Poi staging in tmp, copia dei soli byte e SHA-256 di ogni campione. Nessun root/chmod o nuovo permesso.
- storage-ready.json registra esito, tentativi e durata; timeout interrompe prima dell’installazione, senza dichiarare PASS. Diagnostico CE in sola lettura al posto del comando non supportato.
- CHANGELOG.md, docs/BUG.md (AND-005 riaperto), CI.md, VALIDATION.md, report e ULTIMO.md. Nessuna nuova dipendenza; notices rigenerati invariati.
- Non toccati: src/, electron/, progetto/app Android, motori, licenze, preferenze aggiornamenti desktop, versione, tag o installer pubblici. Chiave privata sempre fuori Git e dalla CI.

## 3. Esiti reali di build e test

Terza CI Android [46014692576](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692576), commit a57fed7a7361fe9ad72dd1c7485a50978d5d7a52: **failure** nella copia dei campioni, prima dell’installazione. Build/lint/ispezione APK passati. Nessuna prova dell’app avviata. Estratto reale:

```text
2026-11-27T14:20:55.5593338Z [command]/usr/bin/sh -c node scripts/android-smoke.mjs
2026-11-27T14:20:56.6599147Z tests/fixtures/01-testo-stili.docx: 1 file pushed, 0 skipped. 98.1 MB/s (9657 bytes in 0.000s)
2026-11-27T14:20:56.8753052Z cp: /sdcard/Download/android-write.docx: Operation not permitted
2026-11-27T14:20:57.0343226Z node:internal/errors:986
2026-11-27T14:20:57.0373222Z   const err = new Error(message);
2026-11-27T14:20:57.0402323Z               ^
2026-11-27T14:20:57.0461981Z
2026-11-27T14:20:57.0513531Z Error: Command failed: adb shell cp /data/local/tmp/cosmoffice-smoke/android-write.docx /sdcard/Download/android-write.docx
2026-11-27T14:20:57.0560759Z cp: /sdcard/Download/android-write.docx: Operation not permitted
2026-11-27T14:20:57.0583295Z
2026-11-27T14:20:57.0624516Z     at genericNodeError (node:internal/errors:986:15)
2026-11-27T14:20:57.0626464Z     at wrappedFn (node:internal/errors:540:14)
2026-11-27T14:20:57.0627060Z     at checkExecSyncError (node:child_process:943:11)
2026-11-27T14:20:57.0627584Z     at execFileSync (node:child_process:979:15)
2026-11-27T14:20:57.0628261Z     at run (file:///home/runner/work/CosmOffice/CosmOffice/scripts/android-smoke.mjs:10:26)
2026-11-27T14:20:57.0629019Z     at file:///home/runner/work/CosmOffice/CosmOffice/scripts/android-smoke.mjs:25:9 {
2026-11-27T14:20:57.0640245Z   status: 1,
2026-11-27T14:20:57.0640674Z   signal: null,
2026-11-27T14:20:57.0641022Z   output: [
2026-11-27T14:20:57.0641356Z     null,
2026-11-27T14:20:57.0642055Z     '',
2026-11-27T14:20:57.0642648Z     'cp: /sdcard/Download/android-write.docx: Operation not permitted\n'
2026-11-27T14:20:57.0643350Z   ],
2026-11-27T14:20:57.0643685Z   pid: 3718,
2026-11-27T14:20:57.0644276Z   stdout: '',
2026-11-27T14:20:57.0644697Z   stderr: 'cp: /sdcard/Download/android-write.docx: Operation not permitted\n'
2026-11-27T14:20:57.0645105Z }
2026-11-27T14:20:57.0645227Z
2026-11-27T14:20:57.0645330Z Node.js v24.22.3
2026-11-27T14:20:57.0662183Z ##[error]The process '/usr/bin/sh' failed with exit code 1
2026-11-27T14:20:57.0663878Z
```

Artifact 15206231518 scaricato, SHA-256 47e6c7fcd5f4c9c18bffe87f5f0c42eb33f2c53bdc47d4fe092fc64a3b3ab296 coincidente con il digest GitHub; diagnostica reale:

```text
uid=2000(shell) gid=2000(shell) groups=2000(shell),1004(input),1007(log),1011(adb),1015(sdcard_rw),1028(sdcard_r),1078(ext_data_rw),1079(ext_obb_rw),3001(net_bt_admin),3002(net_bt),3003(inet),3006(net_bw_stats),3009(readproc),3011(uhid),3012(readtracefs) context=u:r:shell:s0

lrw-r--r-- 1 root     root       21 2025-01-23 17:21 /sdcard -> /storage/self/primary
drwxrws--- 2 u0_a194  media_rw 4096 2026-11-27 14:20 /sdcard/Download
drwxrws--- 5 media_rw media_rw 4096 2026-11-27 14:20 /storage/emulated/0

Unknown command: is-user-unlocked

```

La cartella esisteva ma la scrittura era respinta; la diagnostica non dimostra una causa unica. Il successo del passo precedente non rende stabile il cold boot: AND-005 riaperto. Nessun errore applicativo nascosto.

CI desktop: 9421c6a [46009717586](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717586) e d3f9aef [46012068280](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068280) **sei lavori success osservati**, inclusa NSIS installata/disinstallata. a57fed7 [46014692885](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692885) ancora in corso prima del push (checks/interop/Linux passati, Windows e Mac in corso). Se ancora attiva, la concorrenza esistente la annullerà al nuovo push: non viene dichiarata verde. Nessuna modifica al codice desktop nei passi dei test.

**16 controlli locali tutti exit 0**, 75 test unitari passati; output integrali sotto, normalizzati soltanto ANSI/percorsi personali/spazi finali. La nuova preparazione dovrà passare nella CI: il controllo sintattico non dimostra il funzionamento su Android.

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

✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (12.3252ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (4.5021ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (81.2241ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (73.0978ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (131.0546ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (180.9683ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (31.0886ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (37.3958ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (35.0951ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (25.6932ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (5.9046ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.7416ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (40.2461ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (3.9564ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (99.7596ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (76.1161ms)
✔ unknown formulas retain their source without exporting a misleading cached number (15.0627ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.4857ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (15.7393ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.4471ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.242ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.0896ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (150.925ms)
✔ references, arithmetic, precedence and percentages (3.8198ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0491ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.86ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.7211ms)
✔ Excel address limits and column naming (1.5391ms)
✔ conditional sums, lookups, text, dates and error handling (3.7085ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.5805ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4108ms)
✔ literal text resembling errors stays text while actual formula errors propagate (1.244ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7853ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.5609ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (3.059ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (1.528ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.0891ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (237.9163ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (43.8822ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.4727ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (101.1992ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (16.9131ms)
✔ Release corrente: note complete per la versione realmente distribuita (7.7632ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (4.9365ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (65.6598ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.7375ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (31.1797ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (119.5816ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (32.8512ms)
✔ damaged files and mismatched Office extensions are rejected before import (11.0943ms)
✔ unsupported parts produce specific warnings without changing the original file (31.3319ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.9913ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.725ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (783.5273ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1769.6303ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (3.1197ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.7862ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.3571ms)
✔ TLS Node: errore di certificato senza fallback (1.15ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (18.493ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.0935ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (121.757ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.2792ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.9921ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.8204ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (1.9015ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.0012ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.514ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (20.6389ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.1295ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (3.4647ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (19.8496ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.7475ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (27.5447ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.8024ms)
ℹ tests 75
ℹ suites 0
ℹ pass 75
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3005.4716
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
15:24:56 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
15:26:53 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

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

Tempo trascorso 00:00:02.68
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
        "THIRD_PARTY_NOTICES.txt": "8e5674f231a242ced415f0bdd5589f8a0abe2960ae0eeefbb8f3946a9ba5d6db"
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

## 4. Cosa funziona (provato)

Controlli locali e due CI desktop complete sopra. Nella sola seconda run Android: APK installato e Home/permessi PASS, DOCX aperto e modificato ma round trip incompleto. APK compilato/firmato, licenze verificate; firma locale e SHA-256 07372fc9caaea80f50b95e96bb142cbacf206d20eb2854fb59cfc8e608471079 restano riferiti allo stesso codice app immutato.

## 5. Cosa NON funziona o non hai potuto provare

Preparazione precedente instabile, terza run non avvia l’app. Attesa dello storage, copia senza metadati e correzioni DocumentsUI/screenshot ancora da verificare insieme nella nuova run. Non dichiarati riusciti DOCX round trip, XLSX/PDF/MD o appunti nativi. Telefono/tablet fisico, tastiera/gesti, aggiornamento Android in luogo, provider cloud e memoria limitata non provati. Stampa/Word→PDF Android assenti; trasferimenti bridge limitati a 10 MB. Nessun APK pubblico o nuova Release.

## 6. Bug e dubbi

AND-005 aperto; il limite di 90 secondi è una guardia di preparazione, non una deroga alle prove. AND-006/007 non esercitati nella terza run. Non si disabilitano SELinux, permessi o confronti SHA e non si simula il selettore. Nessuna nuova idea dello studio o scelta del motore. Non modificata la Release desktop 0.2.3; chiave privata mai inviata.

## 7. Hash dei commit

9421c6a355ccd335fcc1fe22ade4eed4de9a533b (APK); d3f9aefb46c261619e75eda4475a127f8e3560ca (staging); a57fed7a7361fe9ad72dd1c7485a50978d5d7a52 (selettore/screenshot). Questo passo: git log -1 --format=%H -- docs/report/2026-11-27_1532_android-storage-pronto.md, hash comunicato dopo il push.

## 8. Prossimo passo

Leggere storage-ready.json e il collaudo nativo della nuova CI. Prima di consegnare l’APK come collaudato devono passare tutti gli otto casi, file esportati, SHA originali e screenshot. Poi resta la prova sul telefono fisico.
