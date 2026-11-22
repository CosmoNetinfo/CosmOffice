# Decisioni e alternative tecniche

## Studio ArtCraft: nessuna integrazione scelta

Il 22 novembre 2026 sono stati studiati WordCraft, GridCraft, craft-launcher e tre revisioni delle loro librerie condivise. [Risultati e fonti](ricerca/ARTCRAFT.md), [registro degli 80 file](ricerca/CODICE-STUDIATO.md#studio-artcraft-del-22-novembre-2026). Il codice proprio studiato è MIT OR Apache-2.0, ma marchi e materiali con altre licenze sono esclusi. Nessun sorgente è stato copiato, nessun motore o nuova libreria è stato adottato.

I metodi da valutare sono inventario delle parti e delle relazioni, prove indipendenti del round trip, analisi preventiva con esiti incompleti espliciti e conservazione selettiva. Le alternative restano implementazione JavaScript originale, eventuale integrazione Rust da valutare separatamente o nessun cambiamento. Il pass-through dei progetti studiati può rimappare parti e non equivale alla modifica chirurgica byte-identica richiesta per i nostri XLSX esterni. La scelta resta dell’utente.

Non viene adottato il feed remoto ArtCraft: il launcher consulta anche un servizio terzo. Non vengono adottati i log liberi: i filtri di credenziali o di testo citato non garantiscono l’assenza di nomi, percorsi e contenuti. La politica diagnostica CosmOffice a elenco chiuso resta vincolante.

## Trasporto TLS Node autorizzato, non implementato

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

**Proposta non implementata:** verificare con il titolare come formalizzare l'uso gratuito degli eseguibili, mantenendo proprietari codice e marchi. L'attuale LICENSE del repository riserva i diritti sul codice; questo studio non la modifica e non inventa condizioni per gli utenti finali.

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
