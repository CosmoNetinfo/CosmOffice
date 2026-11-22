# Studio ArtCraft — ricerca e documentazione

Data: 22 novembre 2026. Ramo main. Un solo cambiamento logico: studio documentato, senza modifiche al codice dell’app.

## 1. Obiettivo

Studiare WordCraft, GridCraft e craft-launcher, verificare licenze e metodi a commit precisi, proporre idee ordinate per CosmOffice senza integrare codice, cambiare il motore o modificare src/, electron/, scripts/, workflow e LICENSE. Registrare anche la risposta dell’utente al precedente quesito sul TLS Node, come autorizzazione futura, senza implementarla in questo passo.

## 2. Cosa hai fatto

File creati o modificati:

- docs/ricerca/ARTCRAFT.md: risposte su DOCX/XLSX, conservazione, test, --strict, aggiornamenti, firme e privacy dei log; otto idee ordinate per valore con difficoltà, rischi e lavoro originale.
- docs/ricerca/CODICE-STUDIATO.md: 80 file consultati, classificati come codice o documentazione, a sei revisioni precise di quattro repository. Quattro documenti legali verificati prima del codice a ogni revisione; marchi e risorse con altre condizioni esclusi.
- README.md: collegamenti allo studio e comportamento autorizzato del futuro trasporto TLS Node, ancora assente.
- docs/DECISIONI.md: alternative e limiti dello studio senza scelta del motore; otto condizioni dell’autorizzazione al TLS Node, inclusa conferma prima dell’installazione.
- docs/ROADMAP.md: stato della ricerca e metodi proposti, ancora subordinati alla scelta dell’utente.
- docs/BUG.md: nessun bug di fedeltà chiuso dallo studio; blocco di rete noto del prototipo aggiornamenti precedente, non pubblicato.
- docs/VALIDATION.md: distinzione fra studio statico, prove CosmOffice e updater futuro non provato.
- CHANGELOG.md: studio e autorizzazione documentati, senza presentare proposte come funzioni disponibili.
- docs/report/2026-11-22_1544_studio-artcraft.md e docs/report/ULTIMO.md: questo report e copia identica.

Nessuna dipendenza o nuova risorsa distribuita. Eseguito node scripts/notices.mjs: “Attribuzioni e licenze raccolte.”, exit 0; THIRD_PARTY_NOTICES.txt resta invariato. Nessuna modifica a LICENSE. Nessun codice terzo copiato o riscritto da vicino, nessuna implementazione copyleft letta. Non è stato necessario chiedere autorizzazione a copiare codice.

### Ogni fonte consultata

