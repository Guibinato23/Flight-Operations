import { useState } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import '../styles/FlightRegistration.css';

const FlightRegistration = () => {
  const { 
    flights, 
    addFlight, 
    removeFlight, 
    aircraft, 
    addAircraft, 
    removeAircraft 
  } = useFlightContext();
  
  const [formData, setFormData] = useState({
    date: '',
    departLT: '',
    arriveLT: '',
    fromIcao: '',
    fromName: '',
    toIcao: '',
    toName: '',
    pax: '',
    flightTime: '',
    flightNo: '',
    acType: '',
    acReg: '',
    acRest: '',
    notes: ''
  });

  const [aircraftForm, setAircraftForm] = useState({
    acReg: '',
    acType: '',
    acRest: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAircraftChange = (e) => {
    const { name, value } = e.target;
    setAircraftForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAircraftSubmit = (e) => {
    e.preventDefault();
    
    if (!aircraftForm.acReg) {
      alert('Por favor, insira o prefixo da aeronave');
      return;
    }

    // Verifica se o prefixo já existe
    if (aircraft.some(ac => ac.acReg.toLowerCase() === aircraftForm.acReg.toLowerCase())) {
      alert('Este prefixo já está cadastrado');
      return;
    }

    addAircraft(aircraftForm);
    setAircraftForm({ acReg: '', acType: '', acRest: '' });
    alert('Aeronave cadastrada com sucesso!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.fromIcao || !formData.toIcao || !formData.acReg) {
      alert('Por favor, preencha pelo menos: Data, Origem, Destino e Prefixo da aeronave');
      return;
    }

    addFlight(formData);
    
    // Limpa o formulário
    setFormData({
      date: '',
      departLT: '',
      arriveLT: '',
      fromIcao: '',
      fromName: '',
      toIcao: '',
      toName: '',
      pax: '',
      flightTime: '',
      flightNo: '',
      acType: '',
      acReg: '',
      acRest: '',
      notes: ''
    });

    alert('Voo cadastrado com sucesso!');
  };

  // Filtra voos futuros e ordena por data
  const futureFlights = flights
    .filter(flight => new Date(flight.date) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flight-registration">
      {/* Header com Logo */}
      <div className="page-header">
        <img src="/Logo.png" alt="Logo" className="page-logo" />
        <div className="page-header-divider"></div>
      </div>

      {/* Cadastro de Voo */}
      <div className="registration-section">
        <h2>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          Cadastro de Voo
        </h2>
        <form onSubmit={handleSubmit} className="flight-form">
          <div className="form-row">
            <div className="form-group">
              <label>Data *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Partida (LT)</label>
              <input
                type="time"
                name="departLT"
                value={formData.departLT}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Chegada (LT)</label>
              <input
                type="time"
                name="arriveLT"
                value={formData.arriveLT}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Tempo Voo</label>
              <input
                type="text"
                name="flightTime"
                value={formData.flightTime}
                onChange={handleInputChange}
                placeholder="Ex: 02:30"
              />
            </div>

            <div className="form-group">
              <label>ICAO Origem *</label>
              <input
                type="text"
                name="fromIcao"
                value={formData.fromIcao}
                onChange={handleInputChange}
                placeholder="SBSP"
                maxLength="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Nome Origem</label>
              <input
                type="text"
                name="fromName"
                value={formData.fromName}
                onChange={handleInputChange}
                placeholder="Congonhas - São Paulo"
              />
            </div>

            <div className="form-group">
              <label>ICAO Destino *</label>
              <input
                type="text"
                name="toIcao"
                value={formData.toIcao}
                onChange={handleInputChange}
                placeholder="SBRJ"
                maxLength="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Nome Destino</label>
              <input
                type="text"
                name="toName"
                value={formData.toName}
                onChange={handleInputChange}
                placeholder="Santos Dumont - RJ"
              />
            </div>

            <div className="form-group">
              <label>Prefixo *</label>
              <input
                type="text"
                name="acReg"
                value={formData.acReg}
                onChange={handleInputChange}
                placeholder="PR-ABC"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo Aeronave</label>
              <input
                type="text"
                name="acType"
                value={formData.acType}
                onChange={handleInputChange}
                placeholder="Citation XLS+"
              />
            </div>

            <div className="form-group">
              <label>Restrições</label>
              <input
                type="text"
                name="acRest"
                value={formData.acRest}
                onChange={handleInputChange}
                placeholder="Max 8 PAX"
              />
            </div>

            <div className="form-group">
              <label>Nº Voo</label>
              <input
                type="text"
                name="flightNo"
                value={formData.flightNo}
                onChange={handleInputChange}
                placeholder="PA001"
              />
            </div>

            <div className="form-group">
              <label>PAX</label>
              <input
                type="number"
                name="pax"
                value={formData.pax}
                onChange={handleInputChange}
                placeholder="6"
                min="0"
              />
            </div>

            <div className="form-group wide">
              <label>Observações</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notas adicionais..."
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Cadastrar Voo
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Gerenciamento de Aeronaves */}
      <div className="aircraft-section">
        <h2>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          Prefixos Cadastrados ({aircraft.length})
        </h2>

        <form onSubmit={handleAircraftSubmit} className="aircraft-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prefixo *</label>
              <input
                type="text"
                name="acReg"
                value={aircraftForm.acReg}
                onChange={handleAircraftChange}
                placeholder="PR-ABC"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <input
                type="text"
                name="acType"
                value={aircraftForm.acType}
                onChange={handleAircraftChange}
                placeholder="Citation XLS+"
              />
            </div>

            <div className="form-group">
              <label>Restrições</label>
              <input
                type="text"
                name="acRest"
                value={aircraftForm.acRest}
                onChange={handleAircraftChange}
                placeholder="Max 8 PAX"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </form>

        {aircraft.length > 0 && (
          <div className="aircraft-table">
            <table>
              <thead>
                <tr>
                  <th>Prefixo</th>
                  <th>Tipo</th>
                  <th>Restrições</th>
                  <th width="60"></th>
                </tr>
              </thead>
              <tbody>
                {aircraft.map((ac) => (
                  <tr key={ac.id}>
                    <td className="aircraft-reg">{ac.acReg}</td>
                    <td>{ac.acType || '-'}</td>
                    <td>{ac.acRest || '-'}</td>
                    <td>
                      <button
                        className="btn-delete-small"
                        onClick={() => removeAircraft(ac.id)}
                        title="Remover"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lista de Voos Futuros */}
      <div className="flights-list-section">
        <h2>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Voos Futuros ({futureFlights.length})
        </h2>
        
        {futureFlights.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <p>Nenhum voo futuro cadastrado</p>
          </div>
        ) : (
          <div className="flights-list">
            {futureFlights.map((flight) => (
              <div key={flight.id} className="flight-card">
                <div className="flight-header">
                  <div className="flight-route">
                    <span className="icao">{flight.fromIcao}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    <span className="icao">{flight.toIcao}</span>
                  </div>
                  <button 
                    className="btn-delete"
                    onClick={() => removeFlight(flight.id)}
                    title="Remover voo"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                <div className="flight-details">
                  <div className="detail-row">
                    <span className="label">Data:</span>
                    <span className="value">{formatDate(flight.date)}</span>
                  </div>
                  
                  {flight.departLT && (
                    <div className="detail-row">
                      <span className="label">Partida:</span>
                      <span className="value">{flight.departLT} LT</span>
                    </div>
                  )}
                  
                  {flight.arriveLT && (
                    <div className="detail-row">
                      <span className="label">Chegada:</span>
                      <span className="value">{flight.arriveLT} LT</span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="label">Aeronave:</span>
                    <span className="value aircraft">{flight.acReg}</span>
                  </div>

                  {flight.acType && (
                    <div className="detail-row">
                      <span className="label">Tipo:</span>
                      <span className="value">{flight.acType}</span>
                    </div>
                  )}

                  {flight.pax && (
                    <div className="detail-row">
                      <span className="label">PAX:</span>
                      <span className="value">{flight.pax}</span>
                    </div>
                  )}

                  {flight.flightNo && (
                    <div className="detail-row">
                      <span className="label">Voo:</span>
                      <span className="value">{flight.flightNo}</span>
                    </div>
                  )}

                  {flight.notes && (
                    <div className="detail-row notes">
                      <span className="label">Obs:</span>
                      <span className="value">{flight.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightRegistration;
