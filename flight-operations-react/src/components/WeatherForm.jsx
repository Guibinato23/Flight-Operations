import { useState } from 'react';
import { useFlightContext } from '../contexts/FlightContext';

const WeatherForm = () => {
  const { flightData, updateFlightData, setWeather } = useFlightContext();
  const [status, setStatus] = useState('');

  const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail'
  };

  const getWindDir = (deg) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  const parseCityFromToName = () => {
    const raw = flightData.toName.trim();
    if (!raw) return flightData.toIcao.trim();
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    return parts[parts.length - 1] || raw;
  };

  const geocodeCity = async (name) => {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(name);
    const r = await fetch(url);
    if (!r.ok) throw new Error('geocoding');
    const j = await r.json();
    if (!j.length) throw new Error('not found');
    return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon), label: j[0].display_name };
  };

  const updateWeather = async () => {
    try {
      setStatus('Buscando…');
      const city = (flightData.wxCity || parseCityFromToName()).trim();
      updateFlightData('wxCity', city);
      
      let lat = parseFloat(flightData.wxLat);
      let lon = parseFloat(flightData.wxLon);
      let label = city;

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        if (!city) {
          setStatus('Digite cidade');
          return;
        }
        const g = await geocodeCity(city);
        lat = g.lat;
        lon = g.lon;
        label = g.label;
        updateFlightData('wxLat', lat);
        updateFlightData('wxLon', lon);
      } else {
        label = city + ' (' + lat.toFixed(2) + ', ' + lon.toFixed(2) + ')';
      }

      const date = flightData.date;
      if (!date) {
        setStatus('Defina data');
        return;
      }

      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
        '&longitude=' + lon +
        '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max' +
        '&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m,precipitation' +
        '&timezone=auto&start_date=' + date + '&end_date=' + date;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro API');
      const data = await res.json();

      if (!data.daily) throw new Error('Sem dados');

      const d = data.daily;
      const minTemp = d.temperature_2m_min[0];
      const maxTemp = d.temperature_2m_max[0];
      const precip = d.precipitation_sum[0] || 0;
      const wind = d.windspeed_10m_max[0];
      const code = d.weathercode[0];

      const summary = (weatherCodes[code] || 'N/A') + ' • Min/Max: ' + Math.round(minTemp) + '°C / ' + Math.round(maxTemp) + '°C' +
        ' • Wind: ' + Math.round(wind) + ' km/h • Precipitation: ' + precip.toFixed(1) + ' mm';

      let arrText = '—';
      const arr = flightData.arriveLT;
      if (arr && data.hourly && data.hourly.time) {
        const target = date + 'T' + arr;
        let idx = 0;
        let minDiff = 999999;
        for (let i = 0; i < data.hourly.time.length; i++) {
          const t = data.hourly.time[i];
          if (!t.startsWith(date)) continue;
          const h = t.substring(11, 13);
          const diff = Math.abs(parseInt(h) - parseInt(arr.split(':')[0]));
          if (diff < minDiff) {
            minDiff = diff;
            idx = i;
          }
        }
        const h = data.hourly;
        const time = h.time[idx].substring(11, 16);
        const temp = h.temperature_2m[idx];
        const wcode = h.weathercode[idx];
        const wspeed = h.windspeed_10m[idx];
        const wdir = h.winddirection_10m[idx];
        const rain = h.precipitation[idx] || 0;

        arrText = time + ' local • ' + (weatherCodes[wcode] || 'N/A') + ' • ' + Math.round(temp) + '°C' +
          ' • Wind ' + Math.round(wspeed) + ' km/h (' + getWindDir(wdir) + ') • Precipitation ' + rain.toFixed(1) + ' mm';
      }

      setWeather({
        location: label,
        date: new Date(date).toLocaleDateString('pt-BR'),
        summary: summary,
        arrival: arrText
      });
      setStatus('✓ OK');
    } catch (e) {
      console.error(e);
      setStatus('Erro: ' + e.message);
    }
  };

  return (
    <fieldset>
      <legend><strong>Previsão do tempo (Destino)</strong></legend>
      <label>
        Cidade/Local do destino (edite se necessário)
        <input
          value={flightData.wxCity}
          onChange={(e) => updateFlightData('wxCity', e.target.value)}
          placeholder=""
        />
      </label>
      <div className="row">
        <div>
          <label>
            Latitude (opcional)
            <input
              value={flightData.wxLat}
              onChange={(e) => updateFlightData('wxLat', e.target.value)}
              placeholder=""
            />
          </label>
        </div>
        <div>
          <label>
            Longitude (opcional)
            <input
              value={flightData.wxLon}
              onChange={(e) => updateFlightData('wxLon', e.target.value)}
              placeholder=""
            />
          </label>
        </div>
      </div>
      <button type="button" className="btn" onClick={updateWeather}>
        Atualizar previsão
      </button>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
        {status}
      </div>
    </fieldset>
  );
};

export default WeatherForm;
