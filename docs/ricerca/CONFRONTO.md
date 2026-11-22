# Confronto delle suite office

Studio del **22 novembre 2026**. Riferimento CosmOffice: **0.2.2, commit fa1619564d91ef39757d82f0e16675d371835529**. Questo documento non certifica compatibilità né prestazioni e non sceglie un nuovo motore.

## Metodo e limiti

Sono state consultate documentazione, licenze, descrizioni delle interfacce e note di rilascio pubbliche. Non sono state installate e confrontate tutte le suite sul medesimo corpus. Per GPL, AGPL e copyleft analoghi non è stato esaminato codice di implementazione: soltanto documenti e metadati pubblici. Il [registro delle consultazioni](CODICE-STUDIATO.md) distingue documentazione e codice permissivo consultato in precedenza.

**Documentato** significa dichiarato dalla fonte; **provato** significa verificato nei test CosmOffice; **valutazione** significa nostra analisi, da confermare. Un'assenza dalla documentazione non prova che una funzione non esista. Non assegno punteggi di velocità, memoria o fedeltà senza misure.

## Punto di partenza di CosmOffice

| Area | Presente nel codice pubblicato | Limite rilevante |
| --- | --- | --- |
| CosmoWrite | DOCX, testo, tabelle, immagini, formattazione, esportazione e bozze locali | Ricostruisce il corpo; non è un motore di impaginazione Word. Intestazioni conservate ma non editabili; contenuti complessi rilevati possono bloccare l'export |
| CosmoGrid | XLSX, 102 funzioni abilitate, più fogli, tre tipi di grafico | Motore di formule parziale. Grafici esterni non riconosciuti in sola lettura; vecchie categorie discordanti consentono solo copia identica |
| CosmoView | Lettura, ricerca e rotazione persistente PDF | Niente OCR, annotazioni, modifica del testo o moduli; limiti sui file protetti |
| Trasversale | Italiano, archivio locale, backup, impostazioni, ortografia italiana incorporata | Nessun collaudo completo su computer puliti; nessuna equivalenza con Office dimostrata |

Questi dati provengono dal [README](../../README.md), dai [test](../../tests/) e da [VALIDATION](../VALIDATION.md). Esistono inoltre difetti di conformità rilevati nell'audit SDK preparatorio e **non corretti sul main di riferimento**: vedere [BUG](../BUG.md). I test verdi non li annullano.

## Quadro generale

| Prodotto considerato | Licenza del progetto / edizione | Tecnologia e uso locale |
| --- | --- | --- |
| LibreOffice | MPL 2.0; componenti con altre licenze | Motore desktop, modello ODF, filtri Office, conversione locale e API/strumenti dedicati |
| ONLYOFFICE Desktop Editors Community | AGPL v3; edizioni commerciali separate | Editor desktop di documenti, fogli, presentazioni e PDF; file locali e collegamenti cloud opzionali |
| Collabora Office desktop / CODE | Sorgenti prevalentemente MPL 2.0 e altre licenze; condizioni dei prodotti eseguibili da distinguere | Motore di origine LibreOffice e interfaccia condivisa con Online; desktop locale, CODE per server |
| Calligra | GPL-2.0-or-later nella scheda KDE | Qt6/KF6; Words, Sheets, Stage e Karbon; distribuzione soprattutto Linux |
| AbiWord | GPL; il pacchetto SUSE dichiara GPL-2.0-or-later | Elaboratore testi GTK; non è una suite completa |
| Gnumeric | GPL versione 2 oppure 3 | Foglio di calcolo GTK con GOffice; distribuito soprattutto tramite sistemi Linux/BSD |
| Apache OpenOffice | Apache License 2.0 per le release Apache | Suite desktop ODF con Writer, Calc, Impress, Draw, Base e Math |
| CryptPad | AGPL v3 | Suite web collaborativa, cifratura nel browser, editor Office client-side e un'istanza server |

Le fonti delle singole righe sono indicate nelle sezioni seguenti. La licenza del progetto non sostituisce l'inventario dei componenti del pacchetto che si volesse distribuire. Per CosmOffice proprietario non presumo autorizzato alcun incorporamento.

## LibreOffice

