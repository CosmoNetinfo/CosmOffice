# Aggiornamenti su richiesta — 0.2.3

Implementazione inclusa nella 0.2.3, pubblicazione autorizzata dal titolare il 25 novembre 2026. **Non è nei pacchetti pubblici 0.2.2**, che restano immutati: quel primo passaggio è manuale. Anche chi ha già una build di prova chiamata 0.2.3 deve installare manualmente questa Release. Il confronto ammette soltanto numeri superiori; gli artefatti Actions e i nuovi commit non sono un feed di aggiornamento. Release 0.2.3 pubblica con Windows, Linux e due DMG, manifesto e sidecar SHA-256. Esiti dell’audit pubblico e limiti nel report corrente.

## Quando si connette

Scelta del titolare del 23 novembre 2026: controlli spenti di default. Profilo nuovo, preferenza mancante o vecchio formato «attivo»: nessuna richiesta Node e nessuna connessione Chromium all’avvio. La preferenza nativa usa policy 2; il vecchio booleano non viene ereditato come consenso. Anche la vecchia preferenza dell’interfaccia viene migrata a spento.

L’importazione delle impostazioni JSON conserva la scelta corrente sui periodici: non eredita un vecchio «attivo». Il messaggio lo spiega; per cambiare il consenso si usa l’interruttore nel pannello Aggiornamenti. Verificato nel browser e previsto anche nel test nativo del pacchetto.

In Impostazioni → Aggiornamenti, «Controlla aggiornamenti ora» avvia una sola operazione. Clic duplicati mentre è pendente vengono accorpati. Il trasporto viene aperto per il controllo e l’eventuale download, poi chiuso automaticamente, anche su errore. «Annulla controllo» interrompe il lavoro, rimuove il temporaneo e ignora risposte tardive. Nessun controllo manuale abilita i periodici.

L’interruttore periodico è mantenuto perché ha una funzione effettiva distinta: dopo scelta esplicita controlla ogni sei ore; mai all’avvio, neppure con consenso già salvato nel nuovo formato. Spento di default. Anche ogni operazione periodica chiude il trasporto al termine. Il testo vicino al pulsante indica se sono stati attivati periodici; altrimenti dice che l’app contatta GitHub solo alla pressione. Non è stata decisa una rimozione dell’interruttore.

L’app legge l’elenco SHA256SUMS.txt della Release ordinaria latest, confronta la versione in locale e sceglie il pacchetto. Non invia la versione installata, diagnosi, preferenze, nomi, percorsi, documenti o identificativi. Le richieste sono GET senza corpo, cookie, autenticazione o referrer. Intestazioni applicative: User-Agent: CosmOffice e Accept-Encoding: identity; Host e gestione della connessione sono HTTP standard. Il nome del file richiesto identifica il pacchetto pubblico della piattaforma scelta.

## Elenco chiuso delle destinazioni

| Host | Percorsi ammessi |
| --- | --- |
| github.com | Solo /CosmoNetinfo/CosmOffice/releases/latest/download/SHA256SUMS.txt e /CosmoNetinfo/CosmOffice/releases/download/vVERSIONE/NOME, con versione e nome verificati |
| release-assets.githubusercontent.com | Solo redirect dalla Release autorizzata, sotto /github-production-release-asset/1466711071/UUID; parametri firmati forniti da GitHub |

Nessun api.github.com nel trasporto dell’app; nessun feed ArtCraft, mirror, HTTP o altro host. Il CDN non è una destinazione iniziale ammessa. Ogni redirect viene ricontrollato prima di seguirlo, con massimo quattro passaggi. Una modifica del servizio che non rispetta questi vincoli produce un errore, non un allargamento automatico della lista. Query di accesso temporanee del CDN non sono salvate nell’audit o nel rapporto del tester.

## Trasporto e integrità

HTTPS Node con verifica del certificato obbligatoria e TLS almeno 1.2, in un worker isolato che non eredita variabili d’ambiente o opzioni Node del chiamante. Non usa sessioni o rete Chromium. Tutte le API generali di rete del main e del renderer restano bloccate. SHA256SUMS massimo 16 KB, pacchetto massimo 1 GB; timeout e annullamento impediscono un’attesa infinita.

Un file temporaneo esclusivo viene scaricato e confrontato con SHA-256. Un file già presente non viene troncato dal trasporto. Il pacchetto pronto è ricontrollato prima di avviare l’installer; alterarlo impedisce l’installazione. La cancellazione del controllo durante questa verifica revoca il consenso. Si verifica l’integrità rispetto alla fonte GitHub HTTPS: questo non è una firma del software o una certificazione indipendente dell’editore.

## Installazione dopo conferma

