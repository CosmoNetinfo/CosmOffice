# Report — studio delle suite office

## 1. Obiettivo

Studiare le principali suite gratuite/open source e il nodo della fedeltà DOCX/XLSX, produrre confronto, opportunità, roadmap e alternative senza scegliere né implementare un nuovo motore. Solo ricerca e documentazione, come richiesto nell'ultimo prompt.

## 2. Cosa hai fatto

- docs/ricerca/CONFRONTO.md: confronto di LibreOffice, ONLYOFFICE, Collabora, Calligra, AbiWord, Gnumeric, Apache OpenOffice e CryptPad, con licenze, tecnologia, funzioni, confini ed evidenze mancanti. Nessuna esclusiva CosmOffice inventata.
- docs/ricerca/OPPORTUNITA.md: proposte ordinate per valore e difficoltà nei tre gruppi richiesti.
- docs/ricerca/CODICE-STUDIATO.md: registro delle fonti e delle consultazioni, distinguendo documentazione copyleft da componenti permissivi e specifiche. Nessun codice di implementazione GPL/AGPL/MPL consultato, nessuna copia o riscrittura ravvicinata.
- docs/DECISIONI.md: decisioni pregresse e alternative aperte per il motore attuale, conversione locale, integrazione completa, modifica selettiva dell'originale, percorso ODF e motore originale da specifiche. Nessuna scelta dell'architettura fatta al posto dell'utente.
- docs/ROADMAP.md: priorità e stati espliciti, con difetti di integrità prima di nuove funzioni.
- CHANGELOG.md: introdotto il formato richiesto con Aggiunto, Modificato, Corretto, Rimosso e Limiti noti, senza inventare release o date di pubblicazione.
- README.md, docs/BUG.md e docs/VALIDATION.md: collegamenti allo studio, stato e limiti aggiornati.
- Questo report e docs/report/ULTIMO.md: stessa copia e fonti complete sotto.

Il lavoro precedente sul validatore SDK, non ancora pubblicato, è stato preservato localmente con git stash prima dello studio. Non è stato inserito in questo commit. I relativi artefatti di compilazione sono stati conservati sotto test-results, non pubblicati. Nessuna modifica a src/, electron/, scripts/, tests/, dipendenze, workflow o licenza del progetto. scripts/notices.mjs eseguito; THIRD_PARTY_NOTICES.txt non cambia perché non viene incorporato alcun nuovo componente.

## 3. Esiti reali di build e test

Nuova sequenza sul codice main fa1619564d91ef39757d82f0e16675d371835529, non sul prototipo messo da parte. Tutti i comandi seguenti terminati con codice 0. Il pacchetto è stato ricostruito da questo stesso codice prima di desktop-smoke.

### npm run build

```text
> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2405 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-DegIELvb.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-8ktBdiiU.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-B1UQfFot.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-B2FSo26L.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CaqtXkIh.js             2,321.06 kB │ gzip: 695.89 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 2.76s
```

### npm test

```text
> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (71.3008ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (85.7143ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (119.729ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (178.7052ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (30.9734ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (38.4478ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (23.3274ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (27.2248ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (102.0822ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (76.0393ms)
✔ unknown formulas retain their source without exporting a misleading cached number (10.1249ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.3208ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (11.9748ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.7267ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.5113ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (7.4203ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (164.6773ms)
✔ references, arithmetic, precedence and percentages (5.378ms)
✔ Italian aliases, absolute references, text and lazy IF (0.9585ms)
✔ cycles, division by zero and unknown functions are visible and propagated (1.1014ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8432ms)
✔ Excel address limits and column naming (1.4384ms)
✔ conditional sums, lookups, text, dates and error handling (5.1737ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.8137ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.7347ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8425ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.9875ms)
✔ Il processo principale non contiene updater o caricamenti da server (9.4459ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (227.5212ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (46.5605ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (13.8241ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (109.3318ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (21.1358ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (123.2678ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (40.1417ms)
✔ damaged files and mismatched Office extensions are rejected before import (9.262ms)
✔ unsupported parts produce specific warnings without changing the original file (45.3865ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (16.4099ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (14.8181ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (961.0271ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1867.2734ms)
ℹ tests 41
ℹ suites 0
ℹ pass 41
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3137.0186
```

### npm run test:browser

```text
> cosmoffice@0.2.2 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs

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
10:05:41 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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
```

