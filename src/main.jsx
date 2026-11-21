import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './pdf.css';

class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <div className="fatal"><img src="./brand/suite.svg" alt=""/><h1>Non è stato possibile aprire questa schermata.</h1><p>Le bozze già salvate rimangono sul dispositivo.</p><button onClick={() => location.reload()}>Riapri CosmOffice</button><details><summary>Dettagli</summary>{this.state.error.message}</details></div>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<Boundary><App /></Boundary>);
