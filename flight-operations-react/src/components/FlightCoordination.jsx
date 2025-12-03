import { useState, useMemo } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import '../styles/FlightCoordination.css';

const FlightCoordination = () => {
  const { flights, aircraft, updateFlight } = useFlightContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [editingFlight, setEditingFlight] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    departLT: '',
    pax: '',
    obs: ''
  });

  // Gera as datas para o eixo X (sempre 7 dias - semana)
  const dateRange = useMemo(() => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Começa no domingo
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }, [currentDate]);

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

  // Converte horário (HH:MM) para posição percentual no dia (0-100%)
  const getTimePosition = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / 1440) * 100; // 1440 minutos em um dia
  };

  // Calcula a duração do voo em percentual do dia
  const getFlightDuration = (departTime, arriveTime) => {
    if (!departTime || !arriveTime) return 8; // largura padrão de 8% se não tiver horários
    
    const [depHours, depMinutes] = departTime.split(':').map(Number);
    const [arrHours, arrMinutes] = arriveTime.split(':').map(Number);
    
    const depTotal = depHours * 60 + depMinutes;
    let arrTotal = arrHours * 60 + arrMinutes;
    
    // Se horário de chegada é menor que saída, assumir que chegou no dia seguinte
    if (arrTotal < depTotal) {
      arrTotal += 1440; // adiciona 24 horas
    }
    
    const duration = arrTotal - depTotal;
    const percentage = (duration / 1440) * 100;
    return Math.max(percentage, 8); // mínimo de 8% para visibilidade
  };

  // Simplesmente retorna os voos ordenados por horário
  // Todos ficam na mesma linha horizontal, posicionados pelo horário
  const sortFlightsByTime = (flightsArray) => {
    if (!flightsArray || flightsArray.length === 0) return [];
    
    // Ordena voos por horário de decolagem
    return [...flightsArray].sort((a, b) => {
      const timeA = a.departLT || '00:00';
      const timeB = b.departLT || '00:00';
      return timeA.localeCompare(timeB);
    });
  };

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate('');
  };

  const handleDateFilter = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    if (dateValue) {
      setCurrentDate(new Date(dateValue));
    }
  };

  const clearDateFilter = () => {
    setSelectedDate('');
    setCurrentDate(new Date());
  };

  const handleCardClick = (flight) => {
    setEditingFlight(flight);
    setEditForm({
      date: flight.date,
      departLT: flight.departLT,
      pax: flight.pax || '',
      obs: flight.obs || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = () => {
    if (editingFlight) {
      const updatedFlight = {
        ...editingFlight,
        date: editForm.date,
        departLT: editForm.departLT,
        pax: editForm.pax,
        obs: editForm.obs
      };
      updateFlight(editingFlight.id, updatedFlight);
      setEditingFlight(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingFlight(null);
    setEditForm({
      date: '',
      departLT: '',
      pax: '',
      obs: ''
    });
  };

  return (
    <div className="flight-coordination">
      {/* Header com Logo */}
      <div className="page-header">
        <img src="/Logo.png?v=2" alt="Logo" className="page-logo" />
        <div className="page-header-divider"></div>
      </div>

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
          <div className="date-filter">
            <label htmlFor="date-filter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Filtrar por Data:
            </label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={handleDateFilter}
              className="date-input"
            />
            {selectedDate && (
              <button onClick={clearDateFilter} className="btn-clear-filter" title="Limpar filtro">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
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
                    {/* Escala de horários */}
                    <div className="time-scale">
                      <span className="time-mark">00:00</span>
                      <span className="time-mark">06:00</span>
                      <span className="time-mark">12:00</span>
                      <span className="time-mark">18:00</span>
                      <span className="time-mark">24:00</span>
                    </div>
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
                      const sortedFlights = sortFlightsByTime(flightsOnDate);
                      
                      return (
                        <div 
                          key={index} 
                          className={`date-slot ${isToday(date) ? 'today' : ''}`}
                        >
                          {/* Linhas de grade de horário */}
                          <div className="time-grid-lines">
                            <div className="time-line" style={{left: '0%'}}></div>
                            <div className="time-line" style={{left: '25%'}}></div>
                            <div className="time-line" style={{left: '50%'}}></div>
                            <div className="time-line" style={{left: '75%'}}></div>
                            <div className="time-line" style={{left: '100%'}}></div>
                          </div>
                          
                          {/* Cards de voo posicionados na linha do tempo - todos na mesma linha horizontal */}
                          <div className="flights-container">
                            {sortedFlights.map((flight, fIndex) => {
                              const leftPosition = getTimePosition(flight.departLT);
                              const width = getFlightDuration(flight.departLT, flight.arriveLT);
                              
                              return (
                                <div 
                                  key={fIndex} 
                                  className="flight-card-timeline"
                                  onClick={() => handleCardClick(flight)}
                                  style={{
                                    left: `${leftPosition}%`,
                                    width: `${width}%`,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div className="flight-route-mini">
                                    <span className="icao-mini">{flight.fromIcao}</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="5" y1="12" x2="19" y2="12"></line>
                                      <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                    <span className="icao-mini">{flight.toIcao}</span>
                                  </div>
                                  <div className="flight-times-mini">
                                    {flight.departLT && <span>{flight.departLT}</span>}
                                    {flight.arriveLT && <span>→ {flight.arriveLT}</span>}
                                  </div>
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
                              );
                            })}
                          </div>
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

      {/* Edit Flight Modal */}
      {editingFlight && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Voo</h3>
            <div className="flight-info-header">
              <strong>{editingFlight.fromIcao} → {editingFlight.toIcao}</strong>
              <span>{editingFlight.aircraft}</span>
            </div>
            
            <div className="edit-form">
              <div className="form-group">
                <label>Data</label>
                <input 
                  type="date" 
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label>Horário de Decolagem (LT)</label>
                <input 
                  type="time" 
                  name="departLT"
                  value={editForm.departLT}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label>Passageiros</label>
                <input 
                  type="number" 
                  name="pax"
                  value={editForm.pax}
                  onChange={handleEditChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Observações</label>
                <textarea 
                  name="obs"
                  value={editForm.obs}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSaveEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCoordination;
