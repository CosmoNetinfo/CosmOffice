# CosmOffice per Android — anteprima in collaudo

Prima implementazione nativa, versione 0.2.3 / versionCode 1, identificativo `it.cosmonet.cosmoffice`. Android 10 minimo, Android System WebView aggiornato. Nessun pacchetto iOS. Lo stato delle prove effettive è nel [report corrente](report/ULTIMO.md): un APK compilato e firmato non dimostra da solo che tutti gli editor funzionino sul telefono.

## File e privacy

Gli editor, il lessico italiano, worker/font/decoder PDF e licenze sono incorporati. Nessun account, telemetria o invio automatico; il manifest non richiede **alcun permesso**, nemmeno Internet. Il WebView intercetta l’origine riservata `https://appassets.androidplatform.net` e legge gli asset del pacchetto: non è un sito remoto. Richieste e navigazioni esterne sono bloccate. Backup automatico Android disabilitato.

«Apri un file» usa il selettore Android; «Esporta» crea una copia tramite il selettore. Non vengono richiesti accesso generale ai file o permessi di installazione. Il provider selezionato dall’utente potrebbe essere un servizio cloud: la sua rete appartiene al provider, non a CosmOffice; per lavorare completamente offline scegliere file locali. L’originale non viene riscritto. Bozze, impostazioni e parole personali restano nei dati locali dell’app; disinstallando si possono perdere. Esportare prima una copia.

Limite **10 MB per file** nel ponte di apertura e salvataggio, inclusa l’esportazione dei backup: il ponte usa copie Base64 in memoria. L’importazione di backup, preferenze e immagini usa invece il file input del WebView e mantiene i limiti desktop già presenti (backup 48 MB di contenuti); non è il percorso Base64. I limiti DOCX/XLSX/PDF della versione desktop restano validi. Niente stampa né conversione Word→PDF su Android; lettura/rotazione/salvataggio PDF restano previsti. Nessuna promessa di fedeltà Office aggiuntiva. Nessun aggiornamento automatico dell’APK: installare manualmente le future versioni ufficiali firmate con la stessa chiave.

## Compilare

Strumenti: Node 24, Java 17, Gradle 8.13, SDK Android con `platforms;android-36`, `build-tools;35.0.0` e platform-tools. Android Gradle Plugin 8.13.2. Le versioni seguono la [tabella ufficiale di compatibilità](https://developer.android.com/build/releases/agp-8-13-0-release-notes). Nessuna nuova libreria npm o libreria runtime Java.

```sh
npm ci
npm run android:prepare
gradle -p android --no-daemon :app:assembleDebug :app:assembleDebugAndroidTest :app:assembleRelease :app:lintDebug
node scripts/android-check-apk.mjs
```

`android:prepare` compila Vite e rigenera soltanto asset Android e icona dal nostro SVG. Campioni originali del corpus sono copiati nel solo APK di test. `ANDROID_HOME` indica l’SDK. Il controllo legge l’APK release reale, verifica zero permessi, versione, file legali identici, dizionario e componenti PDF. L’APK release è **unsigned** e non distribuibile prima della firma; il debug ha la chiave debug, inadatta agli aggiornamenti pubblici.

Il workflow [APK Android offline](../.github/workflows/android.yml) compila separatamente dalla suite desktop e prova l’emulatore API 35 x86_64. Gli artifact richiedono accesso a GitHub: non sono una Release pubblica Android. Nessun APK aggiunto alla Release desktop 0.2.3, nessun tag creato.

## Firma privata e checksum

L’utente ha autorizzato una nuova chiave: generata fuori dal repository e mai caricata nei Secrets o nei log. Il titolare deve conservarne una copia di sicurezza riservata insieme alla password: perderla impedirebbe di aggiornare la stessa app senza disinstallazione e perdita dei dati locali. Non inviare chiave o password nei commenti.

Impostare `COSMO_ANDROID_KEY_DIR` alla cartella privata (esterna al repository), `JAVA_HOME` e `ANDROID_HOME`, poi:

```sh
node scripts/android-sign.mjs
```

Lo script allinea con zipalign **prima** di firmare, usa apksigner, verifica il certificato atteso e crea un checksum SHA-256 accanto all’APK in `release/android/`. Password trasmessa al solo processo figlio tramite ambiente, non in argomenti o output. La verifica riprende i comandi documentati da [Android](https://developer.android.com/tools/apksigner); nessun codice esterno copiato.

Impronta pubblica SHA-256 del certificato: `32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e`. Non è la chiave privata. La CI non firma automaticamente: il caricamento di segreti non è stato autorizzato. Per futuri aggiornamenti incrementare versionCode e usare la stessa chiave, come richiede la [documentazione Android](https://developer.android.com/studio/publish/app-signing).

## Prove automatiche e limiti

`npm run test:browser` include una regressione Android con porta nativa simulata: verifica byte, Markdown, apertura DOCX, tema, ritorno alle bozze, aggiornamenti assenti e rapporto senza dati privati. **Non è il collaudo dell’APK.**

Con un emulatore già avviato, APK debug/test compilati, `adb` nel PATH e Poppler disponibile:

```sh
node scripts/android-smoke.mjs
```

Il test rifiuta i telefoni fisici, spegne la rete guest prima di installare, apre i veri selettori Android e controlla otto passaggi: Home/permessi, DOCX, XLSX, PDF, Markdown, Informazioni/tema, appunti del rapporto, richiesta esterna bloccata. Salva e riapre i file; sul computer controlla i file esportati con lettori indipendenti e SHA-256 degli originali. Screenshot e log in `test-results/android/`. Le modifiche nell’editor sono guidate via DOM: non provano tastiera virtuale o gesti tattili. Nessun dato personale nei campioni.

Non provati finché dichiarato nel report: installazione e aggiornamento su telefono/tablet fisico, tastiera/gesti, Android 10/16, provider cloud, rotazioni dello schermo, risorse limitate e arresti forzati. Consultare sempre gli esiti reali della run, non dedurre successo dalla presenza del workflow.
