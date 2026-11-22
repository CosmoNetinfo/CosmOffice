# Aggiornamenti dal ramo main

Questa implementazione segue l’autorizzazione esplicita dell’utente. **Non è dentro i pacchetti pubblici 0.2.2**, che rimangono immutati. Per usarla servirà installare manualmente una successiva versione che la includa; nessuna nuova Release viene creata da questo passo.

## Quando si connette

Il controllo è attivo di default nelle nuove installazioni del main; si spegne in Impostazioni → Aggiornamenti. La scelta è salvata localmente. Spento: nessuna richiesta né worker avviato per un controllo. Acceso: controllo all’avvio e ogni sei ore; il pulsante Controlla ora ripete il controllo. Disattivare interrompe il lavoro pendente e revoca il consenso precedente.

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

Windows NSIS: il pulsante Installa e chiudi apre una conferma con Annulla predefinito; dopo consenso e bozze salvate avvia l’installer interattivo, senza /S e senza shell. La chiusura normale dell’app non installa nulla. In sviluppo, versione portatile o directory non riconosciuta viene offerta la pagina di download.

Linux AppImage: riconosce l’eseguibile CosmOffice dentro la sua APPDIR, per evitare di sostituire l’AppImage di un programma padre che abbia lasciato APPIMAGE nell’ambiente. Dopo conferma prepara una copia sorella, ne controlla hash e formato AppImage, conserva i permessi e la rinomina sul file originale. Se non riconosce il proprio pacchetto, offre il download manuale.

Mac: controlla soltanto la versione e mostra l’avviso. Apre il download solo su richiesta, senza scaricare o installare il DMG da solo. Guida in [MAC.md](MAC.md).

Rete assente/errore: “Aggiornamento non disponibile. Puoi continuare a lavorare.” Nessun documento viene chiuso per un errore di rete. Una bozza non salvata impedisce il percorso di installazione.

## Prove e limiti

- npm test: URL/redirect vietati prima del contatto, certificato richiesto, niente fallback HTTP, header minimi, byte/hash, limiti, parziali, revoca e consenso per versione.
- node scripts/offline-smoke.mjs: controllo spento, documenti aperti, audit Node vuoto, NetLog Chromium senza connessioni.
- node scripts/update-network-smoke.mjs e --package: controllo e download reali, SHA-256, audit Node limitato ai due host, dominio estraneo bloccato, dopo spegnimento nessuna nuova richiesta; Chromium senza TCP/UDP/QUIC/DNS o richieste HTTP.
- node scripts/update-confirm-smoke.mjs: pacchetto Windows reale, riconoscimento installazione/versione simulati; Annulla e chiusura normale non installano, consenso esplicito richiesto. Lo spawn è sostituito da uno spy: nessun installer viene realmente eseguito.

Installazione su computer puliti, UAC e completamento effettivo dell’installer, sostituzione di una vera AppImage mentre è in uso, hardware Mac e arresti improvvisi non sono certificati da questi test. Gli esiti effettivi, comprese prove fallite e ripetute, sono nel report. Fonti API consultate senza copia di codice: [worker_threads](https://nodejs.org/api/worker_threads.html) e [HTTPS](https://nodejs.org/api/https.html).
