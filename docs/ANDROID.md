# CosmOffice per Android — anteprima in collaudo

Prima implementazione nativa, versione 0.2.3 / versionCode 3, identificativo `it.cosmonet.cosmoffice`. Android 10 minimo, Android System WebView aggiornato. Nessun pacchetto iOS. Lo stato delle prove effettive è nel [report corrente](report/ULTIMO.md): un APK compilato e firmato non dimostra da solo che tutti gli editor funzionino sul telefono.

## File e privacy

Gli editor, il lessico italiano, worker/font/decoder PDF e licenze sono incorporati. Nessun account, telemetria o invio automatico; i soli permessi sono **Internet** e **richiesta di installazione**, usati dal trasporto nativo degli aggiornamenti. Il WebView intercetta l’origine riservata `https://appassets.androidplatform.net` e legge gli asset del pacchetto: non è un sito remoto. Richieste e navigazioni esterne sono bloccate. Backup automatico Android disabilitato.

«Apri un file» usa il selettore Android; «Esporta» crea una copia tramite il selettore. Non viene richiesto accesso generale ai file. L’autorizzazione a installare da CosmOffice viene richiesta solo dopo conferma dell’aggiornamento. Il provider selezionato dall’utente potrebbe essere un servizio cloud: la sua rete appartiene al provider, non a CosmOffice; per lavorare completamente offline scegliere file locali. L’originale non viene riscritto. Bozze, impostazioni e parole personali restano nei dati locali dell’app; disinstallando si possono perdere. Esportare prima una copia.

Limite **10 MB per file** nel ponte di apertura e salvataggio, inclusa l’esportazione dei backup: il ponte usa copie Base64 in memoria. L’importazione di backup, preferenze e immagini usa invece il file input del WebView e mantiene i limiti desktop già presenti (backup 48 MB di contenuti); non è il percorso Base64. I limiti DOCX/XLSX/PDF della versione desktop restano validi. Niente stampa né conversione Word→PDF su Android; lettura/rotazione/salvataggio PDF restano previsti. Nessuna promessa di fedeltà Office aggiuntiva. Aggiornamenti nativi disponibili dalla build 3, spenti di default: vedere la sezione seguente.

## Compilare

