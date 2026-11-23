# Rigenerare le schermate del README

Le immagini in docs/images sono catture della vera interfaccia React servita da Vite in un browser temporaneo. Non sono mockup e non sono catture di un’installazione desktop. Didascalie correnti: “anteprima di sviluppo, versione 0.2.3”.

## Comandi

Con Node.js 24 e Chrome installato:

```sh
npm ci
npm run build
node scripts/screenshots.mjs
```

Su CI/Linux, dopo aver installato Chromium di Playwright:

```sh
npx playwright install --with-deps chromium
COSMO_BROWSER=chromium node scripts/screenshots.mjs
```

In PowerShell la variabile si imposta con `$env:COSMO_BROWSER='chromium'`. Lo script usa la versione di package.json nel suo esito. Alla prossima versione aggiornare anche le didascalie del README dopo aver rigenerato e controllato le immagini.

## Cosa viene fotografato

| PNG | Contenuto |
| --- | --- |
| home.png | Home con tre documenti originali nell’archivio del profilo temporaneo |
| write.png | DOCX originale sulla biblioteca: testo, tabella e paesaggio geometrico generato dallo script |
| grid.png | XLSX originale con formule SOMMA, dati di esempio e grafico a barre nativo |
| view.png | PDF originale Una biblioteca per tutti |
| impostazioni-chiaro.png | Impostazioni del tema chiaro |
| impostazioni-scuro.png | Le stesse impostazioni nel tema scuro |
| aggiornamenti.png | Pulsante su richiesta, rete spenta al termine e periodici facoltativi; comando desktop non attivo nell’anteprima browser |
| informazioni.png | Versione, titolare e licenza A letta dal file locale |
| prova-guidata.png | Otto prove; esiti lasciati a Non provato, senza fingere un collaudo manuale |
| segnala-problema.png | Rapporto browser con un solo errore tecnico simulato, senza messaggio libero |
| layout-stretto.png | Home a larghezza 390 px; non equivale a un’app per telefono installabile |

## Privacy e verifiche

Lo script crea un nuovo contesto browser e documenti scritti appositamente nel sorgente: non legge file personali o documenti dell’archivio reale. I tre esempi vengono salvati solo in test-results/screenshots, ignorata da Git. Per gli screenshot non vengono usati desktop, finestre di sistema o schermate di altri programmi.

Prima di ogni cattura controlla testo visibile e campi: nessuna lettera di unità, percorso personale o nome utente del sistema. Questi valori servono soltanto al confronto e non vengono inseriti nelle immagini o nel report JSON. Le risorse HTTP esterne al server locale vengono bloccate e fanno fallire la verifica. Il rapporto di esempio usa il vero filtro a elenco chiuso dell’app.

Le PNG sono ottimizzate con Sharp, massimo 1600 px di larghezza e limite automatico 600 KB ciascuna. Non vengono aggiunti metadati EXIF/XMP/ICC. I log e il riepilogo di dimensioni/esiti sono in test-results/screenshots.log e test-results/screenshots/esiti.json, non nel README. Dopo la generazione esaminare tutte le immagini e verificare le risorse relative dalla pagina GitHub.

Il processo non modifica src/ o electron/, non cambia stili dell’interfaccia e non nasconde avvisi di compatibilità. L’illustrazione è originale, gli unici loghi visibili sono quelli già presenti di CosmOffice; nessun marchio di altre suite. Un controllo del testo non è OCR né una certificazione automatica di qualsiasi futura immagine: la revisione visiva resta necessaria.
