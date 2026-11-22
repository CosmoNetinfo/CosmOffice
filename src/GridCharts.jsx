import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, PieController, ArcElement, CategoryScale, LinearScale, Legend, Title, Tooltip } from 'chart.js';
import { chartData } from './charts.mjs';
Chart.register(BarController, BarElement, LineController, LineElement, PointElement, PieController, ArcElement, CategoryScale, LinearScale, Legend, Title, Tooltip);
const palette = ['#167d6a', '#2865d8', '#e4a139', '#c8587b', '#7a62be', '#229eb7'];
function ChartCanvas({ book, model, revision }) {
  const canvas = useRef(null), instance = useRef(null);
  const data = chartData(book, model);
  useEffect(() => {
    instance.current?.destroy();
    instance.current = new Chart(canvas.current, { type: model.type, data: { labels: data.labels, datasets: data.series.map((series, index) => ({ label: series.name, data: series.values, backgroundColor: model.type === 'pie' ? data.labels.map((_, i) => palette[i % palette.length]) : palette[index % palette.length], borderColor: palette[index % palette.length], borderWidth: 2, tension: 0 })) }, options: { animation: false, responsive: true, maintainAspectRatio: false, plugins: { title: { display: !!model.title, text: model.title }, legend: { display: model.legend !== 'none', position: model.legend === 'none' ? 'right' : model.legend } }, ...(model.type === 'pie' ? {} : { scales: { x: { title: { display: !!model.axisX, text: model.axisX } }, y: { beginAtZero: true, title: { display: !!model.axisY, text: model.axisY } } } }) } });
    return () => instance.current?.destroy();
  }, [model, revision]);
  return <><div className="chart-canvas"><canvas ref={canvas} role="img" aria-label={`Grafico ${model.title}`}/></div><details><summary>Dati del grafico · {model.start}:{model.end}</summary><table aria-label={`Dati ${model.title}`}><thead><tr><th>Categoria</th>{data.series.map((s, i) => <th key={i}>{s.name}</th>)}</tr></thead><tbody>{data.labels.map((label, row) => <tr key={row}><th>{label}</th>{data.series.map((s, i) => <td key={i}>{s.values[row] ?? '—'}</td>)}</tr>)}</tbody></table></details></>;
}
function ChartCard({ book, model, revision, onChange, onDelete, onError }) {
  const [editing, setEditing] = useState(false), [draft, setDraft] = useState(null);
  return <article className="grid-chart" data-chart-id={model.id}>
    <header><strong>{model.title || 'Grafico senza titolo'}</strong><div><button className="text-tool" onClick={() => { setDraft(structuredClone(model)); setEditing(!editing); }}>Modifica grafico</button><button className="text-tool" onClick={onDelete}>Elimina grafico</button></div></header>
    <ChartCanvas book={book} model={model} revision={revision}/>
    {editing && <form className="chart-settings" onSubmit={event => { event.preventDefault(); try { chartData(book, draft); onChange(draft); setEditing(false); } catch (error) { onError(error.message); } }}>
      <label>Titolo<input aria-label="Titolo del grafico" maxLength={200} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}/></label>
      <label>Tipo<select aria-label="Tipo di grafico" value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}><option value="bar">Barre</option><option value="line">Linee</option><option value="pie">Torta</option></select></label>
      <label>Legenda<select aria-label="Posizione legenda" value={draft.legend} onChange={e => setDraft({ ...draft, legend: e.target.value })}><option value="right">A destra</option><option value="bottom">In basso</option><option value="none">Nascosta</option></select></label>
      <label><input type="checkbox" checked={draft.headers} onChange={e => setDraft({ ...draft, headers: e.target.checked })}/>Prima riga con intestazioni</label>
      <label>Etichetta asse orizzontale<input aria-label="Etichetta asse orizzontale" maxLength={200} value={draft.axisX} onChange={e => setDraft({ ...draft, axisX: e.target.value })}/></label>
      <label>Etichetta asse verticale<input aria-label="Etichetta asse verticale" maxLength={200} value={draft.axisY} onChange={e => setDraft({ ...draft, axisY: e.target.value })}/></label>
      <label>Etichette categorie, una per riga<textarea aria-label="Etichette categorie" value={draft.labels.join('\n')} onChange={e => setDraft({ ...draft, labels: e.target.value.split('\n') })}/></label>
      <label>Nomi nella legenda, uno per serie<textarea aria-label="Nomi delle serie" value={draft.seriesNames.join('\n')} onChange={e => setDraft({ ...draft, seriesNames: e.target.value.split('\n') })}/></label>
      <p>Lascia vuote le etichette per usare le celle. La prima colonna contiene le categorie; la torta usa solo la prima serie numerica. Celle vuote, testo ed errori nelle serie restano senza valore.</p>
      <div><button type="button" className="button secondary" onClick={() => setEditing(false)}>Annulla</button><button className="button primary">Applica grafico</button></div>
    </form>}
  </article>;
}
export default function GridCharts({ book, sheetId, revision, onChange, onDelete, onError }) {
  return <section className="grid-charts" aria-label="Grafici del foglio" onKeyDown={event => event.stopPropagation()} onPaste={event => event.stopPropagation()} onCopy={event => event.stopPropagation()}>{(book.properties.cosmoCharts || []).filter(model => model.sheetId === sheetId).map(model => <ChartCard key={model.id} book={book} model={model} revision={revision} onChange={next => onChange(model.id, next)} onDelete={() => onDelete(model.id)} onError={onError}/>)}</section>;
}
