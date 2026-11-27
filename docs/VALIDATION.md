# Stato delle verifiche e limiti

## Settimo collaudo Android — DOCX e XLSX passati, PDF non aperto

4912020 / [46056425324](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425324): primi tre casi PASS, quarto fallito prima del rendering PDF. Artifact SHA-256 4230f30380658f4928873c8eb4bc2befbb22d7720548800230146e0f0bf5e8f6 uguale al digest GitHub. Sui file realmente esportati, Mammoth trova «Android verificato.» nel DOCX ed ExcelJS legge B2=701/B3=2 nello XLSX. PDF e Markdown non esportati; appunti/temi/assenza rete finale non raggiunti. Nessuna modifica degli editor per ottenere questi risultati. Il nuovo test diagnostica il rifiuto PDF usando esclusivamente il campione incluso nell’APK di test. Desktop 46056425321 osservata con tutti sei success, inclusa NSIS installata/disinstallata nel runner.

## Sesto collaudo Android — DOCX passato, XLSX da verificare

[46053874675](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874675), 7e9f9c7: Home/permessi e DOCX apertura/modifica/salvataggio/riapertura PASS. XLSX non supera B2=701 dopo riapertura; file android-grid-salvato.xlsx realmente presente (6680 byte). Screenshot prima dell’export: selezione A1 e valori originali, quindi l’immissione del driver non risulta applicata. Nessuna perdita dati attribuita al prodotto senza prova. Driver ora usa tastiera nella finestra pronta e verifica i cambiamenti prima di esportare. La prossima raccolta conserva anche output parziali per analisi indipendente. PDF/MD/appunti non ancora raggiunti.

## Quinto collaudo Android — f48c5b9

[46051701831](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701831) failure: attesa document-page scaduta durante la prima apertura DOCX. Artifact ispezionato: selettore ancora aperto, Home fotografata bianca prima del disegno. SHA-256 ZIP 4dc480a9164ab29c6cf467e8f412b897e421182ed6542258582e9ab83f137210 confrontato e coincidente con GitHub. L’esito DOM non viene presentato come prova visiva di quella cattura. Driver ripristinato su azioni di accessibilità con attesa esito/nome reale; screenshot sincronizzati con il disegno. Nessuna modifica all’app, nessun salvataggio Android dichiarato riuscito. CI desktop [46051701838](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701838): sei lavori completed/success osservati.

## Quarta run Android e correzione del click — 27 novembre 2026

427942b: [Android 46016839526](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839526) failure su SAVE, dopo preparazione e avvio PASS. storage-ready.json: ready true, attempts 2, 1658 ms, primo tentativo Operation not permitted. Screenshot recuperati (Home/Word/errore), artifact ZIP SHA-256 72052f4532df1f675f262a111dbc477b5b7a5e61941980255ed6f3ee7ed92e8f coincidente con GitHub. L’immagine di errore mostra app in elaborazione, non il selettore. Nessun salvataggio dichiarato verificato. Nuovo driver attende nome/controllo disponibile e usa tocco reale; prove complete in attesa. [CI desktop 46016839517](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839517): sei lavori completed/success osservati, inclusa NSIS installata/disinstallata.

## Terza run Android: cold boot ancora instabile — 27 novembre 2026

[46014692576](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692576), a57fed7: preparazione fallita di nuovo (cp: Operation not permitted), nessuna prova dell’app avviata. Artifact letto: storage-failure.log conferma lo stato della cartella ma non prova una causa definitiva. Is-user-unlocked non supportato: sostituito nel solo diagnostico con proprietà CE. Aggiunta verifica operativa della disponibilità storage, con limite 90 secondi, e copia di soli byte; da provare nella nuova CI. L’attesa non sostituisce i confronti SHA o il selettore reale.

## Seconda run Android: Home passa, DOCX incompleto — 27 novembre 2026

