# Decisioni e alternative tecniche

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