### node scripts/charts-interop.mjs

```text
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795338436978\ods\grafici-ui.ods using filter : calc8
convert V:\CosmonetOffice\test-results\charts-interop-1795338436978\ods\grafici-ui.ods as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795338436978\xlsx\grafici-ui.xlsx using filter : Calc Office Open XML
convert V:\CosmonetOffice\test-results\grafici-ui.xlsx as a Calc document -> V:\CosmonetOffice\test-results\charts-interop-1795338436978\xlsx\grafici-ui.pdf using filter : calc_pdf_Export
{
  "result": "PASS",
  "engine": "LibreOffice: XLSX → ODS → XLSX e PDF",
  "charts": [
    {
      "type": "bar",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    },
    {
      "type": "line",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    },
    {
      "type": "pie",
      "values": [
        [
          37,
          20
        ]
      ],
      "labels": [
        "Gennaio personalizzato",
        "Febbraio"
      ],
      "result": "PASS"
    }
  ],
  "print": {
    "pages": 1,
    "landscape": true
  },
  "output": "V:\\CosmonetOffice\\test-results\\charts-interop-1795338436978",
  "limits": "Microsoft Excel non eseguito. I file riscritti da LibreOffice vengono aperti in sola lettura da CosmOffice per conservarne i grafici. Adattamento a una pagina anche in altezza: i fogli grandi si riducono in stampa."
}
```

### npm run pack

```text
> cosmoffice@0.2.2 pack
> npm run build && npm run icons && node scripts/notices.mjs && electron-builder --config electron-builder.config.cjs --dir --publish never


> cosmoffice@0.2.2 build
> node scripts/pdf-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
vite v8.3.8 building client environment for production...
transforming...
✓ 2405 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               0.93 kB │ gzip:   0.50 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-CXaGNzX4.css               44.59 kB │ gzip:  10.33 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/PdfViewer-DegIELvb.js            10.91 kB │ gzip:   4.17 kB
dist/assets/SettingsPage-8ktBdiiU.js         19.96 kB │ gzip:   6.86 kB
dist/assets/GridEditor-B1UQfFot.js          203.76 kB │ gzip:  70.73 kB
dist/assets/import-docx-B2FSo26L.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-CaqtXkIh.js             2,321.06 kB │ gzip: 695.89 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.12s

> cosmoffice@0.2.2 icons
> node scripts/icons.mjs

Icone CosmOffice, CosmoWrite, CosmoGrid e CosmoView generate.
Attribuzioni e licenze raccolte.
  • electron-builder  version=26.18.0 os=10.0.26300
  • loaded configuration  file=V:\CosmonetOffice\electron-builder.config.cjs
  • skipped dependencies rebuild  reason=npmRebuild is set to false
  • packaging       platform=win32 arch=x64 electron=45.4.1 appOutDir=release\win-unpacked
  • downloaded      label=electron progress=100%
  • downloaded electron zip extracted successfully  output=V:\CosmonetOffice\release\win-unpacked
  • searching for node modules  pm=npm searchDir=V:\CosmonetOffice
  • no node modules found in collection, trying next search directory  pm=npm searchDir=V:\CosmonetOffice
  • searching for node modules  pm=traversal searchDir=V:\CosmonetOffice
  • using manual traversal of node_modules to build dependency tree
  • no node modules found in collection, trying next search directory  pm=traversal searchDir=V:\CosmonetOffice
  • no node modules returned while searching directories  searchDirectories=[""]
  • updating asar integrity executable resource  executablePath=release\win-unpacked\CosmOffice.exe
  • no code signing certificate configured, signing is skipped  path=release\win-unpacked\CosmOffice.exe
```

### node scripts/offline-smoke.mjs

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

### node scripts/desktop-smoke.mjs

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

Controllo documentale aggiuntivo realmente eseguito:

```text
PASS: collegamenti locali e perimetro di sola documentazione; nessuna modifica a codice, test, dipendenze o workflow.
```

## 4. Cosa funziona (provato)

41 test del motore e tutte le suite browser passati, incluso il corpus di 13 file, categorie reali, vecchio file in sola copia e ortografia. LibreOffice conferma i tre grafici e la pagina orizzontale del campione. Offline-smoke senza nuove connessioni. Pacchetto Windows avviato e salvataggi/riaperture provati. Collegamenti locali dei documenti verificati. Tutti i cambiamenti di questo passo sono documentali.