Commit d3f9aef, [46012068702](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068702): staging/copia e SHA-256 passati, APK installato e avvio/permessi offline PASS. DOCX aperto e modificato, salvataggio arriva alla conferma, ma il test non trova il nome atteso per la riapertura. XLSX/PDF/MD/appunti non eseguiti in questa run. Artifact ispezionato: rapporto e lint presenti, screenshot assenti. Correzione del test: attendere DocumentsUI prima di cercare EditText, screenshot nei file privati con raccolta obbligatoria e lista Download. Nessun cambiamento al codice dell’app, nessun collaudo nativo completo dichiarato.

## Prima run Android: fallita nella preparazione — 27 novembre 2026

[46009717455](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455), commit 9421c6a355ccd335fcc1fe22ade4eed4de9a533b: build/lint/ispezione APK verdi; adb push in Download fallisce con Operation not permitted. Nessuna delle otto prove native avviata, nessun APK dichiarato collaudato. Variante di preparazione tramite staging e copia shell con confronto SHA-256; nessun controllo funzionale rimosso. Da verificare in CI. Hypervisor Windows presente ma HypervisorPlatform disabilitato: non attivato né modificato il PC.

## Android — 27 novembre 2026

Compilazione reale locale debug, test APK e release unsigned con Gradle; lint bloccante. Ispezione del manifest compilato (zero permessi), identità byte LICENSE/THIRD_PARTY_NOTICES, dizionario, worker e decoder PDF; firma verificata da apksigner e SHA-256. Non dimostra l’apertura dell’APK. Test browser Android con porta simulata separato.

Workflow Android dedicato: emulatore API 35 x86_64, rete guest disattivata prima dell’installazione, vero selettore Android e appunti; DOCX/XLSX/PDF/MD salvati e riaperti e originali confrontati SHA-256. Output indipendenti letti con Mammoth/ExcelJS/pdf-lib e rotazione verificata da Poppler. Questo è un piano automatizzato fino a osservazione della run: **esiti effettivi nel report**, mai dedotti dal YAML.

Non provati: dispositivi fisici, Android 10/16 reali, processi terminati dal sistema, tastiera, orientamenti diversi, poco spazio/memoria e provider cloud. La Release desktop pubblica non cambia.

## Preparazione 0.2.3 — 23 novembre 2026

Nuovi controlli per profilo senza preferenza e vecchio «attivo», clic unico/duplicato, trasporto chiuso dopo controllo, annullamento e opt-in periodico. Informazioni confronta testi con i file locali; IPC rifiuta nomi arbitrari. Ispezione dei pacchetti reali per LICENSE, attribuzioni e versione; non basta la configurazione.

Due ispezioni Windows iniziali fallite sulla copia LICENSE dentro ASAR, benché le risorse esterne fossero corrette. Corretto il filtro di copia, mantenuta la verifica. Output e ripetizioni nel report del passo. Nessuna nuova dipendenza o modifica ai motori/condizioni della licenza. Diagnostica: solo versione browser aggiornata, filtri/formato/prove guidate intatti.

Nuovo lavoro Windows installa e disinstalla davvero nel runner; esiti osservabili soltanto dopo il push. Non simulato localmente. Non prova SmartScreen, UAC con antivirus, utente normale, dialogo file OS o un PC pulito fisico; AppImage in uso e Mac fisico restano non provati. Nessuna Release/tag 0.2.3; la 0.2.2 pubblica non cambia.

Aggiornamento dati del titolare: nome e recapito inseriti su indicazione dell’utente, Daniele Spalletti (danielespalletti@cosmonet.info). Nessuna modifica alle condizioni A, all’app o ai pacchetti; i report storici conservano lo stato precedente. La revisione professionale resta da eseguire. Esiti delle verifiche ripetute nel report del passo.

Passo adozione A del 22 novembre 2026: LICENSE e documentazione aggiornati su istruzione esplicita, senza modificare app, preferenza aggiornamenti, packaging o Release. Audit statico dei quattro installer pubblici con SHA-256 verificati: nessun campo license nel package.json incorporato, nessun file della licenza propria nel payload, avvisi di terzi e lessico separato presenti. Copyright/author restano quelli storici “Cosmonet”. Incoerenze riportate, non corrette in silenzio. Prove reali e output nel report del passo; i dati del titolare ora forniti non costituiscono una verifica legale e la revisione professionale resta necessaria.