Elenco integrale dei file recuperati con successo; il [registro](../ricerca/CODICE-STUDIATO.md#studio-artcraft-del-22-novembre-2026) riporta natura, licenza/ambito e metodo per ciascuno. Le letture dei file grandi sono mirate alle sezioni pertinenti, non audit integrali.

- [storytold/craft-launcher: apps/artcraft-launcher/src/logging.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/apps/artcraft-launcher/src/logging.rs)
- [storytold/craft-launcher: ATTRIBUTION.md @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/ATTRIBUTION.md)
- [storytold/craft-launcher: Cargo.toml @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/Cargo.toml)
- [storytold/craft-launcher: crates/core/src/feed.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/core/src/feed.rs)
- [storytold/craft-launcher: crates/core/src/platform.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/core/src/platform.rs)
- [storytold/craft-launcher: crates/core/src/release.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/core/src/release.rs)
- [storytold/craft-launcher: crates/native/src/backend.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/native/src/backend.rs)
- [storytold/craft-launcher: crates/native/src/downloads.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/native/src/downloads.rs)
- [storytold/craft-launcher: crates/native/src/http.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/native/src/http.rs)
- [storytold/craft-launcher: crates/native/src/self_update.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/native/src/self_update.rs)
- [storytold/craft-launcher: crates/native/src/source.rs @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/crates/native/src/source.rs)
- [storytold/craft-launcher: docs/brand/LICENSE-brand.txt @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/docs/brand/LICENSE-brand.txt)
- [storytold/craft-launcher: docs/install-sources.md @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/docs/install-sources.md)
- [storytold/craft-launcher: LICENSE-APACHE @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/LICENSE-APACHE)
- [storytold/craft-launcher: LICENSE-MIT @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/LICENSE-MIT)
- [storytold/craft-launcher: NOTICE @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/NOTICE)
- [storytold/craft-launcher: README.md @ bbb3844954d9](https://github.com/storytold/craft-launcher/blob/bbb3844954d90e64c70a89ea493d0e7270478553/README.md)
- [storytold/craft-libs: ATTRIBUTION.md @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/ATTRIBUTION.md)
- [storytold/craft-libs: crates/docx/src/read.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/read.rs)
- [storytold/craft-libs: crates/docx/src/read/embed.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/read/embed.rs)
- [storytold/craft-libs: crates/docx/src/read/parts.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/read/parts.rs)
- [storytold/craft-libs: crates/docx/src/write.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/write.rs)
- [storytold/craft-libs: crates/docx/src/write/embed.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/write/embed.rs)
- [storytold/craft-libs: crates/docx/src/write/parts.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/write/parts.rs)
- [storytold/craft-libs: crates/docx/src/write/settings_merge.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/docx/src/write/settings_merge.rs)
- [storytold/craft-libs: crates/platform/src/logs.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/platform/src/logs.rs)
- [storytold/craft-libs: crates/platform/src/logs/crash.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/platform/src/logs/crash.rs)
- [storytold/craft-libs: crates/wordmodel/src/kept.rs @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/crates/wordmodel/src/kept.rs)
- [storytold/craft-libs: LICENSE-APACHE @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/LICENSE-APACHE)
- [storytold/craft-libs: LICENSE-MIT @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/LICENSE-MIT)
- [storytold/craft-libs: NOTICE @ 243d68e12d05](https://github.com/storytold/craft-libs/blob/243d68e12d05e89122db6d154924bf1992e10d38/NOTICE)
- [storytold/craft-libs: ATTRIBUTION.md @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/ATTRIBUTION.md)
- [storytold/craft-libs: crates/update/src/http.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/src/http.rs)
- [storytold/craft-libs: crates/update/src/install.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/src/install.rs)
- [storytold/craft-libs: crates/update/src/platform.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/src/platform.rs)
- [storytold/craft-libs: crates/update/src/self_update.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/src/self_update.rs)
- [storytold/craft-libs: crates/update/src/updater.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/src/updater.rs)
- [storytold/craft-libs: crates/update/tests/https_only.rs @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/crates/update/tests/https_only.rs)
- [storytold/craft-libs: LICENSE-APACHE @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/LICENSE-APACHE)
- [storytold/craft-libs: LICENSE-MIT @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/LICENSE-MIT)
- [storytold/craft-libs: NOTICE @ 453b0da782cc](https://github.com/storytold/craft-libs/blob/453b0da782ccef39be9a6dac8d27c80b553ef1cc/NOTICE)
- [storytold/craft-libs: ATTRIBUTION.md @ a20dfd162370](https://github.com/storytold/craft-libs/blob/a20dfd1623709b0bd9830106d3a92a1a443902e3/ATTRIBUTION.md)
- [storytold/craft-libs: LICENSE-APACHE @ a20dfd162370](https://github.com/storytold/craft-libs/blob/a20dfd1623709b0bd9830106d3a92a1a443902e3/LICENSE-APACHE)
- [storytold/craft-libs: LICENSE-MIT @ a20dfd162370](https://github.com/storytold/craft-libs/blob/a20dfd1623709b0bd9830106d3a92a1a443902e3/LICENSE-MIT)
- [storytold/craft-libs: NOTICE @ a20dfd162370](https://github.com/storytold/craft-libs/blob/a20dfd1623709b0bd9830106d3a92a1a443902e3/NOTICE)
- [storytold/gridcraft: apps/gridcraft-cli/src/check/fidelity.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/apps/gridcraft-cli/src/check/fidelity.rs)
- [storytold/gridcraft: apps/gridcraft-cli/src/check/package.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/apps/gridcraft-cli/src/check/package.rs)
- [storytold/gridcraft: apps/gridcraft/src/logging.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/apps/gridcraft/src/logging.rs)
- [storytold/gridcraft: ATTRIBUTION.md @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/ATTRIBUTION.md)
- [storytold/gridcraft: Cargo.toml @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/Cargo.toml)
- [storytold/gridcraft: crates/xlsx/src/lib.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/lib.rs)
- [storytold/gridcraft: crates/xlsx/src/package.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/package.rs)
- [storytold/gridcraft: crates/xlsx/src/passthrough.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/passthrough.rs)
- [storytold/gridcraft: crates/xlsx/src/passthrough/rebase.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/passthrough/rebase.rs)
- [storytold/gridcraft: crates/xlsx/src/passthrough/write.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/passthrough/write.rs)
- [storytold/gridcraft: crates/xlsx/src/read.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/read.rs)
- [storytold/gridcraft: crates/xlsx/src/tests/passthrough_tests.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/tests/passthrough_tests.rs)
- [storytold/gridcraft: crates/xlsx/src/write.rs @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/crates/xlsx/src/write.rs)
- [storytold/gridcraft: docs/brand/LICENSE-brand.txt @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/docs/brand/LICENSE-brand.txt)
- [storytold/gridcraft: docs/file-format-parity.md @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/docs/file-format-parity.md)
- [storytold/gridcraft: LICENSE-APACHE @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/LICENSE-APACHE)
- [storytold/gridcraft: LICENSE-MIT @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/LICENSE-MIT)
- [storytold/gridcraft: NOTICE @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/NOTICE)
- [storytold/gridcraft: README.md @ 11a5711ab11c](https://github.com/storytold/gridcraft/blob/11a5711ab11c4b94acce63faa07bb42c058c124f/README.md)
- [storytold/wordcraft: apps/wordcraft-cli/tests/it/strict.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/apps/wordcraft-cli/tests/it/strict.rs)
- [storytold/wordcraft: apps/wordcraft/src/main.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/apps/wordcraft/src/main.rs)
- [storytold/wordcraft: ATTRIBUTION.md @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/ATTRIBUTION.md)
- [storytold/wordcraft: Cargo.toml @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/Cargo.toml)
- [storytold/wordcraft: crates/docx/src/lib.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/crates/docx/src/lib.rs)
- [storytold/wordcraft: crates/docx/src/model_bridge.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/crates/docx/src/model_bridge.rs)
- [storytold/wordcraft: crates/docx/tests/it/passthrough.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/crates/docx/tests/it/passthrough.rs)
- [storytold/wordcraft: crates/engine/src/strict.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/crates/engine/src/strict.rs)
- [storytold/wordcraft: crates/engine/tests/strict_export.rs @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/crates/engine/tests/strict_export.rs)
- [storytold/wordcraft: docs/brand/LICENSE-brand.txt @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/docs/brand/LICENSE-brand.txt)
- [storytold/wordcraft: docs/file-format-parity.md @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/docs/file-format-parity.md)
- [storytold/wordcraft: docs/testing.md @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/docs/testing.md)
- [storytold/wordcraft: LICENSE-APACHE @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/LICENSE-APACHE)
- [storytold/wordcraft: LICENSE-MIT @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/LICENSE-MIT)
- [storytold/wordcraft: NOTICE @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/NOTICE)
- [storytold/wordcraft: README.md @ b8627a237339](https://github.com/storytold/wordcraft/blob/b8627a237339032135a4529b11edf6910f5be8c7/README.md)

Consultati anche metadati GitHub di commit e alberi ricorsivi per individuare questi file. I tentativi 404 e il rinvio obsoleto del README WordCraft sono descritti nello studio: non sono inventati risultati da file assenti. pdfcraft non studiato perché non necessario alle domande; nessun asset o corpus altrui acquisito.

## 3. Esiti reali di build e test

Tutti i comandi sotto sono stati eseguiti sul codice applicativo main e hanno restituito exit 0. Seguono gli output reali, senza sostituirli con un semplice “verde”; sono rimossi soltanto gli spazi a fine riga per il controllo Markdown, mentre i log locali originali restano invariati. Le righe FAIL del validatore sono i due controlli negativi intenzionali e l’eccezione storica autorizzata: il comando verifica proprio che falliscano. Nessuna eccezione per i 13 nuovi esportati.

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
✓ built in 1.21s
```

### npm test — exit 0

```text

> cosmoffice@0.2.2 test
> node --test tests/*.test.mjs

✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (77.4899ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (78.7034ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (131.909ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (194.7492ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (32.7361ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (37.7657ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (41.4172ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (38.8584ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.1389ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (0.622ms)
Rapporto con 50 eventi e ultima traccia: 4964 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (54.5693ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (6.5179ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (107.898ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (106.0844ms)
✔ unknown formulas retain their source without exporting a misleading cached number (18.3254ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.561ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (17.6442ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (10.767ms)
✔ landscape DOCX uses a physically wider page with matching orientation (9.5781ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.374ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (191.5207ms)
✔ references, arithmetic, precedence and percentages (4.9179ms)
✔ Italian aliases, absolute references, text and lazy IF (0.9365ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.7483ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.6946ms)
✔ Excel address limits and column naming (1.3718ms)
✔ conditional sums, lookups, text, dates and error handling (4.9511ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.7259ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.4347ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.7369ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.7543ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (5.0755ms)
✔ Il processo principale non contiene updater o caricamenti da server (9.4997ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (263.1744ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (45.307ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (13.9115ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (126.242ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (23.3028ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (132.0398ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (54.8979ms)
✔ damaged files and mismatched Office extensions are rejected before import (16.7214ms)
✔ unsupported parts produce specific warnings without changing the original file (47.0105ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (18.8443ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (16.2102ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (957.1914ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1963.1661ms)
ℹ tests 46
ℹ suites 0
ℹ pass 46
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3341.4529
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
15:37:07 [vite] (client) [console.warn] Warning: Indexing all PDF objects
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

Tempo trascorso 00:00:00.92
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
    "IPC aggiornamenti disabilitati anche con vecchie preferenze abilitate",
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

### Controlli documentali e licenze

node scripts/notices.mjs, exit 0:

```text
Attribuzioni e licenze raccolte.
```

Controlli Markdown: rimosse righe vuote aggiunte a fine file in VALIDATION e ARTCRAFT e spazi finali provenienti dagli output copiati. git diff --check e controllo staged ripetuti dopo le correzioni. Il controllo documentale ha restituito: PASS documentazione: collegamenti locali esistenti, 80 fonti ArtCraft uniche con commit completo, ULTIMO identico. I file da pubblicare sono esclusivamente Markdown; src/, electron/, scripts/, workflow, LICENSE e THIRD_PARTY_NOTICES invariati.

CI del codice applicativo di base e0fe801175043a540f8636cabc77cd890b71d1b9: [run 45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708). Interrogati di nuovo i lavori: checks, interop e desktop Linux/macOS/Windows tutti completed/success. Questa è la CI della base, non una falsa certificazione del commit di documentazione non ancora pubblicato al momento della scrittura.

## 4. Cosa funziona, provato

- Verificati i quattro documenti legali per WordCraft, GridCraft e launcher ai commit indicati, più craft-libs alle tre revisioni effettivamente rilevanti. Il codice proprio è MIT OR Apache-2.0; marchi, risorse con altre licenze e dipendenze copyleft restano esclusi.
- Le risposte sono collegate a file e commit immutabili. Lo studio separa test letti, dichiarazioni degli autori e prove nostre.
- CosmOffice: 46 unit test passati; sette script browser passati, compresi corpus di 5 DOCX, 5 XLSX, 3 PDF, ortografia, grafici e prova guidata.
- SDK: 13 nuovi esportati senza errori; controlli negativi respinti; copia XLSX storica byte-identica con errore MIME dichiarato.
- Offline-smoke: nessuna connessione Chromium TCP/UDP/QUIC/DNS; nessun tentativo spontaneo main; richiesta intenzionale bloccata.
- Desktop-smoke nel pacchetto Windows x64: aperture reali DOCX/XLSX/PDF, copia PDF identica, rotazione riaperta e controllo Poppler, errore di scrittura con originale preservato, impostazioni e nessun tentativo di rete.
- Esiti applicativi coerenti con il codice main precedente; nessuna funzione di ArtCraft aggiunta o dichiarata disponibile.

## 5. Cosa NON funziona o non hai potuto provare

**Non provato:** compilazione/esecuzione delle app ArtCraft e dei loro test Rust; installer ArtCraft; corpus reale Word/Excel con questi programmi; prestazioni e confronto visivo. Le stime di fedeltà degli autori non sono misurazioni nostre.

Non provate installazioni CosmOffice su computer puliti, hardware macOS/Linux, crash reali del sistema/Chromium, interruzioni di alimentazione o disco pieno reale. Desktop-smoke usa il pacchetto Windows già costruito: non è una nuova installazione da installer. Nessuna nuova release o guida Mac implementata in questo passo di studio.

Il futuro updater TLS Node non esiste ancora sul main: **nessuna prova di download, installazione o sua sicurezza è dichiarata superata**. Il prototipo Chromium conservato nello stash aveva fallito il controllo attivo per UDP verso [2001:4860:4860::8888]:443 fuori politica. Non è stato pubblicato o ripristinato.

Elenco esatto degli host ammessi nel main attuale: **nessuno per gli aggiornamenti, che restano disabilitati nel codice**. L’autorizzazione futura è limitata alle Release CosmoNetinfo/CosmOffice e ai relativi host di download esplicitamente ammessi; l’elenco operativo, compresi redirect/CDN, dovrà essere verificato e riportato prima dell’attivazione. Non sono autorizzati feed ArtCraft, mirror HTTP o servizi terzi. Nessuna nuova allowlist viene implementata con questa documentazione.

Limiti preesistenti di DOCX/XLSX complessi e blocchi di export restano presenti. WordCraft non conserva ogni XML sconosciuto; GridCraft può rigenerare/rinominare parti. Nessuno dei metodi studiati è stato provato come soluzione completa alla fedeltà di CosmOffice.

## 6. Bug e dubbi

- Nessun nuovo bug CosmOffice riprodotto da questa sola lettura e nessun bug di fedeltà chiuso.
- --strict controlla omissioni PDF/PNG, non garantisce un DOCX fedele a Word e non sostituisce Open XML SDK.
- Il confronto dei grafici nel controllo GridCraft letto può confrontare soltanto tipo/numero di serie: insufficiente per dimostrare identità dei dati.
- Il generico metodo Kept del modello condiviso non va attribuito al percorso DOCX studiato: discriminante di formato e ponte del modello non consentono quella conclusione.
- I log dei progetti studiati non garantiscono l’assenza di ogni nome/percorso/contenuto: i nostri messaggi a elenco chiuso restano obbligatori.
- Il launcher usa anche un feed esterno a GitHub e controlli di firma diversi dal nostro caso non firmato; il suo updater non è una soluzione pronta da importare.
- Il test HTTPS della libreria ammette ancora un canale loopback: non soddisfa da solo la politica più restrittiva autorizzata per CosmOffice.
- Avvisi reali rimasti: chunk Vite grande, indicizzazione PDF nel test di file difettoso e NU1900 per servizio di audit NuGet non raggiungibile. Non modificati codice o test per nasconderli.
- La vecchia copia XLSX conserva il difetto MIME come autorizzato. Non collaudata in Excel reale; possibile rifiuto o proposta di riparazione, non esclusi altri difetti.

## 7. Hash del commit

Base applicativa: e0fe801175043a540f8636cabc77cd890b71d1b9. Il solo commit di questo passo contiene docs/report/2026-11-22_1544_studio-artcraft.md; si identifica senza ambiguità con:

```sh
git log -1 --format=%H -- docs/report/2026-11-22_1544_studio-artcraft.md
```

Il proprio hash non può essere scritto nel medesimo commit senza cambiarlo; viene comunicato dopo il commit e il push. Nessun secondo commit artificiale soltanto per cambiare l’hash nel report.

## 8. Prossimo passo consigliato

Decisione dell’utente sui metodi, senza automatismi. Idee in ordine di valore, con fonti, difficoltà e rischi nello studio:

1. Inventario parti/relazioni prima e dopo l’export, per perdite silenziose.
2. Confronti indipendenti di dati/resa e font fissati nei test.
3. Scheda locale completa/incompleta/non verificata prima del salvataggio.
4. Conservazione selettiva con confini espliciti, distinta dalla modifica chirurgica byte-identica.
5. Stati dell’updater con hash e conferma, rispettando le otto condizioni già autorizzate.
6. Selezione esplicita dei pacchetti per piattaforma/versione.
7. Log resistenti ai guasti, mantenendo i messaggi chiusi e brevi.
8. Ripresa dei download, solo dopo verifiche di integrità.

Nessuna idea di OPPORTUNITA implementata e nessun motore scelto. Dopo questo studio resta possibile riprendere il compito aggiornamenti già autorizzato, con implementazione TLS Node originale, audit Node, NetLog senza connessioni Chromium e prove degli host vietati; non confondere l’autorizzazione con un risultato già raggiunto.
