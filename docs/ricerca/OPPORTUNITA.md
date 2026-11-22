# Opportunità per CosmOffice

Data: 22 novembre 2026. **Proposte di studio, non funzioni implementate né decisioni approvate.** Base: [confronto con le fonti](CONFRONTO.md), [limiti provati](../VALIDATION.md) e [registro dei bug](../BUG.md).

Il valore è una stima per chi scambia documenti reali; la difficoltà è relativa all'architettura corrente. Non sono preventivi o tempi promessi. Difficoltà: B bassa, M media, A alta, MA molto alta. Prima si rimuovono rischi di perdita o alterazione; poi si misura la fedeltà; solo dopo si amplia il prodotto.

## Indispensabili per essere un'alternativa credibile

| Ordine | Proposta | Valore | Difficoltà | Prova minima prima di dichiararla disponibile |
| --- | --- | --- | --- | --- |
| I1 | Correggere i difetti di schema noti e rendere bloccante un validatore OOXML indipendente | Massimo | M | Tutti i nuovi DOCX/XLSX esportati validi; file volutamente errati respinti; copia storica separata e identica |
| I2 | Corpus di file reali autorizzati e anonimizzati, con apertura anche in Microsoft Word/Excel | Massimo | M/A | Risultati, contenuti e impaginazione confrontati; difetti riproducibili registrati, non soltanto “si apre” |
| I3 | Conservare grafici e parti non modificate degli XLSX durante piccoli interventi | Massimo | A | Altre parti byte per byte identiche e riapertura indipendente; sola lettura mantenuta finché non passa il corpus |
| I4 | Fedeltà DOCX: sezioni, stili, tabelle, numerazione, intestazioni, note e impaginazione | Massimo | MA | Confronto di pagine e struttura; esportazione bloccata sui casi che non si conservano |
| I5 | Copertura e correttezza delle formule, con risultati obsoleti sempre riconoscibili | Alto | A/MA | Casi numerici e semantici con risultati attesi verificati; niente numero apparentemente valido in caso di funzione non supportata |
| I6 | Installer e aggiornamenti affidabili, con possibilità di restare offline | Alto | A | Installazione/aggiornamento su macchine pulite, integrità verificata, rete limitata alla politica autorizzata |
| I7 | Recupero del lavoro e backup verificabili anche dopo errori di disco o arresti | Alto | M/A | Ripristino provato, file originale intatto, errori comprensibili, nessuna perdita di bozza segnalata come salvataggio riuscito |
| I8 | Uso da tastiera e accessibilità dei flussi principali | Alto | M/A | Prove con tastiera e lettore schermo, focus coerente, zoom senza perdita di comandi |

I4 e I5 dipendono fortemente dalla scelta del motore: non avviarne un rifacimento prima della scelta dell'utente. LibreOffice documenta già possibili differenze Office, quindi nemmeno un motore esistente elimina I2. Fonti: [limiti di conversione LibreOffice](https://help.libreoffice.org/latest/en-US/text/shared/guide/ms_import_export_limitations.html), [ECMA-376](https://ecma-international.org/publications-and-standards/standards/ecma-376/).

## Miglioramenti di qualità

