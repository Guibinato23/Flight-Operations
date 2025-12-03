import { useFlightContext } from '../contexts/FlightContext';
import { usePDFDownload } from '../hooks/usePDFDownload';
import WeatherForm from './WeatherForm';

const FlightBriefForm = () => {
  const {
    flightData,
    updateFlightData,
    crew,
    addCrewMember,
    updateCrewMember,
    removeCrewMember,
    passengers,
    addPassenger,
    updatePassenger,
    removePassenger,
    handling,
    addHandling,
    updateHandling,
    removeHandling,
    resetAllData,
    aircraftPhotos,
    setAircraftPhotos
  } = useFlightContext();

  const { downloadPDF, isGenerating, status } = usePDFDownload();

  const handleImageUpload = (e, picNum) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setAircraftPhotos(prev => ({
        ...prev,
        [`pic${picNum}`]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPDF = () => {
    const fromIcao = flightData.fromIcao || 'XXX';
    const toIcao = flightData.toIcao || 'XXX';
    const date = flightData.date || new Date().toISOString().split('T')[0];
    const filename = `FlightBrief_${fromIcao}-${toIcao}_${date}.pdf`;
    
    downloadPDF('page', filename);
  };

  return (
    <aside>
      <h1>Configurar Flight Briefing</h1>

      <fieldset>
        <legend><strong>Marca</strong></legend>
        <label>
          Slogan
          <input
            value={flightData.slogan}
            onChange={(e) => updateFlightData('slogan', e.target.value)}
            placeholder="DEMAND THE SERVICE YOU DESERVE"
          />
        </label>
        <label>
          Nome da Empresa
          <input
            value={flightData.company}
            onChange={(e) => updateFlightData('company', e.target.value)}
            placeholder="Poit Aviation"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend><strong>Dados do Voo</strong></legend>
        <div className="row">
          <div>
            <label>Data</label>
            <input
              type="date"
              value={flightData.date}
              onChange={(e) => updateFlightData('date', e.target.value)}
            />
          </div>
          <div>
            <label>Horário (LT) Partida</label>
            <input
              type="time"
              value={flightData.departLT}
              onChange={(e) => updateFlightData('departLT', e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div>
            <label>De (ICAO)</label>
            <input
              value={flightData.fromIcao}
              onChange={(e) => updateFlightData('fromIcao', e.target.value)}
              placeholder="ICAO"
            />
          </div>
          <div>
            <label>Para (ICAO)</label>
            <input
              value={flightData.toIcao}
              onChange={(e) => updateFlightData('toIcao', e.target.value)}
              placeholder="ICAO"
            />
          </div>
        </div>
        <label>
          Origem – Nome completo do aeroporto / cidade
          <input
            value={flightData.fromName}
            onChange={(e) => updateFlightData('fromName', e.target.value)}
            placeholder="From"
          />
        </label>
        <label>
          Destino – Nome completo do aeroporto / cidade
          <input
            value={flightData.toName}
            onChange={(e) => updateFlightData('toName', e.target.value)}
            placeholder="To"
          />
        </label>
        <div className="row">
          <div>
            <label>PAX</label>
            <input
              type="number"
              min="0"
              value={flightData.pax}
              onChange={(e) => updateFlightData('pax', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label>Tempo de Voo (hh:mm)</label>
            <input
              value={flightData.flightTime}
              onChange={(e) => updateFlightData('flightTime', e.target.value)}
              placeholder="00:00"
            />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Chegada (LT)</label>
            <input
              type="time"
              value={flightData.arriveLT}
              onChange={(e) => updateFlightData('arriveLT', e.target.value)}
            />
          </div>
          <div>
            <label>Nº do Voo</label>
            <input
              value={flightData.flightNo}
              onChange={(e) => updateFlightData('flightNo', e.target.value)}
              placeholder="N/A"
            />
          </div>
        </div>
      </fieldset>

      <WeatherForm />

      <fieldset>
        <legend><strong>Aeronave</strong></legend>
        <label>
          Tipo
          <input
            value={flightData.acType}
            onChange={(e) => updateFlightData('acType', e.target.value)}
          />
        </label>
        <label>
          Matrícula
          <input
            value={flightData.acReg}
            onChange={(e) => updateFlightData('acReg', e.target.value)}
          />
        </label>
        <label>
          Restrições / Observações
          <textarea
            value={flightData.acRest}
            onChange={(e) => updateFlightData('acRest', e.target.value)}
          />
        </label>
        <div className="row">
          <div>
            <label>
              Foto 1
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 1)}
              />
            </label>
          </div>
          <div>
            <label>
              Foto 2
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 2)}
              />
            </label>
          </div>
        </div>
        <label>
          Foto 3
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 3)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend><strong>Tripulação & Operador</strong></legend>
        <div id="crewWrap">
          {crew.map((member, index) => (
            <div key={index} className="row" style={{ marginBottom: '10px' }}>
              <div>
                <label>Função</label>
                <input
                  value={member.role}
                  onChange={(e) => updateCrewMember(index, 'role', e.target.value)}
                />
              </div>
              <div>
                <label>Nome</label>
                <input
                  value={member.name}
                  onChange={(e) => updateCrewMember(index, 'name', e.target.value)}
                />
              </div>
              <div>
                <label>Telefone</label>
                <input
                  value={member.phone}
                  onChange={(e) => updateCrewMember(index, 'phone', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => removeCrewMember(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn" onClick={addCrewMember}>
          + Adicionar contato
        </button>
      </fieldset>

      <fieldset>
        <legend><strong>Passageiros</strong></legend>
        <div id="paxWrap">
          {passengers.map((pax, index) => (
            <div key={index} className="row" style={{ marginBottom: '10px' }}>
              <div>
                <label>Nome</label>
                <input
                  value={pax.name}
                  onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                />
              </div>
              <div>
                <label>Passaporte</label>
                <input
                  value={pax.passport}
                  onChange={(e) => updatePassenger(index, 'passport', e.target.value)}
                />
              </div>
              <div>
                <label>Vencimento</label>
                <input
                  type="date"
                  value={pax.exp}
                  onChange={(e) => updatePassenger(index, 'exp', e.target.value)}
                />
              </div>
              <div>
                <label>Telefone</label>
                <input
                  value={pax.phone}
                  onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => removePassenger(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn" onClick={addPassenger}>
          + Adicionar passageiro
        </button>
      </fieldset>

      <fieldset>
        <legend><strong>Handling Contacts</strong></legend>
        <div id="handWrap">
          {handling.map((hand, index) => (
            <div key={index} className="row" style={{ marginBottom: '10px' }}>
              <div>
                <label>Aeroporto</label>
                <input
                  value={hand.airport}
                  onChange={(e) => updateHandling(index, 'airport', e.target.value)}
                />
              </div>
              <div>
                <label>Handling</label>
                <input
                  value={hand.handling}
                  onChange={(e) => updateHandling(index, 'handling', e.target.value)}
                />
              </div>
              <div>
                <label>Endereço</label>
                <input
                  value={hand.address}
                  onChange={(e) => updateHandling(index, 'address', e.target.value)}
                />
              </div>
              <div>
                <label>Telefone</label>
                <input
                  value={hand.phone}
                  onChange={(e) => updateHandling(index, 'phone', e.target.value)}
                />
              </div>
              <div>
                <label>E-mail</label>
                <input
                  value={hand.email}
                  onChange={(e) => updateHandling(index, 'email', e.target.value)}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => removeHandling(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn" onClick={addHandling}>
          + Adicionar aeroporto
        </button>
      </fieldset>

      <fieldset>
        <legend><strong>Observações</strong></legend>
        <textarea
          value={flightData.generalNotes}
          onChange={(e) => updateFlightData('generalNotes', e.target.value)}
          placeholder="Adicione observações gerais aqui..."
        />
      </fieldset>

      <div className="controls">
        <button className="btn" onClick={resetAllData}>
          Limpar
        </button>
        <button 
          className="btn primary" 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {status}
            </>
          ) : status === 'PDF Baixado!' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {status}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default FlightBriefForm;
