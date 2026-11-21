# Registro dei bug CosmOffice

Ordine: P1 (perdita o alterazione dati, crash, file corrotti), P2 (risultati o comportamento errati), P3 (limiti di impaginazione o usabilità). Uno stato risolto richiede una prova; le incompatibilità non ancora riprodotte non vengono dichiarate risolte.

## P1 Perdita o alterazione dei dati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| DAT-001 | Inserire `00123` o un identificativo di oltre 15 cifre poteva togliere gli zeri o arrotondare il valore. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs`, salvataggio e riapertura XLSX; prova nell'app Windows |
| DAT-002 | Una formula digitata in una cella con formato testo `@` veniva eseguita invece di essere conservata come testo. | Corretto nella revisione locale 0.2.2 | `tests/reliability.test.mjs` |
| DAT-003 | Il getter/setter di ExcelJS usa `merges`/`mergeCells` diversi: celle unite potevano perdersi nelle copie per export, annulla o duplicazione. | Corretto nella 0.2.1 | `tests/reliability.test.mjs` |
| DAT-004 | L'export aggiornava formule e risultati nel modello aperto, anche prima della scelta o riuscita del salvataggio. | Corretto nella 0.2.1 | Esportazioni concorrenti e confronto del modello prima/dopo |
| DAT-005 | Dopo il fallimento del salvataggio di una bozza era possibile cambiare schermata e perdere il testo rimasto solo in memoria. | Corretto nella 0.2.1 | `scripts/reliability-smoke.mjs`: quota esaurita simulata, navigazione bloccata, nuovo salvataggio e riapertura |
| DAT-006 | Un errore sincrono durante il ripristino in blocco poteva lasciare inserimenti parziali. | Corretto nella 0.2.1 | Transazione annullata per un dato non scrivibile; archivio invariato |
| DAT-007 | Formule italiane esportate con nomi locali e virgole decimali non rispettavano la sintassi XLSX. | Corretto nella 0.2.0 | `tests/files.test.mjs`: sintassi invariante, riferimenti assoluti e riapertura |

## P2 Risultati errati

| ID | Problema e riproduzione | Stato | Verifica |
| --- | --- | --- | --- |
| CAL-001 | Una stringa come `#N/A` veniva confusa con un errore vero; IFERROR, ISERROR e risultati salvati potevano essere errati. | Corretto nella revisione locale 0.2.2 | `tests/formulas.test.mjs`, `tests/reliability.test.mjs`, verifica con LibreOffice |
| CAL-002 | Stringhe vuote e celle vuote erano indistinguibili per ISTEXT e ISBLANK. | Corretto nella revisione locale 0.2.2 | Test dei predicati e dei tipi |
| DOC-001 | Il formato orizzontale DOCX veniva scambiato due volte, lasciando larghezza e altezza incoerenti. | Corretto nella 0.2.0 | Controllo OOXML della pagina orizzontale in `tests/files.test.mjs` |

## Limiti noti da verificare con il corpus richiesto

- DOCX: intestazioni, piè di pagina, commenti, revisioni e oggetti complessi non hanno ancora una garanzia di conservazione nell'esportazione. Il corpus dovrà distinguere apertura, modifica ed export senza perdita.
- PDF: CosmoView è un lettore. La rotazione attuale modifica la vista; la copia esportata conserva i byte originali. Modifica persistente del documento non ancora implementata.
- Il traffico di rete del renderer è bloccato; il meccanismo di aggiornamento delle build firmate prevede attualmente accessi a GitHub. Va adeguato al nuovo vincolo di nessuna chiamata esterna.
- I controlli locali precedenti coprono un corpus ristretto generato per i test, non tutti i file Microsoft.

## Prove indipendenti

`scripts/interop.mjs` esegue conversioni con un profilo LibreOffice isolato. LibreOffice può riscrivere una cella di errore costante come formula che restituisce lo stesso errore: il test confronta il significato e non segnala questa trasformazione equivalente come perdita di dati.

I nuovi bug del corpus `tests/fixtures` verranno aggiunti con file, passaggi di riproduzione, comportamento atteso ed esito verificato.