Passo bozze di licenza del 22 novembre 2026: nessuna modifica dell’app o di LICENSE. Le prove eseguite prima del push e gli output reali sono nel report del passo. Non si presenta la stesura come approvazione legale; installazioni fisiche e limiti documentali già dichiarati restano invariati. CI del codice updater 06945c6 verificata dopo il push: [45056887388](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45056887388), tutti cinque i lavori success.

Aggiornato il 22 novembre 2026 con il recupero del validatore dopo lo studio (base 3185603). Versione applicativa 0.2.2. Lo studio comparativo resta documentale, non una prova manuale delle suite concorrenti.

## Distinzioni necessarie

- Test funzionali CosmOffice: corpus sintetico di 13 file, più campione storico dei grafici; unit test dopo la prova guidata: 46. Il report di questo passo contiene la nuova esecuzione completa e gli output reali.
- Interoperabilità: LibreOffice apre e risalva i campioni; non equivale a Microsoft Office né a fedeltà visiva universale.
- Conformità: recuperate le correzioni FMT-001/002/003 e il validatore Microsoft Open XML SDK 3.5.1, schema Microsoft365. Controllo bloccante in CI su 13 nuovi esportati, hash invariati dopo la lettura e due controlli negativi. Gli esiti reali della ripresa sono nel report corrente. La validità dello schema non equivale alla fedeltà dei documenti.
- Eccezione storica autorizzata: copia v1 identica, con diagnostica SDK di apertura fallita conservata; nessuna certificazione di apertura in Excel. Non si estende l’eccezione ai nuovi file.
- Ricerca: licenze, funzioni e note di rilascio documentate, non benchmark. Nessun codice copyleft di implementazione consultato; nessuna nuova libreria incorporata.

## Non provato

Microsoft Word/Excel reali sul corpus, confronto visivo completo fra concorrenti, installazione su sistemi puliti, macOS/Linux fisici, grandi documenti reali, tutte le formule, tutti i PDF protetti, crash reali del sistema operativo. Dimensioni e prestazioni comparative non misurate. Aggiornamenti automatici, release pubblica e modifica dei grafici esterni restano da eseguire. Il rapporto tester è stato aggiunto successivamente allo studio; prove e limiti nel report corrente.

## Prove storiche, da non confondere con lo stato aggiornato

# Verifiche dell’anteprima 0.2.2

Eseguite localmente su Windows il 21 novembre 2026.

