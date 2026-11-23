# Decisioni e alternative tecniche

## 0.2.3 su richiesta — scelta del titolare del 23 novembre 2026

Aggiornamenti spenti di default e nessuna richiesta all’avvio: né Node né Chromium, anche con periodici già autorizzati. Vecchi «attivo» senza policy 2 non ereditati. Il pulsante «Controlla aggiornamenti ora» apre una sola operazione; clic duplicati accorpati, trasporto chiuso al termine/errore/annullamento. Il consenso all’installazione rimane distinto dal permesso temporaneo di rete, con SHA-256 e conferma esplicita.

Anche l’importazione JSON conserva il consenso corrente invece di applicare un vecchio «attivo»; il messaggio rimanda all’interruttore esplicito. Evita di attivare rete periodica come effetto secondario dell’importazione di altre regolazioni.

Interruttore periodico conservato perché ha funzione effettiva, opt-in ogni sei ore; non è stato rimosso senza decisione. Nessun controllo immediato alla sua attivazione o all’avvio. Testo vicino al pulsante esplicito quando l’utente lo attiva. HTTPS, certificati, repository e due host rimangono invariati.

Informazioni legge i testi locali via IPC a elenco chiuso. LICENSE e THIRD_PARTY_NOTICES.txt esterni nelle risorse; piccola copia della licenza anche nell’ASAR per il riferimento package.json. Le copie per il browser sono generate localmente e non aggiungono rete all’app. Il filtro di extraResources esclude i corrispondenti sorgenti dall’ASAR: la copia esterna LICENSE deriva da public/legal/LICENSE, mentre l’ASAR include l’originale. Due ispezioni iniziali hanno rilevato la copia ASAR mancante; la verifica non viene rimossa. Licenza A e motori documentali invariati; aggiornato solo il numero di versione visualizzato nel rapporto browser.

Su aggiunta esplicita, un lavoro CI Windows separato installa davvero NSIS in modalità non interattiva esclusivamente nel runner, controlla app installata, finestra/Home, tre file, licenze e disinstalla. Non cambia la modalità interattiva dell’updater. Selezione file automatizzata, lettura e rendering reali; nessuna falsa prova del dialogo OS. Non sostituisce PC fisico, SmartScreen, UAC con antivirus o utente normale. Il test non è avviato localmente con l’ambiente CI contraffatto.

Versione main 0.2.3 in preparazione. Nessun tag o Release: decide il titolare dopo prova su PC Windows pulito. La 0.2.2 pubblica non cambia; chi la usa aggiornerà manualmente una volta, poi userà il pulsante. Nessuna nuova dipendenza, nessuna scelta del motore.

## Dati del titolare forniti dall’utente — 22 novembre 2026

Daniele Spalletti, recapito danielespalletti@cosmonet.info: inseriti nei testi correnti al posto del segnaposto della licenza A, su indicazione esplicita dell’utente. Non aggiunti indirizzi o ragioni sociali. Condizioni A invariate, B non adottata; revisione professionale ancora necessaria. Non modificati i report storici, app, metadati di packaging, preferenza aggiornamenti, versioni o Release.

## Adozione esplicita della licenza A — 22 novembre 2026

Su istruzione del titolare viene adottata A in [LICENSE](../LICENSE), partendo dalla sezione A di [LICENZA-BOZZE.md](LICENZA-BOZZE.md). Uso gratuito anche professionale, codice originale e grafica riservati, nessuna redistribuzione degli installer, link alle Release ufficiali condivisibile. B non adottata, conservata come alternativa storica. Non si scelgono MIT, Apache-2.0 o un motore documentale.

Titolare e recapito: Daniele Spalletti (danielespalletti@cosmonet.info). Revisione professionale del testo definitivo ancora necessaria; questa stesura non è consulenza legale. Nessun dato anagrafico o legge applicabile inventati. Gli aggiornamenti sono descritti come disattivabili senza stabilirne qui lo stato iniziale; la preferenza predefinita non cambia ed è ancora da decidere.

