# Corpus di regressione

13 file binari validi con dati interamente fittizi, creati da `node scripts/create-fixtures.mjs` usando le librerie open source del progetto. Sono documenti reali nei rispettivi formati, non estensioni rinominate. Non sono campioni certificati o prodotti da Microsoft Office.

`manifest.json` registra impronte SHA-256 e contenuti attesi. Non rigenerare i file durante i test: gli originali devono restare immutati. La rigenerazione è un'operazione esplicita da revisionare insieme al manifest.

- DOCX: testo italiano/stili; tabella; immagine incorporata; elenchi puntati e numerati; intestazione con logo e piè di pagina con numero pagina.
- XLSX: formule; riferimenti tra fogli; valuta/percentuali/date/codici; celle unite/formule condivise/immagine; filtro/dati oltre l'area visibile.
- PDF: testo selezionabile; scansione simulata composta solo da immagine (senza OCR); relazione di 20 pagine.

I PDF di scansione sono sintetici: non contengono dati personali reali. Un corpus piccolo non dimostra compatibilità universale con Office.
