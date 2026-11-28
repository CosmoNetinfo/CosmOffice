# Stato delle ultime CI

## 7705967 — primo collaudo Android completo verde

[Android 46110959197](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959197) completed/success: tutti otto i casi nativi, quattro export verificati indipendentemente, tre originali invariati, appunti reali e blocco rete. Release unsigned della CI identico alla fonte della firma locale; 240 file del payload identici dopo firma. Le sette PNG esistono ma alcune mostrano frame precedenti: non certificano il collaudo visivo completo e non diventano anteprime nel README. [Desktop 46110959196](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959196) tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS. I tentativi falliti restano documentati sotto.

## 32232a6 — immissione Android B3

[Desktop 46063967642](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967642): tutti sei i lavori completed/success osservati, compresa installazione/disinstallazione NSIS. [Android 46063967606](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46063967606): failure durante input B3 prima dell’export; Home/DOCX PASS, schermata finale Home. Nessun esito PDF/MD dedotto da questa run. Artifact SHA-256 verificato, causa precisa dell’uscita dall’editor non dimostrata. Driver reso più verificabile, non ancora provato nella nuova CI.

## f60184a — PDF Android passato, suite incompleta

[Desktop 46061575262](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575262): sei lavori completed/success osservati. [Android 46061575296](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46061575296): tentativo 1 failure, ANR Pixel Launcher sopra il selettore; tentativo 2 failure al modello Markdown dopo Home/DOCX/XLSX/PDF PASS. Gli export veri superano SDK/lettori indipendenti, ma nessuna CI Android completa verde ancora osservata. Driver aggiornato sul titolo del modello, senza cambiare app o attese di salvataggio.

## effae92 — diagnosi PDF Android

[Android 46059522929](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522929) failure: WebView 124.0.6367.219, URL.parse assente nel caricamento PDF. La causa è confermata dalla diagnostica sul campione originale, non dedotta dal timeout. Desktop [46059522912](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46059522912) tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS. Nel passo successivo distribuzione PDF.js legacy della stessa versione per il solo Android, con regressione browser separata e gli otto casi nativi sempre obbligatori.

## 4912020 — settimo collaudo Android

[Desktop 46056425321](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425321): tutti sei i lavori completed/success osservati, inclusa installazione/disinstallazione NSIS nel runner. [Android 46056425324](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46056425324): failure sul PDF, dopo Home/DOCX/XLSX PASS. Mammoth ed ExcelJS hanno verificato i due file effettivamente esportati. Nessun collaudo fisico dedotto.

## 7e9f9c7 — sesto collaudo Android

[Android 46053874675](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874675) failure: DOCX round trip PASS, XLSX fermato al controllo B2. [Desktop 46053874698](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46053874698) tutti sei i lavori completed/success osservati, compresa NSIS nel runner. Non confondere il passaggio del DOCX con il collaudo di tutta la suite Android.

## f48c5b9 — esiti osservati

[Desktop 46051701838](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701838): tutti sei i lavori success, compresa NSIS installata/disinstallata. [Android 46051701831](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46051701831): failure durante l’apertura DOCX; il nuovo tocco del driver non apre il documento. Ripristino dell’azione di accessibilità e verifica sul risultato reale in corso; APK non collaudato completamente.

## Stato osservato dopo la ripresa — 27 novembre 2026

- 427942b: [desktop 46016839517](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839517), tutti sei success inclusa NSIS; [Android 46016839526](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46016839526), failure su azione SAVE del test, storage/Home e screenshot provati.
- a57fed7: [desktop 46014692885](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692885) osservata cancelled dopo il push successivo, non verde. Android 46014692576 failure già documentata.
- Correzione in corso: tocchi nel selettore reale con nome confermato; nuovo esito nativo ancora da osservare.

## Terzo collaudo Android — a57fed7

[46014692576](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692576) failure nella copia dei campioni: nessun test nativo eseguito. AND-005 riaperto. CI desktop [46014692885](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46014692885) in verifica, esito aggiornato nel report prima del push. Per d3f9aef la CI desktop 46012068280 è stata poi osservata con tutti sei lavori success, inclusa installazione/disinstallazione NSIS.

## Android — verifica del 27 novembre 2026

- 9421c6a: [CI desktop 46009717586](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717586) osservata con tutti sei lavori success, inclusa NSIS installata/disinstallata nel runner. [Android 46009717455](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46009717455) failure prima dell’installazione, adb push respinto.
- d3f9aef: [Android 46012068702](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068702) failure. Preparazione superata e Home/permessi PASS; DOCX fermato alla riapertura, nome atteso non trovato. [CI desktop 46012068280](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46012068280) tutti sei lavori completed/success osservati prima del push, inclusa NSIS nel runner.
- In corso: attesa esplicita della finestra DocumentsUI nel test e raccolta screenshot da file privati. Nessun esito nativo completo dichiarato.

Il report precedente elencava CI.md tra i modificati, ma quell’inserimento non era stato applicato per la differenza CRLF: questa sezione lo corregge esplicitamente.