Strumenti: Node 24, Java 17, Gradle 8.13, SDK Android con `platforms;android-36`, `build-tools;35.0.0` e platform-tools. Android Gradle Plugin 8.13.2. Le versioni seguono la [tabella ufficiale di compatibilità](https://developer.android.com/build/releases/agp-8-13-0-release-notes). Nessuna nuova libreria npm o libreria runtime Java.

```sh
npm ci
npm run android:prepare
gradle -p android --no-daemon :app:assembleDebug :app:assembleDebugAndroidTest :app:assembleRelease :app:lintDebug
node scripts/android-check-apk.mjs
```

`android:prepare` compila Vite e rigenera soltanto asset Android e icona dal nostro SVG. Campioni originali del corpus sono copiati nel solo APK di test. `ANDROID_HOME` indica l’SDK. Il controllo legge l’APK release reale, verifica i soli due permessi autorizzati, versione, file legali identici, dizionario e componenti PDF. L’APK release è **unsigned** e non distribuibile prima della firma; il debug ha la chiave debug, inadatta agli aggiornamenti pubblici.

Il workflow [APK Android offline](../.github/workflows/android.yml) compila separatamente dalla suite desktop e prova l’emulatore API 35 x86_64. Gli artifact richiedono accesso a GitHub: non sono il download pubblico. La pubblicazione firmata avviene separatamente, solo dopo CI verde e confronto con l’unsigned CI; esito e link nel report. Nessun APK aggiunto alla Release desktop 0.2.3.

## Firma privata e checksum

L’utente ha autorizzato una nuova chiave: generata fuori dal repository e mai caricata nei Secrets o nei log. Il titolare deve conservarne una copia di sicurezza riservata insieme alla password: perderla impedirebbe di aggiornare la stessa app senza disinstallazione e perdita dei dati locali. Non inviare chiave o password nei commenti.

Impostare `COSMO_ANDROID_KEY_DIR` alla cartella privata (esterna al repository), `JAVA_HOME` e `ANDROID_HOME`, poi:

```sh
node scripts/android-sign.mjs
```

Lo script allinea con zipalign **prima** di firmare, usa apksigner, verifica il certificato atteso e crea un checksum SHA-256 accanto all’APK in `release/android/`. Password trasmessa al solo processo figlio tramite ambiente, non in argomenti o output. La verifica riprende i comandi documentati da [Android](https://developer.android.com/tools/apksigner); nessun codice esterno copiato.

Impronta pubblica SHA-256 del certificato: `32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e`. Non è la chiave privata. La CI non firma automaticamente: il caricamento di segreti non è stato autorizzato. Per futuri aggiornamenti incrementare versionCode e usare la stessa chiave, come richiede la [documentazione Android](https://developer.android.com/studio/publish/app-signing).

## Prove automatiche e limiti

### Correzione build 2: PDF sul telefono del titolare

Il titolare ha trovato un errore reale nel primo APK: `Promise.withResolvers is not a function`. Il WebView del suo telefono non ha questa API; la versione precisa non è nota. Il precedente emulatore WebView 124 la possiede, quindi il risultato verde non certificava questa variante.

Android versionCode passa a **2**, sempre versione 0.2.3, package e chiave identici. Supporto Promise originale incorporato prima dei moduli e nel worker; nessuna libreria nuova, motore o schema delle bozze cambiato. Tre PDF di esempio passano la regressione con API rimossa anche dal worker reale; il vecchio APK fallisce con lo stesso messaggio dello screenshot. Il nuovo pacchetto va installato come aggiornamento dell’app esistente. La conservazione dei dati durante l’aggiornamento e l’apertura sul telefono devono ancora essere provate: non dedurle dalla sola firma uguale. Nessuna disinstallazione richiesta per questa prova.

### Storico: primo APK, esito del 28 novembre 2026

Commit 7705967, [CI Android 46110959197](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959197) completed/success. Tutti otto i casi passati nell’emulatore API 35/WebView 124: Home/permessi, DOCX e XLSX modificati/salvati/riaperti, PDF renderizzato/ruotato/salvato/riaperto, Markdown creato/salvato/riaperto con ritorno nativo alla Home, Informazioni/licenza/tema scuro, copia del rapporto negli appunti Android, richiesta esterna bloccata. Originali byte-identici; quattro export letti sul computer. DOCX/XLSX esportati validi anche per Open XML SDK; PDF verificato con Poppler e confronto visivo, Markdown con byte esatti.

Test nativi eseguiti sul debug. Il release unsigned della CI è byte-identico all’archivio usato dalla firma locale; tutti 240 i file del suo payload sono identici nel release firmato, con sole aggiunte dei file di firma. APK firmato: 8.761.580 byte, SHA-256 `c40f3cf514cdab01be0f443d1dc9df2d80330e187401b96c03d3f0e630e58084`. Chiave e password non caricate in GitHub, nessuna Release/tag Android creati. L’artifact CI unsigned richiede la firma prima dell’installazione; non presentarlo come installer pronto.

Le sette catture sono state prodotte, ma alcune mostrano un frame precedente (Informazioni ancora in lettura, rapporto non ancora disegnato), nonostante i controlli DOM e gli appunti reali passino. Non vengono usate nel README come anteprime definitive e non certificano tutta la resa visiva. Da verificare sul dispositivo fisico, insieme a tastiera software/gesti, prestazioni, provider cloud e aggiornamento in luogo. Una sola esecuzione completa verde non dimostra stabilità su tutti i modelli/versioni Android.

L’APK usa la distribuzione `legacy` della stessa versione PDF.js 6.5.438, con API e worker incorporati. WebView 124 nell’emulatore non dispone di `URL.parse`, richiesto dalla distribuzione moderna: errore confermato nella CI 46059522929. Non è un cambio di motore; il desktop mantiene la distribuzione corrente. Il componente core-js 3.51.0 incluso nel legacy ha licenza MIT, riportata integralmente nelle attribuzioni. Nessun nuovo pacchetto npm e nessun download nell’app. Il round trip sul campione PDF 01 è passato nella CI 46110959197, senza estendere il risultato a tutti i PDF reali.

`npm run test:browser` include una regressione Android con porta nativa simulata: verifica byte, Markdown, apertura DOCX, tema, ritorno alle bozze, impostazioni aggiornamenti e rapporto senza dati privati. **Non è il collaudo dell’APK.**

Con un emulatore già avviato, APK debug/test compilati, `adb` nel PATH e Poppler disponibile:

```sh
node scripts/android-smoke.mjs
```

Il test rifiuta i telefoni fisici, spegne la rete guest prima di installare, apre i veri selettori Android e controlla nove passaggi: Home/permessi, DOCX, XLSX, PDF, Markdown, Informazioni/tema, appunti del rapporto, richiesta esterna bloccata e aggiornamenti (peer simulato). Salva e riapre i file; sul computer controlla gli export con lettori indipendenti e SHA-256 degli originali. Poi prova il vero installatore e riapre le bozze; soltanto nell’ultima fase abilita il Wi-Fi per il probe GitHub. Screenshot e log in `test-results/android/`. Word è modificato via DOM; celle e Markdown usano focus DOM, tasti Android verificati e normale blur. I comandi dell’app sono guidati via DOM, mentre selettori e appunti sono reali. Non provano tastiera virtuale o gesti tattili. Nessun dato personale nei campioni.

Non provati finché dichiarato nel report: installazione e aggiornamento su telefono/tablet fisico, tastiera/gesti, Android 10/16, provider cloud, rotazioni dello schermo, risorse limitate e arresti forzati. Consultare sempre gli esiti reali della run, non dedurre successo dalla presenza del workflow.

## Build 3: aggiornamenti autorizzati

Il WebView e i service worker restano bloccati. Il solo AndroidUpdater nativo usa HTTPS con verifica di certificato/hostname e TLS 1.2/1.3, senza fallback in chiaro. Nessun account, cookie impostato dall’app, contenuto documentale o identificativo personale nelle richieste. Intestazioni fisse minime. Audit in memoria limitato a tipo evento e host.

Host esatti: github.com (elenco e download delle sole Release CosmoNetinfo/CosmOffice), release-assets.githubusercontent.com (solo redirect di un download autorizzato, percorso repository GitHub 1466711071). Ogni redirect è verificato prima della connessione. Nessuna richiesta ad api.github.com nell’app; l’API e uploads.github.com servono esclusivamente allo script di pubblicazione del titolare.

Nuovo profilo: controlli automatici spenti e nessuna richiesta all’avvio. Le vecchie preferenze del renderer non costituiscono consenso: l’opzione Android è nativa e separata. Il pulsante esegue una sola ricerca e spegne il trasporto al termine. L’opzione esplicita abilita un timer di sei ore solo in primo piano: nessun controllo immediato all’avvio o all’attivazione, nessuna attività in background. Disattivazione e annullamento interrompono anche la richiesta in corso.

Prima dell’installazione: SHA-256 e dimensione, package it.cosmonet.cosmoffice, codice superiore e medesimo certificato dell’app installata. La conferma nativa segue il salvataggio delle bozze; PackageInstaller richiede anche il consenso Android. Nessuna installazione silenziosa. Da build 1/2 installare a mano la build 3 una volta, senza disinstallare.

La CI costruisce un APK debug di prova con codice 4 (non pubblico), quindi la normale build 3. Il test installa il 4 tramite il vero installatore, verifica quattro bozze e tema e prova la rete reale GitHub con contatori UID a zero all’avvio. Il peer dei test hash/certificato è simulato; l’installazione, i file e le verifiche di firma sono reali. Risultati osservati nel report: non sostituiscono il telefono fisico con firma di distribuzione.

Pubblicazione del titolare: scripts/android-publish-local.mjs richiede main pulito, entrambe le CI verdi del medesimo commit, APK locale firmato e prova di uguaglianza con l’unsigned CI. Crea la Release ordinaria android-v0.2.3-3 con make_latest=false, manifesto e checksum, poi riscarica gli asset senza credenziali. Chiave e password non vanno su GitHub. /releases/latest desktop non cambia.
