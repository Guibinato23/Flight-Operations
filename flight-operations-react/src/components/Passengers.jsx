import { useState } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import '../styles/Passengers.css';

const Passengers = () => {
  const {
    passengers,
    addPassenger,
    updatePassenger,
    removePassenger
  } = useFlightContext();

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar passageiros por nome
  const filteredPassengers = passengers.filter(pax =>
    pax.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="passengers-container">
      {/* Header com Logo */}
      <div className="page-header">
        <img src="/Logo.png?v=2" alt="Logo" className="page-logo" />
        <div className="page-header-divider"></div>
      </div>

      <div>
        {/* Seção: Adicionar Passageiro */}
        <div className="passengers-add-section">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Adicionar Passageiro
          </h2>
          <button className="btn primary" onClick={addPassenger}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Passageiro
          </button>
        </div>

        {/* Seção: Lista de Passageiros */}
        <div className="passengers-list-section">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Passageiros Cadastrados ({searchTerm ? `${filteredPassengers.length} de ${passengers.length}` : passengers.length})
          </h2>

          {/* Campo de Pesquisa */}
          {passengers.length > 0 && (
            <div className="passengers-search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  title="Limpar pesquisa"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {passengers.length === 0 ? (
            <div className="empty-state-passengers">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>Nenhum passageiro cadastrado</p>
              <span>Clique em "Novo Passageiro" para adicionar</span>
            </div>
          ) : filteredPassengers.length === 0 ? (
            <div className="empty-state-passengers">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <p>Nenhum resultado encontrado</p>
              <span>Tente pesquisar com outro nome</span>
            </div>
          ) : (
            <div className="passengers-table-container">
              <table className="passengers-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>DOB</th>
                    <th>Passaporte</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPassengers.map((pax) => {
                    // Encontrar o índice real no array original
                    const realIndex = passengers.findIndex(p => p === pax);
                    return (
                      <tr key={realIndex}>
                        <td>
                          <input
                            type="text"
                            value={pax.name || ''}
                            onChange={(e) => updatePassenger(realIndex, 'name', e.target.value)}
                            placeholder="Nome completo"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={pax.dob || ''}
                            onChange={(e) => updatePassenger(realIndex, 'dob', e.target.value)}
                            placeholder="Data de nascimento"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={pax.passport || ''}
                            onChange={(e) => updatePassenger(realIndex, 'passport', e.target.value)}
                            placeholder="Número do passaporte"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={pax.exp || ''}
                            onChange={(e) => updatePassenger(realIndex, 'exp', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => removePassenger(realIndex)}
                            title="Remover passageiro"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {passengers.length > 0 && (
            <div className="passengers-summary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>Total de passageiros cadastrados: <strong>{passengers.length}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Passengers;
