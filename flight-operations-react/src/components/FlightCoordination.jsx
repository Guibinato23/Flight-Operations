import { useState, useMemo } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import '../styles/FlightCoordination.css';

const FlightCoordination = () => {
  const { flights, aircraft } = useFlightContext();
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date());

  // Gera as datas para o eixo X baseado no modo de visualização
  const dateRange = useMemo(() => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Começa no domingo
    
    const days = viewMode === 'week' ? 7 : 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }, [currentDate, viewMode]);

  // Agrupa voos por prefixo e data
  const flightsByAircraftAndDate = useMemo(() => {
    const grouped = {};
    
    aircraft.forEach(ac => {
      grouped[ac.acReg] = {};
    });

    flights.forEach(flight => {
      if (!grouped[flight.acReg]) {
        grouped[flight.acReg] = {};
      }
      
      const dateKey = flight.date;
      if (!grouped[flight.acReg][dateKey]) {
        grouped[flight.acReg][dateKey] = [];
      }
      grouped[flight.acReg][dateKey].push(flight);
    });

    return grouped;
  }, [flights, aircraft]);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const formatWeekday = (date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - (viewMode === 'week' ? 7 : 30));
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (viewMode === 'week' ? 7 : 30));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flight-coordination">
      <div className="coordination-header">
        <h1>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Coordenação de Voos
        </h1>

        <div className="coordination-controls">
          <div className="view-mode-toggle">
            <button 
              className={viewMode === 'week' ? 'active' : ''}
              onClick={() => setViewMode('week')}
            >
              Semana
            </button>
            <button 
              className={viewMode === 'month' ? 'active' : ''}
              onClick={() => setViewMode('month')}
            >
              Mês
            </button>
          </div>

          <div className="date-navigation">
            <button onClick={goToPreviousPeriod} className="btn-nav">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button onClick={goToToday} className="btn-today">
              Hoje
            </button>
            <button onClick={goToNextPeriod} className="btn-nav">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {aircraft.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          <p>Nenhuma aeronave cadastrada</p>
          <small>Vá para a aba "Cadastro" para adicionar aeronaves</small>
        </div>
      ) : (
        <div className="coordination-grid-container">
          <div className="coordination-grid">
            {/* Header com datas */}
            <div className="grid-header">
              <div className="aircraft-column-header">Aeronave</div>
              <div className="dates-header">
                {dateRange.map((date, index) => (
                  <div 
                    key={index} 
                    className={`date-cell ${isToday(date) ? 'today' : ''}`}
                  >
                    <div className="date-day">{formatWeekday(date)}</div>
                    <div className="date-date">{formatDate(date)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linhas de aeronaves */}
            <div className="grid-body">
              {aircraft.map((ac) => (
                <div key={ac.id} className="aircraft-row">
                  <div className="aircraft-cell">
                    <div className="aircraft-info">
                      <div className="aircraft-reg">{ac.acReg}</div>
                      {ac.acType && <div className="aircraft-type">{ac.acType}</div>}
                    </div>
                  </div>
                  <div className="dates-row">
                    {dateRange.map((date, index) => {
                      const dateKey = getDateKey(date);
                      const flightsOnDate = flightsByAircraftAndDate[ac.acReg]?.[dateKey] || [];
                      
                      return (
                        <div 
                          key={index} 
                          className={`date-slot ${isToday(date) ? 'today' : ''}`}
                        >
                          {flightsOnDate.map((flight, fIndex) => (
                            <div key={fIndex} className="flight-card-mini">
                              <div className="flight-route-mini">
                                <span className="icao-mini">{flight.fromIcao}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                                <span className="icao-mini">{flight.toIcao}</span>
                              </div>
                              {flight.departLT && (
                                <div className="flight-time-mini">{flight.departLT}</div>
                              )}
                              {flight.pax && (
                                <div className="flight-pax-mini">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                                  </svg>
                                  {flight.pax}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {aircraft.length > 0 && (
        <div className="coordination-stats">
          <div className="stat-card">
            <div className="stat-value">{aircraft.length}</div>
            <div className="stat-label">Aeronaves</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{flights.length}</div>
            <div className="stat-label">Voos Totais</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {flights.filter(f => new Date(f.date) >= new Date().setHours(0, 0, 0, 0)).length}
            </div>
            <div className="stat-label">Voos Futuros</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {flights.filter(f => {
                const today = new Date();
                const flightDate = new Date(f.date);
                return flightDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <div className="stat-label">Voos Hoje</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCoordination;