| Ordine | Proposta | Valore | Difficoltà | Condizione e limite |
| --- | --- | --- | --- | --- |
| Q1 | Rapporto locale per i tester, leggibile prima della copia | Alto | M | Solo ultimi eventi, niente documenti, nomi, percorsi o identificativi. Messaggi arbitrari possono contenere dati: servono filtri e messaggi sicuri verificati, non soltanto rimozione dei percorsi |
| Q2 | Anteprima di stampa e controllo della scala | Alto | M/A | Mostrare quando l'adattamento a una pagina rende il testo troppo piccolo; non promettere il layout Word senza un motore adeguato |
| Q3 | Ricerca/sostituzione nei fogli, ordinamento e filtri modificabili | Alto | M | Non alterare formule, formati, righe nascoste o dati fuori area |
| Q4 | Dizionario personale esportabile e suggerimenti ortografici locali | Medio/alto | M | Licenza dei dati verificata; nessun download implicito; il lessico non diventa una grammatica completa |
| Q5 | PDF: miniature, segnalibri, annotazioni e moduli | Alto | M/A | Conservare contenuto e interattività; gestire file protetti e firme senza invalidazioni silenziose |
| Q6 | Modelli italiani per lettere, verbali e prospetti comuni | Medio/alto | B/M | Dati fittizi, formati semplici, prova di stampa; nessuna promessa automatica di validità normativa |
| Q7 | OCR italiano offline, facoltativo | Medio | A | Misurare accuratezza e risorse; i risultati devono essere correggibili e distinti dall'originale |
| Q8 | Prestazioni e dimensioni del pacchetto misurate | Medio | M | Tempi, memoria e dimensioni confrontati sugli stessi sistemi; non chiamare “leggero” un prodotto senza misure |

Molti miglioramenti non sono nuovi nel settore: per esempio i moduli e la modifica PDF sono già documentati da [ONLYOFFICE](https://helpcenter.onlyoffice.com/docs/userguides/pdf_editor/hometab.aspx). Sono opportunità di qualità per noi, non esclusive da pubblicizzare.

## Novità che ci distinguono

Qui “distinguono” significa ipotesi di un flusso utile e riconoscibile, **non unicità mondiale dimostrata**. Nessuna idea seguente è implementata in questo passo.

| Ordine | Idea | Valore | Difficoltà | Come verificare che serva davvero |
| --- | --- | --- | --- | --- |
| N1 | Scheda di compatibilità prima del salvataggio: cosa è preservato, non modificabile o non verificato | Alto | A | I tester capiscono la differenza fra originale, bozza e copia; nessun “tutto conservato” senza controllo delle parti |
| N2 | Confronto locale prima/dopo con riepilogo delle variazioni di testo, celle e parti OOXML | Alto | A/MA | Scoprire perdite introdotte dall'export e distinguere variazioni equivalenti; nessun invio del documento |
| N3 | Controllo privacy locale del documento con anteprima delle informazioni da rimuovere | Medio/alto | A | Rilevare metadati e contenuti nascosti senza cancellarli automaticamente; copia separata e ripristino |
| N4 | Pacchetto di lavoro locale con documenti, fogli e PDF collegati e riferimenti verificabili | Medio | A | Utilità concreta per una pratica; collegamenti conservati dopo backup e spostamento, senza cloud |
| N5 | Assistente italiano non generativo per operazioni comuni | Medio | M | Spiegazioni di formule, errori e formati basate su regole locali e verificabili; nessuna risposta inventata |

N1/N2 sembrano coerenti con l'affidabilità richiesta, ma restano da validare con utenti. Cronologia, confronto documenti e privacy esistono già in altre forme nelle suite studiate. La nostra ipotesi riguarda un percorso semplice e integrato, non l'invenzione del concetto.

## Cosa non propongo come prima priorità

Un assistente AI generalista, un cloud obbligatorio, la collaborazione in tempo reale, presentazioni complete e macro non risolvono i difetti DOCX/XLSX attuali. Richiedono una scelta esplicita su risorse, licenze e sicurezza. Un servizio cloud contraddirebbe il perimetro offline; modelli locali inciderebbero su dimensioni e memoria. Le offerte concorrenti non giustificano copiarne interfaccia o codice.

## Decisione richiesta

Scegliere prima quale strada studiare per la fedeltà: motore attuale, conversione locale aggiuntiva, integrazione più ampia o conservazione selettiva del file originale. [DECISIONI](../DECISIONI.md) espone vantaggi e rischi senza scegliere. La [ROADMAP](../ROADMAP.md) è una proposta ordinata: non è autorizzazione a implementarla.