Non modificati src/, electron/, configurazione di packaging, schermate di accettazione, pagina NSIS, versione, tag o Release. L’audit dei quattro installer 0.2.2 rileva package.json senza campo license, copyright/author storici “Cosmonet” e assenza della licenza propria nel payload; presenti avvisi di terzi e licenza separata del lessico. La 0.2.2 pubblicata conserva l’assetto precedente: nessun aggiornamento retroattivo. Eventuale inclusione del nuovo testo nei futuri pacchetti è da concordare, non una correzione silenziosa.

## Bozze di licenza utenti, nessuna adozione

Nota storica: il paragrafo seguente descrive il precedente passo delle sole bozze; la successiva scelta A è registrata sopra.

Il 22 novembre 2026 sono state preparate le due alternative richieste in [LICENZA-BOZZE.md](LICENZA-BOZZE.md): A, uso gratuito con codice e marchio riservati; B, codice aperto con MIT oppure Apache-2.0 da selezionare. La scelta resta del titolare, incluse titolarità, ambito dei file e redistribuzione degli installer. Non sono modificati LICENSE, pacchetti, schermate di accettazione o licenze di terzi. È stata esclusa l’adozione automatica di una bozza: la sola pubblicazione di questo confronto non concede diritti. Nessuna decisione sul motore.

## Implementazione del trasporto TLS Node

Si recupera il prototipo conservato nello stash, sostituendo integralmente il broker Chromium che aveva NetLog rosso. Un worker Node isolato usa HTTPS con certificato verificato; il main conserva tutti i blocchi generali e Chromium conserva MAP * ~NOTFOUND, senza eccezioni per le sessioni. Il worker non eredita ambiente o execArgv e invia solo GET con intestazioni statiche minime. Nessuna nuova libreria o codice altrui copiato. Fonti API: https://nodejs.org/api/worker_threads.html e https://nodejs.org/api/https.html.

Host ammessi: github.com e release-assets.githubusercontent.com, quest’ultimo soltanto per redirect delle Release e percorso del repository 1466711071. Nessun api.github.com nell’app. Ogni redirect verificato prima del contatto. Audit Node separato dal NetLog Chromium, che deve restare privo di connessioni anche con controllo attivo.

Interruttore locale di spegnimento aggiunto, default attivo nelle nuove installazioni del main. Le API generali del main e del renderer restano bloccate. SHA-256 al download e prima dell’applicazione; conferma per versione e revoca ricontrollate dopo l’hash. Nessuna installazione per chiusura normale; Windows interattivo, AppImage confinata alla propria APPDIR, Mac solo notifica. Non si aggiorna un’AppImage ereditata da un altro programma. Conservata la scelta dell’utente di poter togliere l’interruttore in futuro.

Questa funzione è per una versione successiva: gli installer 0.2.2 e il loro tag non vengono sostituiti. I test di installazione usano uno spy e campioni AppImage; installazioni effettive su sistemi puliti restano non provate. Le otto condizioni dell’autorizzazione precedente restano vincolanti. Nessun nuovo motore o idea dello studio adottati.

## DMG Mac senza firma e completamento della Release

Il percorso anteprima imposta esplicitamente identity:null, hardenedRuntime:false e notarize:false; non usa certificati, firma ad hoc aggiunta o notarizzazione. Restano possibili caratteristiche dei binari upstream Electron, distinte dalla firma dell’app CosmOffice. I due lavori Mac separati verificano DMG e architettura, poi aggiungono soltanto gli asset assenti alla Release ordinaria, conservando Windows/Linux e relativi hash. I futuri tag includono entrambe le architetture; una build Mac fallita è dichiarata senza cancellare gli altri pacchetti.

La guida segue l’eccezione per singola app descritta da Apple; non modifica globalmente Gatekeeper. Nessuna prova su hardware fisico è dedotta da hdiutil/lipo o dal semplice upload. Su Mac il prossimo updater sarà solo avviso e collegamento, come richiesto. Fonte documentale: https://support.apple.com/it-it/102445. Nessun nuovo motore o libreria.