| Verifica | Esito |
| --- | --- |
| Compilazione Vite | Superata |
| Test del motore, corpus, PDF e guardiano offline | 31 test superati; output completi in `docs/report/ULTIMO.md` |
| Test browser su Chrome | Superati |
| Importazione, modifica ed esportazione DOCX | Superata; testo letto con Mammoth dopo l’esportazione |
| Ripristino bozze dopo ricaricamento | Superato |
| XLSX: modifica, formule, più fogli e dati fuori area | Superato |
| Annullamento modifica cella con Escape | Superato |
| Sanitizzazione HTML importato con script e immagini remote | Superata |
| PDF: rendering, navigazione, zoom, ricerca e copia | Superati; copia confrontata byte per byte |
| Layout pagina iniziale a 390 px | Nessuno scorrimento orizzontale |
| Richieste esterne durante il test browser | Zero |
| Pacchetto Windows x64 non firmato | Avvio e apertura DOCX/XLSX/PDF superati |
| Worker PDF nel pacchetto da file locale | Superato |
| Esportazione PDF tramite IPC su disco | Superata; copia identica all’originale |
| Esportazione documento in PDF nel pacchetto Windows | Superata con printToPDF; output PDF letto dal disco |
| Recupero font/dimensioni/colori DOCX e margini/formato esportati | Superato sui documenti generati di verifica |
| SUMIF, COUNTIF, VLOOKUP, SUMPRODUCT, testo, date e IFERROR | Superati sui casi di prova; non equivalgono a un collaudo completo di 102 funzioni |
| Riferimenti e cicli tra fogli | Superati |
| Virgole decimali italiane e sintassi invariante XLSX | Superate, inclusi riferimenti assoluti dopo salvataggio e riapertura |
| CSV/TSV con virgolette, testo multilinea e decimali italiani | Superati; formule importate come testo |
| Incolla intervalli, annulla/ripristina, rinomina e duplicazione fogli | Superati nel browser |
| Tema, accento, scala, densità e barra laterale | Controlli applicati e preferenze ritrovate dopo ricaricamento |
| Font, margini e ortografia da Impostazioni | Verificati nell’editor |
| Formato numeri, cifre decimali, righe/colonne e linee griglia da Impostazioni | Verificati nell’editor |
| Trova e sostituisci | Superato |
| Backup archivio e ripristino | Superato; nuove copie aggiunte senza sovrascrivere le esistenti |
| Richiesta di conferma svuotamento archivio | Verificata con annullamento e conservazione dei dati |
| Memoria ultima pagina PDF | Superata |
| Stampa PDF | Pagine preparate e richiesta di stampa eseguita contro un’interfaccia simulata; stampante fisica non collaudata |
| Impostazioni su schermo stretto | Verificate a 390 px senza scorrimento orizzontale |
| Export Excel concorrenti | Superati senza modificare il modello aperto |
| Celle unite in export, ripristino modello e duplicazione | Conservate nei test di regressione |
| Formule condivise, date, link e immagini XLSX | Conservati nei casi di prova |
| Errore quota locale | Testo mantenuto in memoria, cambio schermata bloccato, salvataggio riprovato e recupero dopo riavvio |
| DOCX/PDF danneggiati ed estensioni Office incoerenti | Respinti nei casi di prova, senza sostituire il documento attivo o creare nuove bozze |
| Parti Word non supportate | Avviso specifico verificato su un DOCX con commenti; parti di note vuote non producono l’avviso |
| Ripristino con dati non scrivibili | Transazione annullata senza inserimenti parziali |
| Errore di rinomina del file esportato nel pacchetto Windows | Originale conservato byte per byte e file temporaneo rimosso |
| Chiusura dopo notifica di arresto del renderer | Notifica simulata nel test riproducibile; non equivale a certificazione di recupero da tutti i crash |
| Identificativi e precisione | Zeri iniziali e codici oltre 15 cifre conservati come testo dopo esportazione e riapertura XLSX |
| Formato testo, booleani e notazione scientifica | Verificati nei casi di prova; numeri fuori intervallo non vengono convertiti in zero |
| Testo simile a errori e celle di errore effettive | Distinti in IFERROR/ISERROR/ISTEXT/ISBLANK, nell’interfaccia e nei risultati XLSX |
| Celle vuote e stringhe vuote | Distinte nei predicati di calcolo |
| DOCX → ODT → DOCX con LibreOffice | Testo italiano, tabella e carattere riletti dai convertitori di CosmOffice |
| XLSX → ODS → XLSX con LibreOffice | Identificativi, formule, errori, testo, date, celle unite e riferimenti tra fogli conservati nel campione |
| PDF prodotto da LibreOffice | Verificato dal motore di CosmoView |
| Controllo npm audit completo dopo override mirati | Zero vulnerabilità note al momento del controllo |

Gli script riproducibili sono in `scripts/smoke.mjs`, `scripts/preferences-smoke.mjs`, `scripts/reliability-smoke.mjs`, `scripts/desktop-smoke.mjs`, `scripts/interop.mjs` e `tests/`. I rapporti di esecuzione sono generati in `test-results/`, esclusa dal repository; GitHub Actions conserva i rapporti del browser come artefatti.

La build precedente (0.1.0, commit 60a01b5) ha completato con successo test e pacchetti GitHub Actions per Windows, Linux e macOS Intel/Apple Silicon. Anche la 0.2.0 ha completato la pipeline (commit 15bd8f8). Anche la 0.2.1 ha completato la pipeline (commit 4836704). La stessa pipeline, con un controllo aggiuntivo di interoperabilità, viene applicata alla 0.2.2.

Questi test non dimostrano la compatibilità totale Office. Non sono ancora stati collaudati l’installer su un computer pulito, l’avvio delle app macOS/Linux su dispositivi reali, tutte le varianti di PDF protetti, l’OCR, documenti Office complessi o le app mobili. L’aggiornamento online è stato rimosso: si installano pacchetti locali.

