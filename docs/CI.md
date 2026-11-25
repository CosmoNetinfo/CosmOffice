# Stato delle ultime CI

Verifica del 25 novembre 2026: aggiunta la run della preparazione 0.2.3; i risultati storici restano riferiti alle verifiche precedenti. I lavori delle run sotto sono stati interrogati su GitHub; verde non equivale a installazione fisica o fedeltà Office completa.

| Commit | Build principale | Esito dei lavori |
| --- | --- | --- |
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

Release v0.2.3, run [45606125748](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/45606125748): controllo comune, Windows, Linux e pubblicazione riusciti; due job Mac falliti nel controllo risorse per file dell’altra architettura mancante. Release ordinaria Windows/Linux osservata su latest; completamento Mac in corso, non ancora dichiarato verde. Tag invariato.