## Screenshot reali riproducibili — richiesta del 22 novembre 2026

Si cattura l’interfaccia browser reale con Playwright e profilo temporaneo, senza modificare DOM, stili o codice dell’app per abbellirla. Esempi DOCX/XLSX/PDF e illustrazione generati appositamente nello script; nessun archivio o file personale aperto. Prima di ogni cattura si cercano percorsi e nome utente nel testo e nei campi; Sharp ottimizza PNG e rimuove metadati. Il rapporto contiene un solo evento simulato attraverso il filtro effettivo dell’app; esiti guidati Non provato. La didascalia dichiara anteprima di sviluppo: non si finge una prova dell’installer desktop. Nessuna dipendenza o marchio esterno aggiunto.

## Release ordinaria senza firma — ordine del 22 novembre 2026

Correzione dopo la prima pubblicazione: Linux usa il nome reale linux-x86_64.AppImage. Per completare una Release già pubblica si aggiungono soltanto installer assenti; quelli presenti vengono preservati e il checksum noto da GitHub deve essere disponibile. Solo SHA256SUMS.txt è rigenerato e sostituito dopo gli upload, oltre alle note. La sostituzione del riepilogo non è atomica (API GitHub), ma non cancella o sostituisce installer. Un nome AppImage inatteso ora fallisce invece di essere ignorato.

L’utente richiede prima la Release pubblica 0.2.2 Windows/Linux, poi i DMG Mac e infine il trasporto TLS Node in un commit successivo. Il workflow di anteprima non usa COSMO_PUBLISH_UPDATES=1 né certificati: costruisce con --publish never, carica installer e checksum in una bozza con GITHUB_TOKEN e la pubblica come release ordinaria/latest solo dopo gli upload. Restano bloccanti i controlli comuni; le build delle piattaforme sono indipendenti e le assenze vengono dichiarate nelle note. Nessun rilascio del prototipo updater.

Alternativa scartata per questa anteprima: attendere certificati di firma non necessari alla richiesta. La precedente configurazione firmata resta un percorso esplicito diverso; non si introduce un fallback silenzioso da firmato a non firmato. Nessuna nuova dipendenza. Le note sono generate dal CHANGELOG e non dai messaggi dei commit. Gli asset di una Release già pubblica non vengono sovrascritti dal publisher automaticamente.

## Studio ArtCraft: nessuna integrazione scelta