Verifica del 25 novembre 2026: aggiunta la run della preparazione 0.2.3; i risultati storici restano riferiti alle verifiche precedenti. I lavori delle run sotto sono stati interrogati su GitHub; verde non equivale a installazione fisica o fedeltà Office completa.

| Commit | Build principale | Esito dei lavori |
| --- | --- | --- |
| dfa6c7e, controllo DMG corretto | [45608286556](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45608286556) | 6/6 success, inclusa installazione/disinstallazione NSIS |
| bbad3f6, preparazione Release 0.2.3 | [45606070290](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45606070290) | 6/6 success, inclusa installazione/disinstallazione NSIS |
| 1472135, Markdown | [45600226920](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45600226920) | checks, interop, Windows, Linux, Mac e NSIS installato: 6/6 success |
| 6534f41, preparazione 0.2.3 | [45086811898](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45086811898) | checks, interop, Windows, Linux, Mac e installazione/disinstallazione NSIS: 6/6 success |
| a9b754b, dati titolare | [45078553609](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45078553609) | checks, interop, Windows, Linux, Mac: 5/5 success |
| 4180acd, adozione A | [45075768129](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45075768129) | checks, interop, Windows, Linux, Mac: 5/5 success |
| e775fb0, bozze di licenza | [45063906266](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45063906266) | checks, interop, Windows, Linux, Mac: 5/5 success |
| 06945c6, updater TLS Node | [45056887388](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45056887388) | checks, interop, Windows, Linux, Mac: 5/5 success; rete Linux e rete/consenso nel pacchetto Windows superati |
| 8ff6d8d, DMG Mac | [45050553763](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45050553763) | checks, interop, Windows, Linux, Mac: 5/5 success |
| 5ee891b, screenshot | [45048363758](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45048363758) | checks, interop, Windows, Linux, Mac: 5/5 success |
| b769647, correzione Linux | [45047079340](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079340) | 5/5 success |
| 2128469, Release | [45035934913](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035934913) | 5/5 success |
| 94d93db, studio ArtCraft | [45034728552](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45034728552) | 5/5 success |
| e0fe801, prova guidata | [45022833708](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45022833708) | 5/5 success |
| e8faf0b, rapporto breve | [45020926005](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45020926005) | 5/5 success |
| 9e3173e, rapporto tester | [45015464220](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45015464220) | 5/5 success |
| 5a493a4, SDK | [45011842835](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45011842835) | 5/5 success |
| 3185603, studio suite | [45007101728](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45007101728) | 5/5 success |

## Pubblicazione

- Tag v0.2.2: [45035965421](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45035965421), quattro lavori success. DIST-001 iniziale: solo Windows pubblicato per il nome inatteso dell’AppImage, nonostante la CI verde.
- Completamento Linux b769647: [45047079344](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45047079344), success. Entrambi gli installer scaricati senza account e checksum verificati; Windows invariato. Release ordinaria pubblica e raggiunta da /releases/latest.
- DMG Mac 8ff6d8d: [45050553680](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45050553680), entrambi i lavori architettura e pubblicazione success. hdiutil/lipo/assenza Developer ID verificati in CI. DMG scaricati senza account, SHA-256 uguali a riepilogo/sidecar/digest GitHub; Windows e Linux invariati.
- Updater 06945c6: [45056887388](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45056887388), cinque lavori success verificati dopo il push. Non incluso nei pacchetti pubblici 0.2.2; nessun tag nuovo.

Gli screenshot del README sono già stati verificati dopo il push: nove PNG HTTP 200, byte identici ai file locali, riferimenti presenti nella pagina GitHub pubblica. Nessun computer pulito o Mac fisico collaudato.

Release v0.2.3, run [45606125748](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45606125748): controllo comune, Windows, Linux e pubblicazione riusciti; due job Mac falliti nel controllo risorse per file dell’altra architettura mancante. Release ordinaria inizialmente Windows/Linux; completamento Mac [45608286513](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45608286513) riuscito in tutti e tre i lavori. Tutti e quattro gli installer pubblici sono stati scaricati senza account con hash verificati. Tag invariato.

## CI osservata prima dell’updater Android build 3

Commit 045cea6: [desktop 46119064190](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064190), sei lavori success. [Android 46119064203](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46119064203), tentativo 1 fallito per ANR del Pixel Launcher sopra DocumentsUI; tentativo 2 success con otto casi. L’ANR è stato controllato nella cattura, non nascosto. Nuovo commit updater: run ancora da avviare al momento della scrittura; esito sarà registrato dopo osservazione.

[Android 46124354250](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354250), commit 6bcefd6: failure. Nove casi passati; Unable to find instrumentation info nella fase upgrade. Manifesto generato ha un solo runner; correzione nelle sole modalità del test. [Desktop 46124354242](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46124354242): sei lavori completed/success, compresa installazione NSIS nel runner.

Commit e516616: [desktop 46125501770](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501770) sei success. [Android 46125501778](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46125501778) due failure: Pixel Launcher e Messages, catture verificate. Corretto solo recupero circoscritto dei dialoghi esterni nel test; nessuna dichiarazione di installazione/updater live provati.
