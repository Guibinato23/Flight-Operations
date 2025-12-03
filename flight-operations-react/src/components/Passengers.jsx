import { useFlightContext } from '../contexts/FlightContext';
import '../styles/Passengers.css';

const Passengers = () => {
  const {
    passengers,
    addPassenger,
    updatePassenger,
    removePassenger
  } = useFlightContext();

  return (
    <div className="passengers-container">
      <div className="passengers-header">
        <h1>Gerenciamento de Passageiros</h1>
        <button className="btn primary" onClick={addPassenger}>
          + Adicionar Passageiro
        </button>
      </div>

      <div className="passengers-table-container">
        <table className="passengers-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Passaporte</th>
              <th>Vencimento</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {passengers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                  Nenhum passageiro cadastrado. Clique em "+ Adicionar Passageiro" para começar.
                </td>
              </tr>
            ) : (
              passengers.map((pax, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={pax.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      placeholder="Nome completo"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={pax.passport}
                      onChange={(e) => updatePassenger(index, 'passport', e.target.value)}
                      placeholder="Número do passaporte"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={pax.exp}
                      onChange={(e) => updatePassenger(index, 'exp', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      value={pax.phone}
                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                      placeholder="Telefone"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removePassenger(index)}
                      title="Remover passageiro"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="passengers-summary">
        <p>Total de passageiros: <strong>{passengers.length}</strong></p>
      </div>
    </div>
  );
};

export default Passengers;
