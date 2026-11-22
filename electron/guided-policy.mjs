export const guidedTests = Object.freeze([
  { id: 'install', label: 'Installazione', instruction: 'Installa o avvia il pacchetto e controlla che compaia la pagina iniziale.' },
  { id: 'word', label: 'Word', instruction: 'Apri un DOCX, modifica una frase, salva una copia e riaprila.' },
  { id: 'excel', label: 'Excel', instruction: 'Apri un XLSX, modifica una cella e una formula, salva una copia e riaprila.' },
  { id: 'charts', label: 'Grafici', instruction: 'Crea un grafico da un intervallo, cambia un valore, salva il foglio e riaprilo.' },
  { id: 'pdf', label: 'PDF', instruction: 'Apri un PDF non protetto, ruota una pagina, salva una copia e riaprila.' },
  { id: 'offline', label: 'Offline', instruction: 'Scollega Internet e prova ad aprire, modificare e salvare una copia di un file.' },
  { id: 'spelling', label: 'Ortografia', instruction: 'Con il controllo attivo, scrivi “casa” e “zzqerrore”: soltanto la seconda parola deve essere sottolineata.' },
  { id: 'report', label: 'Segnalazione', instruction: 'Leggi il rapporto, copialo e verifica di poterlo incollare. L’app non lo invia.' },
]);
export const guidedChoices = Object.freeze(['Ok', 'Problema', 'Non provato']);
export function validateGuided(value) {
  return Object.fromEntries(guidedTests.map(({ id }) => [id, value && Object.hasOwn(value, id) && guidedChoices.includes(value[id]) ? value[id] : 'Non provato']));
}
export function guidedLines(value) {
  const clean = validateGuided(value);
  return guidedTests.map(({ id, label }) => `${label}: ${clean[id]}`);
}