Le fonti distinguono prodotti ed edizioni: Collabora ha anche un desktop locale; ONLYOFFICE Desktop non richiede un account per lavorare sui file locali; Gnumeric dichiara di non distribuire binari Windows; la guida AOO4 distingue apertura e salvataggio OOXML. Sono riscontri documentali, non nostre prove comparative delle applicazioni.

## 5. Cosa NON funziona o non hai potuto provare

- Nessun motore, novità, integrazione, rapporto interno per i tester, aggiornamento automatico o release viene implementato o pubblicato da questo studio. Le richieste precedenti restano documentate come non completate, senza fingere che lo siano.
- Non provato: installazione di tutte le suite, confronto visivo sullo stesso corpus reale, Microsoft Word/Excel effettivi, computer fisici Mac/Linux, installer su sistemi puliti, crash reali e prestazioni comparative.
- Il sito storico AbiWord non era raggiungibile dal nostro strumento: usati documentazione del progetto, manuale distribuito e metadati dei pacchetti, con limite dichiarato. Alcuni URL iniziali Calligra restituivano 404: sono stati sostituiti dai collegamenti ufficiali corretti.
- Non è dimostrata una funzione esclusiva di CosmOffice rispetto a ogni suite. Offline, italiano, PDF e gratuità non sono esclusive sufficienti. Le novità proposte richiedono validazione e scelta dell'utente.
- I test funzionali verdi non certificano la conformità di ogni OOXML: FMT-001/002/003 restano aperti sul main di riferimento. Il prototipo SDK locale di correzione non è distribuito qui.

## 6. Bug e dubbi

Difetti emersi nell'audit preparatorio precedente e ora registrati onestamente sul main: ordine sz dei font XLSX (Sch_UnexpectedElementContentExpectingComplex), editAs non dichiarato su oneCellAnchor (Sch_UndeclaredAttribute), duplicazione evenAndOddHeaders nel DOCX (Sch_UnexpectedElementContentExpectingComplex) e tipo MIME del disegno dei grafici errato.

Errore esatto di apertura del vecchio XLSX, riportato dal wrapper del validatore:

```text
AperturaFallita
The document cannot be opened because there is an invalid part with an unexpected content type.
[Part Uri=/xl/drawings/cosmoDrawing1.xml],
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml],
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
```

Il difetto era anche nel generatore corrente del main. Il prototipo locale lo correggeva, ma non è stato pubblicato perché il lavoro corrente è solo di studio. Excel potrebbe rifiutare il vecchio file o proporre un recupero: è un rischio dedotto dalla non conformità e dal rifiuto SDK, non una prova fatta in Excel. La validazione storica si ferma all'apertura, quindi non esclude altri difetti. La copia identica è l'eccezione storica esplicitamente autorizzata; non viene estesa ai nuovi esportati.

Una lettura iniziale dei metadati delle librerie con require è fallita per ERR_PACKAGE_PATH_NOT_EXPORTED; riletti i package.json direttamente dal filesystem. Nessun test applicativo della nuova sequenza è fallito. Restano l'avviso dimensione bundle e pacchetti non firmati.

## 7. Hash del commit

Base applicativa verificata: fa1619564d91ef39757d82f0e16675d371835529; CI precedente verde, run 45001481213. Studio e report vengono pubblicati insieme in un solo commit documentale. L'hash effettivo del nuovo commit è nella cronologia del presente file e nella risposta conclusiva; un hash autoreferenziale non può essere inserito nel medesimo commit senza modificarlo.

## 8. Prossimo passo

Attendere la scelta dell'utente sulle alternative di docs/DECISIONI.md. Nessuna proposta viene implementata automaticamente. Prima di ampliare il prodotto, la roadmap pone i difetti di formato e le prove sui documenti reali. Le future Release dovranno essere derivate dal CHANGELOG e riportare novità, correzioni, limiti, prove mancanti e prossimi passi.

### Fonti usate nello studio

Fonti effettivamente usate per la ricerca, collegate anche vicino alle affermazioni nei documenti. Nessuna recensione di terzi è stata usata per dichiarare prestazioni o superiorità.

