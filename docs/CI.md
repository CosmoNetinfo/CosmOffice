# Stato delle ultime CI

Verifica del 22 novembre 2026, dopo il commit DMG Mac e prima del commit updater. I lavori delle run sotto sono stati interrogati su GitHub; verde non equivale a installazione fisica o fedeltà Office completa.

| Commit | Build principale | Esito dei lavori |
| --- | --- | --- |
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
- Commit updater successivo: run da controllare dopo il push; nessun risultato futuro dichiarato verde in anticipo.

Gli screenshot del README sono già stati verificati dopo il push: nove PNG HTTP 200, byte identici ai file locali, riferimenti presenti nella pagina GitHub pubblica. Nessun computer pulito o Mac fisico collaudato.
