# Roadmap CosmOffice

## Markdown — 25 novembre 2026

Supporto richiesto: creazione e apertura .md UTF-8, sorgente e anteprima offline, esportazione e backup. Verifiche e limiti nel report corrente; nessuna scelta dei motori Office. La pubblicazione 0.2.3 è autorizzata dal titolare il 25 novembre 2026; verifica effettiva nel report corrente. Installazione Windows segnalata dall’utente, senza conferma di PC pulito o esito dei singoli formati.

## Passo corrente: pubblicazione 0.2.3 autorizzata (25 novembre 2026)

- Implementati: aggiornamenti spenti di default, nessuna richiesta all’avvio, pulsante per singola operazione e chiusura automatica della rete; periodici soltanto opt-in, vecchio consenso non ereditato.
- Implementati: Informazioni offline e inclusione delle licenze nelle risorse. Verifica reale del pacchetto Windows; controlli bloccanti per AppImage e DMG in CI. LIC-001 non viene esteso retroattivamente alla 0.2.2.
- Lavoro Windows di installazione NSIS e disinstallazione reali nel runner: riuscito nella CI 45086811898 del commit 6534f41, insieme agli altri cinque lavori. Non sostituisce il PC fisico.
- Screenshot di sviluppo aggiornati a 0.2.3, incluse Aggiornamenti e Informazioni.
- Non provati: PC Windows fisico pulito, SmartScreen, UAC/antivirus e utente normale, AppImage in uso e Mac fisico. Il titolare ha ora autorizzato la pubblicazione; l’autorizzazione non trasforma questi casi in prove riuscite.

Il resto del documento conserva le tappe precedenti e le proposte sospese; nessun motore scelto o altra idea implementata.

Aggiornata al 23 novembre 2026. Priorità: affidabilità, compatibilità DOCX/XLSX/PDF, qualità, poi novità. **Le voci pianificate sono proposte: nessuna implementazione è autorizzata da questo studio.**

Stati: **Fatto e provato** = evidenza nei test/report; **Parziale** = sottoinsieme con limiti; **In corso** = attività effettivamente aperta; **Pianificato** = da scegliere/autorizzare; **Non provato** = nessuna verifica sufficiente. Riferimento applicativo: 0.2.3 in preparazione, Release pubblica 0.2.2; il recupero del validatore segue lo studio sul commit 3185603. Le priorità aggiornate autorizzate sono: verifica CI 5a493a4/9e3173e e rapporto breve per Facebook, prova guidata a otto esiti, aggiornamenti GitHub, DMG/guida Mac, Release ordinaria 0.2.2 e bozze di licenza. Le altre proposte restano sospese.

## Stato esistente

| Voce | Stato onesto | Evidenza / limite |
| --- | --- | --- |
| Editor DOCX, XLSX e lettore PDF | Parziale | Funzioni essenziali provate; non equivalenza Microsoft Office |
| Bozze, backup e salvataggio di copie | Fatto e provato sul corpus | Recupero e protezione dell'originale testati; non tutti i guasti reali |
| Ortografia italiana offline | Fatto e provato | Lessico incluso e parole personali; niente grammatica/suggerimenti completi |
| Tre grafici e categorie nelle celle reali | Fatto e provato nel sottoinsieme | Nuovi file senza foglio tecnico; grafici esterni non modificabili |
| Vecchi grafici con categorie discordanti | Fatto e provato come sola copia | File originale intatto, compresi difetti storici; nessuna migrazione |
| Stampa grafici senza taglio nel campione | Fatto e provato | Una pagina orizzontale; riduzione dei fogli grandi |
| Rotazione PDF persistente | Fatto e provato | Solo pagine, niente OCR/modifica testo/moduli |
| CI e pacchetti multipiattaforma | Fatto per le build registrate | Windows provato localmente; Mac/Linux fisici non collaudati |
| Studio comparativo e alternative del motore | Fatto, solo documentazione | Confronto, opportunità, fonti e alternative consegnati; nessun motore scelto |
| Validatore Microsoft e correzioni di schema | Recuperato su main; verifiche nel report | SDK bloccante sul corpus dei nuovi esportati, non garanzia universale |

## Priorità P0 — Integrità e prove, prima di nuove funzioni

Aggiornamento di ricerca ArtCraft: [studio completato](ricerca/ARTCRAFT.md), con licenze ed 80 file tracciati. Nessuna funzione integrata. Metodi proposti in ordine di valore: inventario parti/relazioni prima e dopo l’export; confronto indipendente di dati e resa; scheda locale con esiti non verificati espliciti; conservazione selettiva. Restano proposte subordinate alla scelta dell’utente, senza cambiare i blocchi attuali o scegliere il motore.

| Ordine | Voce | Stato | Condizione di completamento |
| --- | --- | --- | --- |
| 1 | Correggere FMT-001/002/003 e portare in CI la validazione degli esportati | Implementato; esiti nel report | 13 nuovi file senza errori, test negativi ed eccezione storica esplicita |
| 2 | Corpus reale autorizzato e anonimizzato | Pianificato | Confronto riproducibile con Word/Excel e lettore PDF indipendente |
| 3 | Scelta dell'approccio DOCX/XLSX | In attesa dell'utente | Decisione esplicita fra le alternative di DECISIONI, con criteri di accettazione |
| 4 | Conservazione selettiva degli XLSX complessi | Pianificato, sola lettura attuale | Nessuna parte non modificata alterata e tutto il corpus pertinente passato |
| 5 | Impaginazione DOCX e copertura formule coerenti con la scelta | Pianificato | File reali, resa e risultati verificati; niente promesse basate sul solo numero di funzioni |