**Punti di forza e funzioni mancanti in CosmOffice.** Writer documenta stili di pagina, navigazione strutturale, indici, bibliografie e stampa unione. Calc offre strumenti di analisi, scenari e grafici dinamici, oltre al nostro sottoinsieme. È un riferimento utile per documenti lunghi e lavoro desktop offline. Fonti: [funzioni Writer](https://help.libreoffice.org/latest/en-US/text/swriter/main0503.html), [funzioni Calc](https://help.libreoffice.org/latest/en-US/text/scalc/main0503.html).

**Punti deboli e confini.** Il progetto stesso segnala differenze di conversione per impaginazioni e oggetti Office complessi. Usarlo non garantisce un round trip identico a Word/Excel. L'ampiezza dell'interfaccia potrebbe richiedere apprendimento: è una valutazione UX, non un difetto misurato. Fonti: [limiti di conversione](https://help.libreoffice.org/latest/en-US/text/shared/guide/ms_import_export_limitations.html), [licenze](https://www.libreoffice.org/licenses/).

**Cosa CosmOffice ha e LibreOffice no.** Nessuna esclusiva funzionale dimostrata. Il percorso unico delle tre app e le nostre regole esplicite di sola copia sono differenze di flusso da confrontare, non prove che LibreOffice non possa ottenere risultati analoghi.

## ONLYOFFICE Desktop Editors

**Punti di forza e funzioni mancanti.** Offre presentazioni, strumenti di revisione e PDF più avanzati; la documentazione del PDF desktop descrive anche modifica del testo, gestione pagine e moduli. Lavorare su documenti locali non richiede una connessione costante. Fonti: [desktop e licenza Community](https://helpcenter.onlyoffice.com/desktop/getting-started), [PDF desktop](https://helpcenter.onlyoffice.com/docs/userguides/pdf_editor/hometab.aspx), [note di rilascio desktop](https://helpcenter.onlyoffice.com/desktop/desktop-changelog).

**Punti deboli e confini.** Cloud, collaborazione e componenti opzionali vanno distinti dal lavoro locale. L'edizione Community è AGPL: non è una libreria permissiva da trapiantare nel nostro prodotto proprietario. L'integrazione Docs documentata è client/server, diversa dal semplice uso dell'app desktop. Fonte: [architettura Docs](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works).

**Vantaggi CosmOffice dimostrati assenti lì.** Nessuno. Non presento offline, PDF o assenza di account obbligatorio per i file locali come esclusive nostre. La fedeltà relativa resta da misurare sugli stessi file.

## Collabora

**Edizioni da non confondere.** Il nuovo Collabora Office desktop è disponibile gratuitamente e lavora localmente; CODE è la variante server di sviluppo. Classic e i servizi supportati hanno condizioni differenti. La release desktop 26.04 descrive integrazione nativa e Qt6 WebEngine su Linux. Fonti: [release desktop 26.04](https://www.collaboraonline.com/blog/collabora-office-26-04-release/), [FAQ delle edizioni](https://www.collaboraonline.com/faqs/).

**Punti di forza e funzioni mancanti.** Editor documenti, fogli, presentazioni e disegni; esperienza condivisa fra desktop e web. **Confini:** CODE non è presentato come ambiente con SLA; le condizioni di sorgenti, eseguibili, marchi e supporto non sono intercambiabili. Fonte: [termini MPL e componenti](https://www.collaboraonline.com/terms/collabora-online-mplv2/).

**Vantaggi esclusivi CosmOffice.** Nessuno dimostrato: sarebbe scorretto dire che Collabora funziona solo online o non ha un'interfaccia moderna. La semplicità del nostro flusso per tre attività è una possibile preferenza da provare con utenti.

## Calligra

**Punti di forza e funzioni mancanti.** Suite KDE con impaginazione a riquadri in Words, fogli, presentazioni e disegno vettoriale. CosmOffice non ha gli ultimi due moduli né un ambiente DTP equivalente. Fonti: [Calligra 4.0 e passaggio Qt6/KF6](https://calligra.org/news/2024-08-calligra-4.0/), [Words e licenza GPL-2.0-or-later](https://apps.kde.org/calligra.words/).

**Punti deboli e confini.** Il sito indirizza soprattutto a Linux/Flatpak e indica il lavoro sul port Windows. Non ho verificato la fedeltà DOCX/XLSX o la disponibilità dei medesimi filtri su ogni piattaforma. Fonte: [distribuzione](https://calligra.org/download/).

**Differenza CosmOffice.** Abbiamo una confezione Electron Windows già provata e pacchetti multipiattaforma in CI; ciò non dimostra superiorità di compatibilità o un'esclusiva funzionale. Nessun codice Calligra è stato consultato.

## AbiWord

**Punti di forza e funzioni mancanti.** È un elaboratore testi dedicato con plugin e controllo ortografico. Il manuale distribuito con il programma documenta conversioni, compresi DOCX, ODT e PDF. Fonti: [manuale del programma, distribuito da Debian](https://manpages.debian.org/testing/abiword/abiword.1.en.html), [metadati GTK e licenza del pacchetto SUSE](https://packagehub.suse.com/packages/abiword/).

**Punti deboli e confini.** Non sostituisce un intero ambiente fogli/documenti/PDF. Il sito storico non era raggiungibile dal nostro strumento; non prometto installer Windows/macOS aggiornati o fedeltà moderna non provata. Sono state lette solo [documentazione README](https://raw.githubusercontent.com/AbiWord/abiword/master/README) e [informazioni di copyright](https://raw.githubusercontent.com/AbiWord/abiword/master/COPYRIGHT.TXT), non l'implementazione GPL.

**Cosa offre CosmOffice in più come prodotto.** CosmoGrid e il visualizzatore PDF nello stesso archivio: confronto di perimetro, non giudizio sull'accuratezza dell'elaboratore testi.

## Gnumeric

**Punti di forza e funzioni mancanti.** Specializzazione nel calcolo, analisi, ottimizzazione e grafici più articolati. Il progetto pubblica aggiornamenti di funzioni e compatibilità XLSX: è un riferimento per costruire casi di prova numerici, non un motore da copiare. Fonti: [progetto e GPL 2 oppure 3](https://gnome.pages.gitlab.gnome.org/gnumeric-web/), [manuale](https://gnome.pages.gitlab.gnome.org/gnumeric/manual/chapter-welcome.html), [rilascio 1.12.62](https://gnome.pages.gitlab.gnome.org/gnumeric-web/announcements/1.12/gnumeric-1.12.62.html).

**Punti deboli e confini.** Il sito dichiara di non distribuire attualmente binari Windows. Il manuale comprende sezioni storiche: non uso vecchie note sull'assenza di grafici OOXML come descrizione certa dell'ultima release. Fonte: [download ufficiale](https://gnome.pages.gitlab.gnome.org/gnumeric-web/download.html).

**CosmOffice in più.** Word processor e lettore PDF integrati, assenti dal perimetro di un foglio di calcolo dedicato. Nessuna superiorità matematica nostra è dimostrata.

## Apache OpenOffice

**Punti di forza e funzioni mancanti.** Suite completa con presentazioni, disegno, database ed equazioni; licenza Apache 2.0. Fonti: [prodotti](https://www.openoffice.org/product/), [licenza](https://www.openoffice.org/license.html).

**Limite importante per questo progetto.** La guida AOO4 documenta apertura, ma non salvataggio nei formati DOCX/XLSX/PPTX. Non lo propongo quindi come soluzione automatica al nostro round trip OOXML. Fonte: [opzioni di caricamento e salvataggio](https://wiki.openoffice.org/wiki/Documentation/AOO4_User_Guides/Getting_Started/Setting_Up_and_Customizing_Apache_OpenOffice/Choosing_Options_for_Loading_and_Saving_Documents).

**CosmOffice in più nel perimetro scelto.** Esportazione DOCX/XLSX del proprio sottoinsieme. Questo non equivale a migliore fedeltà: i difetti di schema rilevati in CosmOffice restano da correggere sul main.

## CryptPad

**Perché incluso.** È un termine di confronto per la privacy: suite web AGPL con collaborazione e cifratura nel browser, non un'alternativa desktop identica. Include applicazioni collaborative assenti in CosmOffice. Fonti: [presentazione e licenza](https://cryptpad.org/about/), [FAQ e integrazione Office](https://docs.cryptpad.org/en/FAQ.html).

**Tecnologia e confini.** Gli editor Office integrano il client ONLYOFFICE e conversioni nel browser, non il Document Server ONLYOFFICE. Rimane un sistema con un'istanza server; non è stata provata una modalità desktop autonoma equivalente alla nostra. Non confronto l'archivio locale non cifrato di CosmOffice con una protezione E2EE che non possediamo.

**CosmOffice in più nel flusso.** App installata che lavora sui file locali senza collegamento a un'istanza. Non è una superiorità assoluta sulla privacy: i modelli di minaccia e la collaborazione sono diversi.

## Risultato del confronto

Per essere credibili mancano soprattutto conservazione dei contenuti, impaginazione e calcolo affidabili, prove con documenti reali e installazioni riproducibili. Le funzioni aggiuntive vengono dopo. Nessuna fonte autorizza a dichiarare una compatibilità Office del 100%. Le proposte e il loro ordine sono in [OPPORTUNITA](OPPORTUNITA.md); le strade per il motore restano aperte in [DECISIONI](../DECISIONI.md).
