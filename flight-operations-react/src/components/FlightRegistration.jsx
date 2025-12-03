import { useState } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import '../styles/FlightRegistration.css';

const FlightRegistration = () => {
  const { flights, addFlight, removeFlight } = useFlightContext();
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      <div className="registration-container">
        <div className="registration-form-section">
          <h2>Cadastro de Voo</h2>
          <form onSubmit={handleSubmit} className="flight-form">
            <div className="form-grid">
              {/* Data e Horários */}
              <div className="form-group">
                <label>Data do Voo *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horário Partida (LT)</label>
                <input
                  type="time"
                  name="departLT"
                  value={formData.departLT}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Horário Chegada (LT)</label>
                <input
                  type="time"
                  name="arriveLT"
                  value={formData.arriveLT}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tempo de Voo</label>
                <input
                  type="text"
                  name="flightTime"
                  value={formData.flightTime}
                  onChange={handleInputChange}
                  placeholder="Ex: 02:30"
                />
              </div>

              {/* Origem */}
              <div className="form-group">
                <label>ICAO Origem *</label>
                <input
                  type="text"
                  name="fromIcao"
                  value={formData.fromIcao}
                  onChange={handleInputChange}
                  placeholder="Ex: SBSP"
                  maxLength="4"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Nome do Aeroporto de Origem</label>
                <input
                  type="text"
                  name="fromName"
                  value={formData.fromName}
                  onChange={handleInputChange}
                  placeholder="Ex: Congonhas - São Paulo"
                />
              </div>

              {/* Destino */}
              <div className="form-group">
                <label>ICAO Destino *</label>
                <input
                  type="text"
                  name="toIcao"
                  value={formData.toIcao}
                  onChange={handleInputChange}
                  placeholder="Ex: SBRJ"
                  maxLength="4"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Nome do Aeroporto de Destino</label>
                <input
                  type="text"
                  name="toName"
                  value={formData.toName}
                  onChange={handleInputChange}
                  placeholder="Ex: Santos Dumont - Rio de Janeiro"
                />
              </div>

              {/* Informações da Aeronave */}
              <div className="form-group">
                <label>Prefixo da Aeronave *</label>
                <input
                  type="text"
                  name="acReg"
                  value={formData.acReg}
                  onChange={handleInputChange}
                  placeholder="Ex: PR-ABC"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Aeronave</label>
                <input
                  type="text"
                  name="acType"
                  value={formData.acType}
                  onChange={handleInputChange}
                  placeholder="Ex: Citation XLS+"
                />
              </div>

              <div className="form-group">
                <label>Restrições da Aeronave</label>
                <input
                  type="text"
                  name="acRest"
                  value={formData.acRest}
                  onChange={handleInputChange}
                  placeholder="Ex: Max 8 PAX"
                />
              </div>

              {/* Outras Informações */}
              <div className="form-group">
                <label>Número do Voo</label>
                <input
                  type="text"
                  name="flightNo"
                  value={formData.flightNo}
                  onChange={handleInputChange}
                  placeholder="Ex: PA001"
                />
              </div>

              <div className="form-group">
                <label>Número de Passageiros</label>
                <input
                  type="number"
                  name="pax"
                  value={formData.pax}
                  onChange={handleInputChange}
                  placeholder="Ex: 6"
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label>Observações</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notas adicionais sobre o voo..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Cadastrar Voo
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Voos Futuros */}
        <div className="flights-list-section">
          <h2>Voos Futuros ({futureFlights.length})</h2>
          
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
    </div>
  );
};

export default FlightRegistration;
