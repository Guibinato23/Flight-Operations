import { useFlightContext } from '../contexts/FlightContext';
import RouteMap from './RouteMap';

const FlightBriefPreview = () => {
  const {
    flightData,
    crew,
    passengers,
    handling,
    weather,
    aircraftPhotos,
    logo
  } = useFlightContext();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <main style={{ padding: '18px', overflow: 'auto' }}>
      <div className="page" id="page">
        <div className="pb">
          <div className="topbar">
            <div className="brandbox">
              <img id="logo" alt="Logo" src={logo} />
              <div className="slogan">{flightData.slogan}</div>
            </div>
            <div>
              <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '12px' }}>
                {flightData.company}
              </div>
              <div className="title">FLIGHT BRIEFING</div>
            </div>
          </div>

          <table className="grid">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Date</th>
                <th style={{ width: '80px' }}>Departing</th>
                <th>From</th>
                <th>To</th>
                <th style={{ width: '50px' }}>PAX</th>
                <th style={{ width: '90px' }}>Flight Time</th>
                <th style={{ width: '90px' }}>Arriving</th>
                <th style={{ width: '90px' }}>Flight No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(flightData.date)}</td>
                <td>{flightData.departLT}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{flightData.fromIcao}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{flightData.fromName}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{flightData.toIcao}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{flightData.toName}</div>
                </td>
                <td>{flightData.pax}</td>
                <td>{flightData.flightTime}</td>
                <td>{flightData.arriveLT}</td>
                <td>{flightData.flightNo}</td>
              </tr>
            </tbody>
          </table>

          <RouteMap />

          <div className="section">
            <h3>Destination Weather</h3>
            <table className="grid">
              <tbody>
                <tr>
                  <th style={{ width: '140px' }}>Location</th>
                  <td>{weather.location}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{weather.date}</td>
                </tr>
                <tr>
                  <th>Forecast (daily)</th>
                  <td>{weather.summary}</td>
                </tr>
                <tr>
                  <th>Arrival window</th>
                  <td>{weather.arrival}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section">
            <h3>Aircraft</h3>
            <table className="grid">
              <tbody>
                <tr>
                  <th style={{ width: '140px' }}>Type</th>
                  <td>{flightData.acType}</td>
                </tr>
                <tr>
                  <th>Registration</th>
                  <td>{flightData.acReg}</td>
                </tr>
                <tr>
                  <th>Restrictions</th>
                  <td>{flightData.acRest}</td>
                </tr>
              </tbody>
            </table>
            <div className="aircraft-pics">
              {aircraftPhotos.pic1 && <img src={aircraftPhotos.pic1} alt="Aircraft 1" />}
              {aircraftPhotos.pic2 && <img src={aircraftPhotos.pic2} alt="Aircraft 2" />}
              {aircraftPhotos.pic3 && <img src={aircraftPhotos.pic3} alt="Aircraft 3" />}
            </div>
          </div>

          <div className="section">
            <h3>Crew & Operator Contacts</h3>
            <table className="grid contact-table">
              <thead>
                <tr>
                  <th style={{ width: '160px' }}>Role</th>
                  <th style={{ width: '240px' }}>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {crew.map((member, index) => (
                  <tr key={index}>
                    <td>{member.role}</td>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section" id="notesSection">
            <h3>General Informations</h3>
            <div style={{
              whiteSpace: 'pre-wrap',
              minHeight: '40px',
              color: '#444',
              fontSize: '13px',
              background: '#f7f7f8',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px 12px'
            }}>
              {flightData.generalNotes || '—'}
            </div>
          </div>

          <div className="section">
            <h3>Passengers</h3>
            <table className="grid">
              <thead>
                <tr>
                  <th style={{ width: '240px' }}>Name</th>
                  <th style={{ width: '140px' }}>DOB</th>
                  <th style={{ width: '180px' }}>Passport</th>
                  <th style={{ width: '140px' }}>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((pax, index) => (
                  <tr key={index}>
                    <td>{pax.name}</td>
                    <td>{pax.dob}</td>
                    <td>{pax.passport}</td>
                    <td>{pax.exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section">
            <h3>Handling contacts</h3>
            <table className="grid handling-table">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>AIRPORT</th>
                  <th>HANDLING</th>
                  <th style={{ width: '260px' }}>ADDRESS</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {handling.map((hand, index) => (
                  <tr key={index}>
                    <td>{hand.airport}</td>
                    <td>{hand.handling}</td>
                    <td>{hand.address}</td>
                    <td>{hand.phone}</td>
                    <td>{hand.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FlightBriefPreview;
