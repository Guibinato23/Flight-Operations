import { useState } from 'react';
import { FlightProvider } from './contexts/FlightContext';
import FlightBrief from './components/FlightBrief';
import Passengers from './components/Passengers';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('flightbrief');

  return (
    <FlightProvider>
      <div className="app-container">
        <div className="sidebar">
          <div 
            className={`sidebar-icon ${activeTab === 'cadastro' ? 'active' : ''}`}
            onClick={() => setActiveTab('cadastro')}
            title="Cadastro"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div 
            className={`sidebar-icon ${activeTab === 'flightbrief' ? 'active' : ''}`}
            onClick={() => setActiveTab('flightbrief')}
            title="Flight Brief"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div 
            className={`sidebar-icon ${activeTab === 'passengers' ? 'active' : ''}`}
            onClick={() => setActiveTab('passengers')}
            title="Passageiros"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'flightbrief' && <FlightBrief />}
          {activeTab === 'passengers' && <Passengers />}
          {activeTab === 'cadastro' && (
            <div className="tab-content">
              <h1>Cadastro</h1>
              <p>Em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </FlightProvider>
  );
}

export default App;