## Priorità P1 — Uso quotidiano e distribuzione

| Ordine | Voce | Stato | Vincolo |
| --- | --- | --- | --- |
| 6 | Installer su sistemi puliti e accessibilità | Pianificato / non provato | Windows, Linux e Mac reali; tastiera e lettore schermo |
| 7 | Rapporto per i tester copiabile e solo locale | Implementato; verifiche nel report corrente | Ultimi 50 eventi, messaggi controllati, tracce anonimizzate, copia esplicita e nessun invio |
| 8 | Release pubblica, checksum e guide di primo avvio | Pubblicata 0.2.2 con quattro installer; download anonimi e SHA-256 verificati | Sistemi puliti e Mac fisici non collaudati |
| 9 | Aggiornamenti su richiesta dalle Release autorizzate | 0.2.3 in preparazione: spenti di default, periodici opt-in; prove locali nel report | Nessuna rete all’avvio, clic unico e spegnimento finale; nuova CI da verificare dopo il push |
| 10 | Verifica finale delle licenze e distribuzione del dizionario sostituibile | Pianificato | Fonte, licenza e sostituibilità del pacchetto verificate, senza confondere dati e codice |
| 11 | Backup del dizionario personale e anteprima di stampa | Proposta | Ripristino verificato e scala leggibile |

La release ordinaria **“CosmOffice 0.2.2 (anteprima)”** è pubblica su `/releases/latest`, con quattro installer, checksum e limiti espliciti. La pubblicazione è avvenuta dopo il passo di sola ricerca.

## Priorità P2 — Qualità, dopo P0

Ricerca/sostituzione e filtri dei fogli; moduli e annotazioni PDF; modelli italiani; suggerimenti ortografici locali; prestazioni misurate. Tutto **pianificato come proposta**, non attivato. Ordine e difficoltà sono in [OPPORTUNITA](ricerca/OPPORTUNITA.md).

## Priorità P3 — Differenziazione da validare

Scheda di compatibilità prima dell'export; confronto locale prima/dopo; controllo privacy dei documenti; pratiche locali con file collegati; assistenza italiana basata su regole. Sono ipotesi, non esclusive dimostrate rispetto al mercato.

## Fuori dal lavoro corrente

Richiesta aggiuntiva eseguita dopo la preparazione Release: screenshot reali riproducibili e README illustrato, senza modifiche al codice dell’app. Esiti e verifica pubblica nel report del passo. Dopo Linux e immagini sono stati completati i DMG Mac e l’updater TLS Node nel main; restano i collaudi fisici dichiarati.

Cloud obbligatorio, telemetria, nuove funzioni AI, presentazioni complete, macro e app mobili non vengono implementati in questa ricerca. L’app rimane gratuita e proprietaria; la scelta A ora concede l’uso gratuito in LICENSE e lascia separati i diritti dei componenti di terzi.

## Ordine operativo richiesto dopo lo studio

1. CI 5a493a4 e 9e3173e: verificata verde; link nel report. Rapporto locale pubblicato, consolidamento breve e 10+10 ripetizioni superate; verifiche finali nel report.
2. Prova guidata: implementata; verifiche nel report del passo. Otto prove e soli esiti Ok/Problema/Non provato; nessun campo libero.
3. Aggiornamenti da GitHub Releases: implementati nel main con trasporto TLS Node, host chiusi e conferma esplicita; audit/NetLog e prove del pacchetto nel report del passo. Non inclusi retroattivamente negli installer 0.2.2. Installazione su computer puliti e AppImage reale in uso non provate. Nessun altro motore o idea dello studio.
4. Mac DMG non firmato e guida con titolo esatto: pubblicati entrambi e verificati con download anonimo/SHA-256, CI verde. Nessuna prova su computer fisici.
5. Release ordinaria CosmOffice 0.2.2 (anteprima): pubblicata e verificata con download anonimo di Windows, Linux e due DMG Mac e SHA-256, dopo la correzione DIST-001. Checksum, limiti e domande ai tester inclusi nelle note dal CHANGELOG. Screenshot riproducibili e successivo updater nel main completati separatamente.
6. Licenza utenti: A adottata in [LICENSE](../LICENSE) il 22 novembre 2026; B conservata in [LICENZA-BOZZE.md](LICENZA-BOZZE.md) e non adottata. Titolare e recapito forniti: Daniele Spalletti (danielespalletti@cosmonet.info). Revisione professionale ancora necessaria; inclusione nei nuovi pacchetti 0.2.3 verificata su NSIS Windows e bloccante per AppImage/DMG in CI. Nessuna redistribuzione installer; link ufficiale condivisibile. Release 0.2.2 invariata, ancora con l’assetto precedente e senza il file della licenza propria nel payload.

Le altre proposte rimangono sospese; nessun motore scelto.
