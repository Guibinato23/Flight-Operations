import { useState } from 'react';
import { FlightProvider } from './contexts/FlightContext';
import FlightBrief from './components/FlightBrief';
import Passengers from './components/Passengers';
import FlightRegistration from './components/FlightRegistration';
import FlightCoordination from './components/FlightCoordination';
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
            title="Cadastro de Voos"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
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
            className={`sidebar-icon ${activeTab === 'coordination' ? 'active' : ''}`}
            onClick={() => setActiveTab('coordination')}
            title="Coordenação de Voos"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
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
          {activeTab === 'cadastro' && <FlightRegistration />}
          {activeTab === 'flightbrief' && <FlightBrief />}
          {activeTab === 'coordination' && <FlightCoordination />}
          {activeTab === 'passengers' && <Passengers />}
        </div>
      </div>
    </FlightProvider>
  );
}

export default App;
