# Aprire CosmOffice su Mac

**Anteprima senza firma e senza notarizzazione. Versione Mac non collaudata su computer fisici.** Le build CI controllano DMG e architettura; non simulano il primo avvio di un’app scaricata con Gatekeeper.

## Download e primo avvio

Scegli dalla [Release pubblica](https://github.com/CosmoNetinfo/CosmOffice/releases/latest) il DMG mac-x64 per Intel o mac-arm64 per Apple Silicon. Il relativo .sha256 e SHA256SUMS.txt permettono di confrontare l’hash locale, ad esempio con shasum -a 256 seguito dal nome del DMG. Non servono account CosmOffice o GitHub.

Apri l’immagine e copia l’app in Applicazioni; espelli il DMG prima di usare la copia installata. Dopo un tentativo di avvio bloccato, autorizza soltanto questa app da Impostazioni di Sistema, Privacy e sicurezza, Apri comunque; conferma Apri. Il sistema può chiedere l’autenticazione locale. Fonte: [Aprire le app sul Mac in sicurezza, Apple](https://support.apple.com/it-it/102445).

Se compare un avviso di software dannoso o file danneggiato, non aggirarlo. Conserva versione e architettura del pacchetto e segnala l’esito nei commenti del post Facebook di CosmOffice, senza dati personali. Non vengono proposti comandi per disattivare Gatekeeper o rimuovere globalmente controlli di sicurezza. Un computer gestito può vietare l’eccezione.

## Come sono costruiti i DMG

La CI usa electron-builder con identità null, firma non forzata, niente hardened runtime e notarizzazione disabilitata nel percorso di anteprima. Non richiede certificati Apple, account sviluppatore o segreti di firma. I file interni di Electron possono conservare le proprie caratteristiche di distribuzione: non equivalgono alla firma Developer ID di CosmOffice. Nessun certificato CosmOffice viene applicato.

I lavori Intel e Apple Silicon sono separati e non bloccano Windows/Linux. hdiutil verify controlla il DMG; lipo controlla l’architettura dell’eseguibile. Un fallimento viene riportato, senza chiamare provata la piattaforma. Per completare la 0.2.2 si aggiungono solo asset assenti: gli installer Windows/Linux già pubblici non vengono sostituiti.

Non provati hardware Mac reale, Gatekeeper con il download effettivo, apertura dei documenti sul Mac e installazione su sistema pulito. Su Mac non firmato il futuro aggiornamento sarà solo notifica e collegamento al download, senza sostituzione automatica dell’app.