Il 22 novembre 2026 sono stati studiati WordCraft, GridCraft, craft-launcher e tre revisioni delle loro librerie condivise. [Risultati e fonti](ricerca/ARTCRAFT.md), [registro degli 80 file](ricerca/CODICE-STUDIATO.md#studio-artcraft-del-22-novembre-2026). Il codice proprio studiato è MIT OR Apache-2.0, ma marchi e materiali con altre licenze sono esclusi. Nessun sorgente è stato copiato, nessun motore o nuova libreria è stato adottato.

I metodi da valutare sono inventario delle parti e delle relazioni, prove indipendenti del round trip, analisi preventiva con esiti incompleti espliciti e conservazione selettiva. Le alternative restano implementazione JavaScript originale, eventuale integrazione Rust da valutare separatamente o nessun cambiamento. Il pass-through dei progetti studiati può rimappare parti e non equivale alla modifica chirurgica byte-identica richiesta per i nostri XLSX esterni. La scelta resta dell’utente.

Non viene adottato il feed remoto ArtCraft: il launcher consulta anche un servizio terzo. Non vengono adottati i log liberi: i filtri di credenziali o di testo citato non garantiscono l’assenza di nomi, percorsi e contenuti. La politica diagnostica CosmOffice a elenco chiuso resta vincolante.

## Trasporto TLS Node autorizzato, non implementato

Nota storica: questa sezione registra il momento dell’autorizzazione durante lo studio. Il successivo stato di implementazione e le prove sono nella sezione “Implementazione del trasporto TLS Node” sopra e nel report corrente; il prototipo Chromium non viene riabilitato.

Risposta esplicita dell’utente alla proposta precedente: autorizzato un trasporto TLS Node separato da Chromium. Registriamo la scelta ora, durante il passo di sola documentazione; il codice main attuale continua a bloccare la rete. Nessun nuovo host è consentito nell’app distribuita da questo commit.

Il prototipo precedente, conservato nello stash 86e37f838c61d64941049db099ca04a4af79a6d5, non è pubblicato: la prova di controllo attivo rilevava nel NetLog una sonda UDP Chromium a [2001:4860:4860::8888]:443, fuori politica, anche con l’override IPv6. Non viene presentato come test verde e non viene ripristinato in questo studio.

Condizioni obbligatorie per il prossimo eventuale passo di implementazione:

1. Solo HTTPS, verifica del certificato abilitata, nessun fallback in chiaro.
2. Solo Release di CosmoNetinfo/CosmOffice. Elenco esatto degli host di metadati e download nel report; controllo anche di ogni reindirizzamento, rifiuto di qualsiasi altra destinazione. Nessun elenco operativo viene attivato qui: andrà verificato e fissato prima di usare il trasporto.
3. Interruttore disattivato: nessuna richiesta; prova con offline-smoke, audit Node e NetLog. Interruttore attivo: controllo e download soltanto autorizzati.
4. Nessun dato su utente, computer o documenti, nessun identificativo/telemetria, intestazioni minime. I metadati inevitabili della connessione HTTPS non diventano un’autorizzazione ad aggiungere dati applicativi.
5. SHA-256 obbligatorio prima di installare e **conferma esplicita dell’utente**. Questa condizione sostituisce l’eventuale installazione automatica alla chiusura prevista nel vecchio prototipo.
6. Test automatico negativo per ogni contatto con host fuori elenco, inclusi redirect.
7. Audit Node aggiuntivo e NetLog Chromium senza connessioni. Riportare gli esiti reali, anche rossi; non modificare le aspettative per nascondere una connessione.
8. README e report devono spiegare cosa si connette, quando e dove. Windows/Linux AppImage restano l’obiettivo di aggiornamento; Mac non firmato solo avviso e download manuale.

La scelta del trasporto non decide né il motore documentale né un riuso di ArtCraft. Il trasporto Rust studiato impone HTTPS remoto ma ammette loopback e non dimostra il nostro elenco chiuso a ogni redirect: non è stato adottato come soluzione pronta.

Aggiornato il 22 novembre 2026. Codice originale proprietario secondo [LICENSE](../LICENSE); gratuità permanente richiesta dall'utente. Le licenze dei componenti restano separate. **Questo studio non sceglie un nuovo motore e non autorizza implementazioni.**

## Decisioni già adottate prima dello studio

| Decisione | Motivo | Alternativa non adottata / limite |
| --- | --- | --- |
| Lavoro locale e nessun account obbligatorio | Requisito del progetto; prove di assenza rete nei percorsi testati | Cloud obbligatorio escluso. Gli aggiornamenti GitHub richiesti successivamente non sono ancora reintrodotti sul main |
| Originali conservati e copie esportate | Ridurre rischio di perdita durante conversioni e guasti | Sovrascrittura implicita dell'originale esclusa; backup e bozze non certificano fedeltà Office |
| Ortografia italiana applicativa con lessico separato | Evitare download Hunspell impliciti di Electron | Controllo nativo disattivato; lessico e parole personali non sono un motore grammaticale |
| Categorie dei nuovi grafici nelle celle reali | Eliminare il foglio tecnico nei nuovi file | Le etichette cambiano anche altri grafici che usano le stesse celle |
| Vecchie categorie discordanti in sola lettura e copia identica | Scelta esplicita dell'utente per non perdere né sovrascrivere informazioni | Migrazione in tabelle visibili rifiutata; il vecchio file conserva anche eventuali difetti di formato |
| Stampa dei fogli con grafici su una pagina orizzontale in entrambe le dimensioni | Altezza aggiuntiva approvata dall'utente dopo prova del taglio verticale | Sola larghezza non bastava; i fogli grandi vengono ridotti |

Le prove e i limiti sono in [VALIDATION](VALIDATION.md), [BUG](BUG.md) e nei [report](report/). Nessuna decisione precedente viene estesa a una garanzia di compatibilità totale.

## Il nodo DOCX/XLSX: quale motore?

**Stato: DA DECIDERE DALL'UTENTE.** Le lettere sotto sono identificatori, non una graduatoria. Il [confronto](ricerca/CONFRONTO.md) mostra il divario di funzioni, ma non è un benchmark dei motori.

### A — Continuare con il motore attuale

Tiptap per il documento modificabile; Mammoth 1.13.0 per l'import DOCX, `docx` per l'export; ExcelJS 4.4.0 e il calcolatore CosmOffice per XLSX. Dai metadati installati: Mammoth è **BSD-2-Clause**, gli altri componenti citati MIT. PDF.js è Apache-2.0 e pdf-lib MIT; il motore PDF è distinto da quello Office.

- **Pro:** controllo dell'esperienza, componenti già inclusi, funzionamento locale già provato, possibilità di interventi circoscritti con codice originale.
- **Contro:** il modello HTML non conserva automaticamente tutto l'OOXML; servono impaginazione, campi, sezioni e regole di calcolo molto più ampie.
- **Rischio principale:** una riscrittura apparentemente riuscita può perdere oggetti o semantica. Mammoth dichiara un obiettivo di conversione semantica, non di replica visiva; ExcelJS non calcola autonomamente i risultati delle formule. Fonti: [Mammoth](https://raw.githubusercontent.com/mwilliamson/mammoth.js/master/README.md), [ExcelJS 4.4.0](https://raw.githubusercontent.com/exceljs/exceljs/v4.4.0/README.md).
- **Prova da autorizzare:** pacchetto di casi reali difficili, confronto strutturale e visivo con Word/Excel, misura del costo per aggiungere ogni classe di contenuto. Prima ancora: correggere i difetti di conformità noti sul main.

### B — Aggiungere una conversione locale separata con LibreOffice

Usare un processo locale per conversione/rendering, mantenendo interfaccia e documenti originali sotto controllo CosmOffice. La CLI documenta esecuzione senza interfaccia, conversioni e profili separati. Fonte: [parametri di avvio ufficiali](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html).

- **Pro:** filtri e impaginazione esistenti; può offrire anteprime PDF e un confronto indipendente. È già usato nei nostri test, ma non nell'app installata.
- **Contro:** convertire DOCX in HTML non rende Tiptap un editor Word; convertire e risalvare può ancora alterare il file. Per un editor completo resterebbe il problema del modello modificabile.
- **Rischi:** pacchetto, memoria e avvio da misurare; crash del processo figlio; font; macro e riferimenti remoti da disabilitare e controllare. Il blocco rete di Electron non protegge automaticamente un processo esterno.
- **Licenze:** MPL 2.0 e componenti differenti; eventuali obblighi di redistribuzione, marchi e modifiche devono essere verificati sul pacchetto scelto. Separare i processi non è una dispensa automatica dalle licenze. Fonti: [licenze LibreOffice](https://www.libreoffice.org/licenses/), [limiti dei filtri Office](https://help.libreoffice.org/latest/en-US/text/shared/guide/ms_import_export_limitations.html).
- **Prova da autorizzare:** confronto ripetibile con i medesimi documenti e font, pacchetto offline isolato, consumi e assenza di rete del processo figlio. Non implementato.

### C — Integrare più profondamente un editor esistente

Valutare un motore con interfaccia modificabile completa, anziché solo conversione: per esempio tecnologie LibreOffice/Collabora o un'integrazione ONLYOFFICE.

- **Pro:** maggiore continuità fra modello, impaginazione e modifica; meno funzioni Office da ricostruire da zero.
- **Contro:** integrazione di input, focus, accessibilità, stampa e più piattaforme; possibile abbandono di parti dell'interfaccia attuale e forte dipendenza dall'ecosistema scelto.
- **Licenze e distribuzione:** ONLYOFFICE Community è AGPL, non MIT/BSD; Collabora distingue condizioni di sorgenti ed eseguibili. Per CosmOffice proprietario non si presume ammesso un incorporamento: servono verifica dei componenti e delle condizioni, oppure un diverso accordo se disponibile. Non si copia o riscrive da vicino il loro codice.
- **Rischio operativo:** la Docs API descrive servizi client/server; un servizio locale non diventa automaticamente leggero o sicuro offline. Il desktop concorrente e l'SDK di integrazione non sono lo stesso prodotto. Fonti: [ONLYOFFICE Desktop](https://helpcenter.onlyoffice.com/desktop/getting-started), [Docs API](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works), [termini Collabora](https://www.collaboraonline.com/terms/collabora-online-mplv2/).
- **Prova da autorizzare:** inventario di licenze, fattibilità desktop senza servizi esterni, comportamento con i file reali e costo di manutenzione. Nessuna integrazione scelta.

### D — Modifica selettiva del pacchetto originale

Conservare l'OOXML originale e cambiare solo le celle o le parti effettivamente modificate, senza ricostruire il resto.

- **Pro:** può conservare grafici e oggetti che il nostro modello non comprende; si adatta a piccoli interventi sui fogli.
- **Contro:** non offre di per sé impaginazione Word, un motore Excel completo o la modifica degli oggetti conservati.
- **Rischi:** formule condivise/matriciali, tipi e stili delle celle, stringhe condivise, firme e dipendenze fra parti. La cache di un grafico conservata può essere obsoleta dopo una modifica dei dati.
- **Prova da autorizzare:** tutte le parti non toccate identiche, corpus pertinente interamente passato, riapertura indipendente e messaggi sui casi non gestibili. Fino ad allora resta la sola lettura attuale. Riferimento: [ECMA-376 e convenzioni di pacchetto](https://ecma-international.org/publications-and-standards/standards/ecma-376/).
- **Stato:** proposta, non implementata nel codice pubblicato.

### E — Formato interno/ODF come percorso principale, OOXML limitato

- **Pro:** rendere esplicito il sottoinsieme modificabile e ridurre promesse improprie sul round trip.
- **Contro:** non soddisfa da solo la priorità dello scambio DOCX/XLSX; introdurrebbe altre conversioni e formati da mantenere.
- **Rischio:** confondere un formato di lavoro più controllabile con una migliore compatibilità Microsoft. È una possibile scelta di prodotto, non un miglioramento automatico.

### F — Nuovo motore originale completo da specifiche

- **Pro:** controllo tecnico e licenza del nostro codice; nessun trapianto di implementazioni copyleft.
- **Contro:** occorre realizzare layout, filtri, stili, font, calcolo e numerose varianti; difficoltà molto alta.
- **Rischio:** sottrarre lavoro ai bug attuali e accumulare eccezioni senza raggiungere la fedeltà attesa. Non viene stimato un tempo fittizio.
- **Base ammessa:** specifiche pubbliche come [ECMA-376](https://ecma-international.org/publications-and-standards/standards/ecma-376/), casi di prova indipendenti e codice originale.

## Criteri comuni prima della scelta

| Criterio | Evidenza da richiedere a ogni strada |
| --- | --- |
| Integrità | Originale intatto; nessuna perdita silenziosa; confronto di oggetti e parti |
| Fedeltà | Pagine, font, tabelle, grafici e risultati confrontati con un riferimento reale |
| Formato | Schema valido non basta a provare la stessa resa o lo stesso calcolo |
| Offline | Font e risorse inclusi; nessun collegamento o servizio esterno implicito |
| Proprietarietà | Licenze di codice, dati, font e distribuzione verificate prima dell'integrazione |
| Risorse | Dimensioni, memoria e tempi misurati sulla stessa macchina |
| Manutenzione | Aggiornamenti del motore, sicurezza e regressioni riproducibili |
| Esperienza | Messaggi chiari, accessibilità e controllo dell'utente sui file |

La gratuità per l'utente non implica che qualunque SDK o redistribuzione sia gratuita o compatibile con codice proprietario. Non sono stati acquistati servizi, accettate licenze commerciali o scelti nuovi componenti.

**Proposta storica dello studio, ora seguita dalla scelta A:** l’uso gratuito degli eseguibili è formalizzato nel LICENSE adottato il 22 novembre 2026, mantenendo proprietari codice e marchi. Lo studio iniziale non aveva modificato la licenza; la successiva istruzione esplicita e i dati ancora mancanti sono registrati nella sezione di adozione sopra.

## Decisioni rinviate

L'utente deve scegliere quale alternativa approfondire e quali file rappresentano il lavoro reale. Le idee in [OPPORTUNITA](ricerca/OPPORTUNITA.md) e l'ordine della [ROADMAP](ROADMAP.md) sono proposte. Il codice dell'app non cambia in questo studio. Il precedente lavoro sul validatore, pur provato localmente, è conservato separatamente e non è incluso nel main di riferimento.

## Recupero del validatore — 22 novembre 2026

Autorizzato dall’utente dopo lo studio. Si usa Microsoft Open XML SDK 3.5.1 (MIT) solo nello sviluppo/CI, con dipendenze bloccate e telemetria .NET disattivata; nessun runtime .NET aggiunto all’app. Il controllo funzionale da solo non intercettava i quattro difetti di schema: il validatore è quindi bloccante sui nuovi esportati del corpus. Due campioni volutamente errati impediscono un falso positivo del controllo. Il vecchio XLSX resta esclusivamente una copia identica, con audit separato del suo errore noto e checksum fisso: non viene sanato in silenzio. Nessun motore alternativo scelto.

## Rapporto tester: messaggi sicuri

Autorizzato esplicitamente dopo lo studio. Si conservano soltanto categoria, classe dell’errore da una lista, data, app e tre posizioni anonimizzate della traccia. I messaggi liberi non sono conservati né inviati via IPC: rimuovere solo i percorsi non impedirebbe a una libreria di includere il testo di una cella. Non si aggiunge alcuna libreria o connessione. Il processo principale controlla anche i dati del renderer e quelli riletti dal registro. Il testo copiato è l’istantanea già mostrata, così un evento successivo non aggiunge dettagli non letti. I dettagli tecnici ridotti possono rendere la diagnosi meno precisa: scelta di riservatezza, non promessa di individuare ogni difetto.

## Rapporto breve nei commenti

Richiesta successiva dell’utente: testo copiabile nei commenti Facebook, senza invio automatico. Si rende ogni evento una riga con data, app, categoria e classe da liste chiuse; solo l’ultima traccia è inclusa. Il buffer rimane di 50 eventi. Il test impone 6.144 byte sul caso più lungo del corpus diagnostico; non si presume un limite stabile di Facebook. La prova guidata sarà aggiunta nel passo successivo, senza campi liberi.

## Prova guidata — scelta esplicita dell’utente

Otto chiavi fisse e tre valori ammessi, senza testo libero. Gli esiti sono salvati soltanto in localStorage; il processo principale riceve un dizionario nuovamente validato prima di generare il rapporto. Le prime otto righe sono esiti dichiarati dal tester, non verifiche automatiche. Nessuna deduzione automatica di un esito dalla presenza dell’app. Backup documenti e impostazioni non includono questi esiti. Non viene introdotto un servizio di raccolta.