Windows NSIS: il pulsante Installa e chiudi apre una conferma con Annulla predefinito; dopo consenso e bozze salvate avvia l’installer interattivo, senza /S e senza shell. Il consenso all’installazione è separato dal permesso temporaneo di rete: la copia verificata resta installabile anche dopo lo spegnimento del trasporto. La chiusura normale dell’app non installa nulla. In sviluppo, versione portatile o directory non riconosciuta viene offerta la pagina di download. Solo il lavoro CI richiesto installa e disinstalla NSIS con /S nel runner; tale modalità non viene usata dall’updater dell’app.

Linux AppImage: riconosce l’eseguibile CosmOffice dentro la sua APPDIR, per evitare di sostituire l’AppImage di un programma padre che abbia lasciato APPIMAGE nell’ambiente. Dopo conferma prepara una copia sorella, ne controlla hash e formato AppImage, conserva i permessi e la rinomina sul file originale. Se non riconosce il proprio pacchetto, offre il download manuale.

Mac: controlla soltanto la versione e mostra l’avviso. Apre il download solo su richiesta, senza scaricare o installare il DMG da solo. Guida in [MAC.md](MAC.md).

Rete assente/errore: “Aggiornamento non disponibile. Puoi continuare a lavorare.” Nessun documento viene chiuso per un errore di rete. Una bozza non salvata impedisce il percorso di installazione.

## Prove e limiti

- Chi ha la 0.2.2 aggiorna manualmente una volta alla 0.2.3; poi usa il pulsante per le versioni superiori pubblicate. La 0.2.2 resta immutata.
- Informazioni legge LICENSE e THIRD_PARTY_NOTICES.txt da process.resourcesPath nel pacchetto (IPC con soli due nomi ammessi), dalla radice del repository in sviluppo. Nessun URL esterno. L’anteprima browser usa copie locali generate da scripts/legal-assets.mjs.
- npm test: URL/redirect vietati prima del contatto, certificato richiesto, niente fallback HTTP, header minimi, byte/hash, limiti, parziali, revoca e consenso per versione.
- node scripts/offline-smoke.mjs: controllo spento, documenti aperti, audit Node vuoto, NetLog Chromium senza connessioni.
- node scripts/update-network-smoke.mjs e --package: due profili nuovi, uno con vecchio «attivo»; avvio senza richieste, clic manuale, spegnimento automatico, annullamento IPC e dominio estraneo bloccato. Audit Node limitato ai due host; Chromium senza connessioni. Il controllo normale non retrocede e non reinstalla la stessa versione. Il download separato usa il manifesto e i byte della Release latest effettiva, verifica SHA-256 e non installa nulla.
- scripts/package-resources-check.mjs legge gli installer realmente costruiti (Windows NSIS, AppImage, due DMG), confronta LICENSE e attribuzioni con i sorgenti di quella build e verifica la licenza anche nell’ASAR. scripts/legal-smoke.mjs verifica la schermata nativa e il rifiuto di percorsi arbitrari.
- Il nuovo lavoro windows-installed installa NSIS /S soltanto nel runner Windows, avvia l’eseguibile installato con finestra visibile, apre esempi reali e disinstalla davvero. Solo il ritorno del selettore file è automatizzato, non i motori. Script protetto contro esecuzione fuori dal runner. Già riuscito per 1472135 nella run 45600226920: installazione/disinstallazione exit 0, Home e tre documenti reali; non simula un PC fisico.
- node scripts/update-confirm-smoke.mjs: pacchetto Windows reale, riconoscimento installazione/versione simulati; Annulla e chiusura normale non installano, consenso esplicito richiesto. Lo spawn è sostituito da uno spy: nessun installer viene realmente eseguito.

Installazione su computer puliti, UAC e completamento effettivo dell’installer, sostituzione di una vera AppImage mentre è in uso, hardware Mac e arresti improvvisi non sono certificati da questi test. Gli esiti effettivi, comprese prove fallite e ripetute, sono nel report. Fonti API consultate senza copia di codice: [worker_threads](https://nodejs.org/api/worker_threads.html) e [HTTPS](https://nodejs.org/api/https.html).

## Android build 3 — 28 novembre 2026

Trasporto nativo Java separato da quello Node desktop: github.com e release-assets.githubusercontent.com soltanto, Release del repository CosmoNetinfo/CosmOffice e redirect limitati al suo percorso asset. TLS 1.2/1.3 con certificato e hostname verificati; nessun dato personale nelle richieste. Default spento, singolo controllo manuale; timer opzionale ogni sei ore solo in primo piano, nessun controllo immediato all’avvio. Il WebView non naviga in rete. Disattivare interrompe il controllo. SHA-256, package, versione e stessa firma prima di conferma app + installatore Android. Da build 1/2 serve un aggiornamento manuale una volta. Pubblicazione Android separata con make_latest=false; desktop invariato. Prove effettive e limiti nel report corrente.
