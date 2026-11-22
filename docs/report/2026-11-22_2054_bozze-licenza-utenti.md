# Bozze della licenza utenti e stato aggiornato

## 1. Obiettivo

Completare il punto ancora aperto e già richiesto: due bozze in docs/LICENZA-BOZZE.md, senza modificare LICENSE, scegliere una licenza o decidere il motore. Confermare la CI dell’ultimo codice e aggiornare gli stati documentali superati.

## 2. Cosa hai fatto

- docs/LICENZA-BOZZE.md: A, uso gratuito con codice e marchio riservati; B, apertura del codice con MIT oppure Apache-2.0 da selezionare. Testi italiani proposti, confronto, limiti, titolare e ambito da confermare. Le bozze non sono operative e non cambiano gli installer.
- CHANGELOG.md: aggiunta documentale in Non rilasciato.
- docs/ROADMAP.md: corrette le voci che dichiaravano ancora assenti Release, Mac e updater; bozze consegnate, scelta in attesa.
- docs/DECISIONI.md: nessuna adozione automatica, né scelta del motore.
- docs/CI.md: CI updater 06945c6 verificata verde, cinque lavori success, con link.
- docs/BUG.md e docs/VALIDATION.md: nessun bug applicativo chiuso; resta il tema della concessione d’uso da risolvere con la decisione del titolare.
- docs/ricerca/CODICE-STUDIATO.md: registro delle tre fonti pubbliche di licenza/documentazione, nessun codice consultato o copiato.
- Questo report e copia identica docs/report/ULTIMO.md.

Fonti effettivamente lette il 22 novembre 2026: [MIT, OSI](https://opensource.org/license/mit), [Apache-2.0, ASF](https://www.apache.org/licenses/LICENSE-2.0), [Open Source Definition, OSI](https://opensource.org/osd). Parafrasi originali e link ai testi completi, nessuna nuova libreria. scripts/notices.mjs rieseguito, avvisi invariati.

## 3. Esiti reali di build e test

Tutti i comandi finali sotto sono terminati con exit 0; output effettivi copiati, rimossi soltanto gli spazi finali. Anche per questo passo solo documentale sono state eseguite le verifiche richieste prima del push.

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
✓ built in 3.21s
[PLUGIN_TIMINGS] JavaScript callbacks ran for 2.2s of this 3.2s build (69%).
The slowest callbacks, timed inside each callback (the wait before a callback starts is excluded, the time it awaits is included):
  - plugin vite:prepare-out-dir renderStart (66%, 2.1s, 1 call)
Additional callback time came from callbacks under 1s.
See https://rolldown.rs/reference/InputOptions.checks#bundlertimings for more details.
```

### npm test — exit 0

```text

> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (80.4077ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (82.7571ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (139.4489ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (209.4559ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (34.9603ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (45.357ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (50.5526ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (34.2553ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.7813ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.5835ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (51.2395ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.3744ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (130.5264ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (98.1679ms)
✔ unknown formulas retain their source without exporting a misleading cached number (13.4515ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (3.3133ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (19.5121ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.2212ms)
✔ landscape DOCX uses a physically wider page with matching orientation (8.5375ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (10.1477ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (208.5442ms)
✔ references, arithmetic, precedence and percentages (4.3127ms)
✔ Italian aliases, absolute references, text and lazy IF (1.0213ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.8339ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (1.291ms)
✔ Excel address limits and column naming (1.5191ms)
✔ conditional sums, lookups, text, dates and error handling (4.354ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6917ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4026ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.8401ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.6415ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.6933ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (14.5185ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (267.0571ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (46.662ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (16.5747ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (95.4528ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (24.9386ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (5.7694ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (73.8729ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (1.0701ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (52.6546ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (153.147ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (49.0615ms)
✔ damaged files and mismatched Office extensions are rejected before import (15.5417ms)
✔ unsupported parts produce specific warnings without changing the original file (44.8738ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (13.2382ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (11.733ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (1098.78ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (2065.7709ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (4.4886ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (8.4399ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (2.0984ms)
✔ TLS Node: errore di certificato senza fallback (0.8994ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (22.3121ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (6.5978ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.6876ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (2.9598ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (21.7333ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (39.0475ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (6.7717ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (4.8317ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (26.5739ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.9525ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (31.7716ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (4.7614ms)
ℹ tests 66
ℹ suites 0
ℹ pass 66
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3594.2636
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
20:54:43 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

## 4. Cosa funziona, provato

Build, 66 test unitari, suite browser, offline-smoke e desktop-smoke passati sullo stesso codice applicativo del main. Verifica locale: nessuna differenza in src/, electron/, scripts/, workflow, manifesti o THIRD_PARTY_NOTICES.txt. LICENSE byte per byte uguale alla base; SHA-256 7e116e2af67da1731c58945412a0f5b266a0b90f4ae9db7a02d21a831ee05305.

I collegamenti locali del nuovo documento sono validi. Le fonti ufficiali sono state aperte e confrontate. La bozza A distingue uso gratuito da riserva del codice; B non introduce divieti di vendita/modifica incompatibili con l’opzione aperta. Marchi e componenti di terzi restano separati. Nessun testo adottato implicitamente.

CI dell’ultimo codice 06945c6: [45056887388](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45056887388), checks, interop, Windows, Linux e Mac tutti success. Si tratta della run già completata e interrogata di nuovo, non di una previsione della CI di questo documento.

## 5. Cosa NON funziona o non hai potuto provare

**Non provato:** validità legale definitiva, titolarità/contributi e adeguatezza nei diversi ordinamenti: sono bozze da verificare prima dell’adozione. Nessuna scelta A/B, MIT/Apache, concessione sul marchio o autorizzazione alla redistribuzione è stata applicata.

Il LICENSE attuale resta restrittivo e non viene risolto automaticamente il rapporto fra gratuità dichiarata e diritti d’uso concessi. La bozza A propone condivisione del link invece di copie degli installer, ma tale limite richiede la scelta esplicita del titolare. Nessuna schermata di accettazione aggiunta.

Restano non provati installazione su computer puliti, UAC/installer effettivo, AppImage vera in uso e Mac fisici. La Release 0.2.2 resta immutata e non contiene l’updater successivo di main. Nessuna nuova Release pubblicata.

## 6. Bug e dubbi

Nessun test fallito in questo passo e nessun bug tecnico dichiarato risolto. Restano gli avvisi di build già documentati e i limiti di compatibilità del corpus. I vecchi stati contraddittori della roadmap sono stati allineati alle prove esistenti; non è stata inventata una nuova verifica fisica.

## 7. Hash del commit e CI

Base: 06945c6e55ec6f18d2a6e0c5af1f4e1c2736b6c4. Hash del presente passo: git log -1 --format=%H -- docs/report/2026-11-22_2054_bozze-licenza-utenti.md; comunicato dopo il push. Un report incluso nel commit non può contenere il proprio hash finale.

La CI di questo nuovo commit documentale esisterà solo dopo il push; sarà controllata e comunicata con il link. Quella di 06945c6 è già verde, come riportato sopra e in docs/CI.md.

## 8. Prossimo passo

Pull --rebase e push su main dopo i controlli verdi. La decisione successiva è del titolare: A oppure B; se B, MIT oppure Apache-2.0. Prima di applicarla confermare titolare, ambito, marchio e politica di redistribuzione, e far verificare il testo definitivo. Nessuna altra idea o scelta del motore implementata.
