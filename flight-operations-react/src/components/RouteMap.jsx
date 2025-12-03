import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useFlightContext } from '../contexts/FlightContext';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FitBounds = ({ positions }) => {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions).pad(0.2);
      map.fitBounds(bounds);
    }
  }, [positions, map]);
  
  return null;
};

const RouteMap = () => {
  const { flightData } = useFlightContext();
  const [route, setRoute] = useState(null);
  const [hint, setHint] = useState('Preencha os campos "De (ICAO)" e "Para (ICAO)" para visualizar a rota.');

  useEffect(() => {
    const updateRoute = async () => {
      const fromIcao = flightData.fromIcao.trim().toUpperCase();
      const toIcao = flightData.toIcao.trim().toUpperCase();
      const fromName = flightData.fromName.trim();
      const toName = flightData.toName.trim();

      if (!fromIcao || !toIcao) {
        setRoute(null);
        setHint('Preencha os campos "De (ICAO)" e "Para (ICAO)" para visualizar a rota.');
        return;
      }

      setHint('Localizando aeroportos…');

      try {
        const geocode = async (icao, nameHint) => {
          const query = icao ? `${icao} airport` : nameHint;
          if (!query) return null;
          const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
          const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!r.ok) return null;
          const j = await r.json();
          if (!j || !j.length) return null;
          const g = j[0];
          return { lat: parseFloat(g.lat), lon: parseFloat(g.lon), label: g.display_name };
        };

        const [A, B] = await Promise.all([
          geocode(fromIcao, fromName),
          geocode(toIcao, toName)
        ]);

        if (!A || !B) {
          setHint('Não foi possível localizar um dos aeroportos. Verifique ICAO e nomes.');
          setRoute(null);
          return;
        }

        setRoute({
          from: { lat: A.lat, lon: A.lon, icao: fromIcao, label: A.label },
          to: { lat: B.lat, lon: B.lon, icao: toIcao, label: B.label }
        });
        setHint('');
      } catch (e) {
        console.error(e);
        setHint('Falha ao traçar a rota.');
        setRoute(null);
      }
    };

    updateRoute();
  }, [flightData.fromIcao, flightData.toIcao, flightData.fromName, flightData.toName]);

  return (
    <div className="section" id="routeSection">
      <h3>Route Map</h3>
      <div id="routeMap" style={{ width: '100%', height: '260px', border: '1px solid var(--line)', borderRadius: '10px' }}>
        {route ? (
          <MapContainer
            center={[30, -20]}
            zoom={2}
            style={{ width: '100%', height: '100%', borderRadius: '10px' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
            <Marker position={[route.from.lat, route.from.lon]} title={route.from.icao} />
            <Marker position={[route.to.lat, route.to.lon]} title={route.to.icao} />
            <Polyline
              positions={[
                [route.from.lat, route.from.lon],
                [route.to.lat, route.to.lon]
              ]}
              weight={3}
              color="#3388ff"
            />
            <FitBounds positions={[
              [route.from.lat, route.from.lon],
              [route.to.lat, route.to.lon]
            ]} />
          </MapContainer>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f7f7f8',
            borderRadius: '10px',
            color: 'var(--muted)'
          }}>
            <p>Aguardando dados de rota...</p>
          </div>
        )}
      </div>
      <div className="route-hint" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
        {hint}
      </div>
    </div>
  );
};

export default RouteMap;