Il confronto indipendente locale usa LibreOffice installato su Windows con un profilo di test isolato. È un controllo su file sintetici: non dimostra la compatibilità totale con Microsoft Word o Excel e non misura la fedeltà visiva su documenti complessi. Il rapporto viene salvato in `test-results/interop-report.json`.
# Corpus stabile di solidità

`tests/fixtures/manifest.json` fissa 5 DOCX, 5 XLSX e 3 PDF con SHA-256. `npm run test:browser` comprende `scripts/corpus-smoke.mjs`: modifica e doppio salvataggio/riapertura Word ed Excel, ripristino delle bozze Word e conservazione della sorgente nel backup. Verifica testo, tabelle, elenchi, immagini, intestazioni/piè di pagina, valori, risultati delle formule, formati, fogli, filtri e celle fuori dall’area visibile. Le formule vengono confrontate in sintassi normalizzata: parentesi equivalenti non sono perdite.

Per i PDF si verificano tutte le pagine con il motore, la scansione priva di testo, la navigazione fino a pagina 20 e la copia identica prima delle modifiche. Il corpus ora ruota l’ultima pagina, torna immediatamente alle bozze, ricarica l’app, salva e riapre il PDF modificato; confronta testo, numero pagine e rotazioni di tutte le pagine. Prova anche quota esaurita, blocco della navigazione, esportazione di recupero e nuovo salvataggio della bozza. `tests/pdf-editing.test.mjs` confronta i flussi binari originali di testo, font e immagini e verifica il blocco di un campo firma sintetico; non è una prova di firma crittografica valida o di PDF cifrati reali.

Dopo i test browser, `node scripts/fixtures-office.mjs` apre originali e copie DOCX/XLSX con LibreOffice, produce PDF e controlla i testi attesi con PDF.js. Salva tutte le pagine e fogli di contatto in `test-results/corpus-office-*`, con esito JSON in `test-results/corpus-office-report.json`. In CI il lavoro `interop` scarica gli export del lavoro `checks` prima di questo controllo. Non è una certificazione Microsoft Office.

## Rapporto tester locale

Test di privacy con marcatore riconoscibile nel nome, percorso e contenuto di un PDF; eventi reali renderer/promise non gestiti ed evento main simulato; notifiche simulate di blocco/crash della finestra. Sono verificati anteprima, app e formato, clipboard Windows reale, file locale senza marcatore, riapertura della schermata e svuotamento. Unit test: limite 50, persistenza e controllo dei campi. Le prove del pacchetto e la ripetizione completa sono riportate nel report. Non provati crash reali di Chromium/OS, spegnimento improvviso o cattura di ogni errore prima dell’inizializzazione.

Caso negativo aggiuntivo: una directory al posto del file del registro simula un percorso non scrivibile. Gli eventi restano in memoria, il rapporto segnala il problema e lo svuotamento non restituisce un falso successo.

## Rapporto compatto per Facebook

La prova con 50 eventi usa la classe più lunga ammessa, il testo di categoria più lungo e tre posizioni di traccia. Il rapporto mantiene tutte le 50 righe e soltanto l’ultima traccia, entro 6.144 byte UTF-8. Nessuna garanzia sul limite del servizio Facebook, che può cambiare; l’app non lo contatta. CI 5a493a4: [run 45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835), tutti e cinque i lavori verdi verificati.

CI del rapporto tester 9e3173e321ce5ac60b224fb1344821a5e29ca8f4: [run 45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220), tutti i cinque lavori success verificati, incluse le prove del rapporto in Linux e nel pacchetto Windows.

## Prova guidata

Otto prove, 24 radio, nessun campo editabile libero; scelte persistenti dopo ricaricamento e accesso da Impostazioni/menu. Il test confronta le prime otto righe degli appunti reali con gli esiti scelti e scarta campi/valori arbitrari. Report con 50 eventi più guida: 4.964 byte UTF-8, sotto 6.144. La cattura grafica è eseguita nel browser; la prima acquisizione della finestra Electron nascosta è andata in timeout dopo la verifica degli appunti. Non è dichiarata una prova di installazione reale dall’esito manuale Installazione.