1. [Keep a Changelog](https://keepachangelog.com/it-IT/1.1.0/)
2. [versionamento semantico](https://semver.org/lang/it/)
3. [Mammoth](https://raw.githubusercontent.com/mwilliamson/mammoth.js/master/README.md)
4. [ExcelJS 4.4.0](https://raw.githubusercontent.com/exceljs/exceljs/v4.4.0/README.md)
5. [parametri di avvio ufficiali](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html)
6. [licenze LibreOffice](https://www.libreoffice.org/licenses/)
7. [limiti dei filtri Office](https://help.libreoffice.org/latest/en-US/text/shared/guide/ms_import_export_limitations.html)
8. [ONLYOFFICE Desktop](https://helpcenter.onlyoffice.com/desktop/getting-started)
9. [Docs API](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works)
10. [termini Collabora](https://www.collaboraonline.com/terms/collabora-online-mplv2/)
11. [ECMA-376 e convenzioni di pacchetto](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
12. [funzioni Writer](https://help.libreoffice.org/latest/en-US/text/swriter/main0503.html)
13. [funzioni Calc](https://help.libreoffice.org/latest/en-US/text/scalc/main0503.html)
14. [PDF desktop](https://helpcenter.onlyoffice.com/docs/userguides/pdf_editor/hometab.aspx)
15. [note di rilascio desktop](https://helpcenter.onlyoffice.com/desktop/desktop-changelog)
16. [release desktop 26.04](https://www.collaboraonline.com/blog/collabora-office-26-04-release/)
17. [FAQ delle edizioni](https://www.collaboraonline.com/faqs/)
18. [Calligra 4.0 e passaggio Qt6/KF6](https://calligra.org/news/2024-08-calligra-4.0/)
19. [Words e licenza GPL-2.0-or-later](https://apps.kde.org/calligra.words/)
20. [distribuzione](https://calligra.org/download/)
21. [manuale del programma, distribuito da Debian](https://manpages.debian.org/testing/abiword/abiword.1.en.html)
22. [metadati GTK e licenza del pacchetto SUSE](https://packagehub.suse.com/packages/abiword/)
23. [documentazione README](https://raw.githubusercontent.com/AbiWord/abiword/master/README)
24. [informazioni di copyright](https://raw.githubusercontent.com/AbiWord/abiword/master/COPYRIGHT.TXT)
25. [progetto e GPL 2 oppure 3](https://gnome.pages.gitlab.gnome.org/gnumeric-web/)
26. [manuale](https://gnome.pages.gitlab.gnome.org/gnumeric/manual/chapter-welcome.html)
27. [rilascio 1.12.62](https://gnome.pages.gitlab.gnome.org/gnumeric-web/announcements/1.12/gnumeric-1.12.62.html)
28. [download ufficiale](https://gnome.pages.gitlab.gnome.org/gnumeric-web/download.html)
29. [prodotti](https://www.openoffice.org/product/)
30. [licenza](https://www.openoffice.org/license.html)
31. [opzioni di caricamento e salvataggio](https://wiki.openoffice.org/wiki/Documentation/AOO4_User_Guides/Getting_Started/Setting_Up_and_Customizing_Apache_OpenOffice/Choosing_Options_for_Loading_and_Saving_Documents)
32. [presentazione e licenza](https://cryptpad.org/about/)
33. [FAQ e integrazione Office](https://docs.cryptpad.org/en/FAQ.html)
34. [sito storico](https://www.abisource.com/)
35. [Microsoft: validare un DOCX](https://learn.microsoft.com/en-us/office/open-xml/word/how-to-validate-a-word-processing-document)
36. [release SDK](https://github.com/dotnet/Open-XML-SDK/releases)
37. [licenza SDK](https://raw.githubusercontent.com/dotnet/Open-XML-SDK/v3.5.1/LICENSE)
38. [FileFormatVersions.cs del SDK](https://raw.githubusercontent.com/dotnet/Open-XML-SDK/v3.5.1/src/DocumentFormat.OpenXml.Framework/FileFormatVersions.cs)
39. [Classe Font nella documentazione SDK](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.font?view=openxml-3.0.1)
40. [GitHub Release API](https://docs.github.com/en/rest/releases/releases)
