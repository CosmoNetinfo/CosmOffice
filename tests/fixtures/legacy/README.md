# Grafici della precedente anteprima

`grafici-categorie-v1.xlsx` è stato creato dall'interfaccia CosmOffice 0.2.2
prima della rimozione del foglio tecnico, durante le prove del commit 405a613.
È un campione reale generato dall'app, non da Microsoft Excel.

SHA-256: `32f78da3b5c628b67671d34a7f578ab3366ce585658e85f7a4c6934581fcfc0a`.

Tre grafici condividono A1:B3. A2 contiene “Gennaio”; la categoria del grafico
a barre è invece “Gennaio personalizzato”, conservata nel foglio veryHidden.
Linee e torta usano “Gennaio”. Il test deve conservare entrambe le informazioni,
aprire il file in sola lettura ed esportare soltanto i byte originali.

Questo campione aggiuntivo non modifica i 13 file del manifest del corpus.