## Studio statico ArtCraft

Ricerca su 80 file bloccati a commit e verifica dei quattro documenti legali a ogni revisione. [Analisi](ricerca/ARTCRAFT.md) e [registro completo](ricerca/CODICE-STUDIATO.md#studio-artcraft-del-22-novembre-2026). Non sono stati eseguiti i test Rust o gli installer dei progetti studiati; nessuna loro dichiarazione di fedeltà è assunta come prova nostra. I test di CosmOffice e i loro output effettivi sono nel report del passo. Nessuna modifica a src/, electron/, scripts/, workflow o LICENSE.

Il trasporto TLS Node per aggiornamenti resta futuro: nessuna verifica del suo download, SHA-256 o installazione viene dichiarata passata. L’ultimo prototipo Chromium attivo aveva NetLog rosso per UDP non autorizzato; l’app attuale usa il blocco rete. Offline-smoke qui prova il comportamento attuale, non quello di un updater non implementato.

## Pubblicazione di anteprima senza firma

La prova reale ha trovato DIST-001 nonostante tutti i lavori della run 45035965421 fossero success: mancava l’asset Linux per il nome x86_64. Test aggiunto sul nome reale e sul completamento: l’installer Windows resta intatto, si aggiunge Linux e si aggiorna il riepilogo; una AppImage con nome diverso fallisce. Questo esempio mostra perché la CI verde non sostituisce il controllo degli asset pubblici.

Test del publisher con API simulate: note estratte dalla versione nel CHANGELOG, piattaforma mancante dichiarata, hash SHA-256 calcolato sui byte, asset caricati prima di rendere pubblica la bozza, flag prerelease falso e make_latest vero. Non sono prove di upload su GitHub o di esecuzione degli installer: la run del tag e il download anonimo saranno verificati separatamente. Nessuna firma richiesta nel percorso normale di anteprima; il controllo esplicito del vecchio percorso firmato rimane separato.

## Schermate README

scripts/screenshots.mjs esercita l’interfaccia browser reale con tre nuovi esempi originali e nove catture. Controlli: tabella e immagine Word, formula e grafico nel foglio, PDF renderizzato, tema scuro applicato, 24 radio guidati, un evento simulato nel rapporto, layout 390 px senza overflow, nessun errore pagina o richiesta esterna, nessun nome utente/percorso nei testi e campi visibili. PNG massimo 1600 px e 600 KB; EXIF/XMP/ICC assenti. Revisione visiva separata. Non è una prova di installazione né un OCR automatico delle immagini. Rigenerazione in SCREENSHOTS.md; esiti reali nel report.

## Verifica pubblica delle immagini

Dopo il push 5ee891b: GET anonima della pagina GitHub renderizzata, nove riferimenti nel README, nove PNG HTTP 200 con Content-Type image/png e confronto byte per byte con i file locali, tutti passati. Esito in test-results/screenshots/github-esiti.json. Nessun percorso del computer necessario per vedere le immagini.

## Mac 0.2.2 pubblicato

Entrambe le architetture e pubblicazione verdi nella run 45050553680; build principale 45050553763 5/5 success. hdiutil, lipo e assenza Developer ID controllati in CI. Download anonimi dei quattro installer e confronti SHA-256 riusciti; Windows/Linux invariati. Nessuna prova su Mac fisico o installazione pulita.

## Updater TLS Node nel main

Unit test di URL/redirect/certificato/intestazioni/byte/cancellazione/consenso e AppImage confinata alla propria APPDIR. Prime prove reali in Electron e pacchetto Windows: download di 128.031.094 byte con hash uguale alla Release, audit Node soltanto github.com/release-assets.githubusercontent.com, zero TCP/UDP/QUIC/DNS e richieste HTTP nel NetLog Chromium. Spento: audit iniziale vuoto e nessuna nuova richiesta dopo lo spegnimento. Host estraneo bloccato prima del contatto.

Consenso nel pacchetto: Annulla e chiusura normale non avviano nulla; conferma per versione, bozze chiuse e nuovo controllo SHA prima dello spy interattivo. Nessun installer realmente eseguito. La prima attesa QA prematura è documentata nel report; i controlli finali e la CI del nuovo commit vengono riportati con esiti effettivi. I pacchetti pubblici 0.2.2 non contengono l’updater.

Non provati installazione Windows completa su computer pulito, sostituzione di una vera AppImage in esecuzione, hardware Mac o arresti improvvisi. Il report per tester conserva messaggi a elenco chiuso: le tracce di rete dettagliate del QA non vengono inviate o incluse automaticamente nel rapporto copiato.

## Markdown — 25 novembre 2026

Due test UTF-8 (BOM/CRLF e rifiuto dei byte invalidi). Smoke browser: creazione, titoli/enfasi/tabelle/codice, sorgente originale in export .md, vuoto dopo rinomina, riapertura delle bozze dopo ricarica, backup, HTML ostile e rete esterna assente, anteprima sospesa oltre 200.000 caratteri, layout ed export a 390px. Smoke Electron e pacchetto Windows: apertura e salvataggio reali via IPC e filesystem, BOM/CRLF, verifiche sorgente/anteprima e audit main vuoti. Selettori file automatizzati; non prova dialoghi manuali Windows né associazioni nel sistema operativo. Controlli aggiunti alla CI main e futura release, senza tag o pubblicazione.

Primi tentativi: contenitore Windows impediva download browser e avvio Electron per ACL del token AppContainer. Ripetuti fuori dal contenitore. Corretti due problemi dello smoke: attesa del montaggio editor dopo ricarica e ripristino viewport desktop dopo prova stretta. Etichetta accessibile esplicita aggiunta al pulsante export anche quando il testo è nascosto. Esiti definitivi nel report, senza ignorare gli errori iniziali.

Esito definitivo locale: 17 comandi exit 0, 72 test unitari passati, browser/Open XML SDK/smoke Electron e pacchetto/NetLog/aggiornamenti/licenze/diagnostica/guida/YAML verdi. Installazione NSIS locale non eseguita; controllo di estrazione sul vero Setup.exe passato. CI del nuovo commit da verificare dopo il push.

## Pubblicazione 0.2.3 — 25 novembre 2026

Preparazione autorizzata dopo il commit 1472135, CI 45600226920 verde in tutti e sei i lavori, inclusa installazione/disinstallazione NSIS reale. Prima del tag si ripetono i controlli locali richiesti. La pipeline tag valida, ricostruisce e pubblica soltanto dopo gli upload; audit pubblico di download e SHA-256 dopo la pubblicazione, senza dichiarare esiti futuri. Nessun nuovo motore, dipendenza o modifica dell’app.

Prima pipeline tag 45606125748: controllo comune e Linux verdi; i job Mac 139180581549 e 139180581749 falliscono con «hdiutil: attach failed - No such file or directory» cercando il DMG dell’altra architettura dopo la build. Correzione del selettore del controllo in main, default sempre su entrambi; completamento Mac da verificare senza spostare v0.2.3.

Release 0.2.3 pubblica ordinaria, id 458039039, con nove asset (quattro installer, quattro sidecar e manifesto). Recupero Mac 45608286513: tre lavori success, controllo delle licenze/ASAR e hdiutil/lipo/assenza Developer ID nei due DMG. Windows/Linux scaricati senza account e SHA uguali a manifesto/sidecar/digest GitHub; vecchia 0.2.2 verificata invariata. Dettagli e audit completo dei quattro file nel report finale.

Audit completo: quattro installer scaricati senza account, SHA-256 identici a manifesto, sidecar e digest GitHub; contenuti delle note uguali al generatore dopo sola normalizzazione CRLF/LF (primo confronto esatto fallito per fine riga Windows). Estratto anche il payload del vero installer Windows scaricato: LICENSE e avvisi byte-identici ai sorgenti, versione 0.2.3, LICENSE presente nell’ASAR. Smoke aggiornamenti post-pubblicazione scarica la 0.2.3 con hash 0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18 e installed false; zero richieste all’avvio e rete spenta al termine.
