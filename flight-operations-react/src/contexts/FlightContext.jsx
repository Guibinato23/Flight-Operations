import { createContext, useContext, useState, useEffect } from 'react';

const FlightContext = createContext();

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlightContext must be used within FlightProvider');
  }
  return context;
};

export const FlightProvider = ({ children }) => {
  // Estado do Flight Brief
  const [flightData, setFlightData] = useState(() => {
    const saved = localStorage.getItem('flightData');
    return saved ? JSON.parse(saved) : {
      slogan: 'DEMAND THE SERVICE YOU DESERVE',
      company: 'Poit Aviation',
      date: '',
      departLT: '',
      fromIcao: '',
      fromName: '',
      toIcao: '',
      toName: '',
      pax: '',
      flightTime: '',
      arriveLT: '',
      flightNo: '',
      acType: '',
      acReg: '',
      acRest: '',
      wxCity: '',
      wxLat: '',
      wxLon: '',
      generalNotes: ''
    };
  });

  // Estado da tripulação
  const [crew, setCrew] = useState(() => {
    const saved = localStorage.getItem('crewState');
    return saved ? JSON.parse(saved) : [
      { role: 'Captain', name: '', phone: '' },
      { role: 'First Officer', name: '', phone: '' },
      { role: 'Air Hostess', name: '', phone: '' },
      { role: 'Sales Team', name: '', phone: '' }
    ];
  });

  // Estado dos passageiros
  const [passengers, setPassengers] = useState(() => {
    const saved = localStorage.getItem('paxState');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado do handling
  const [handling, setHandling] = useState(() => {
    const saved = localStorage.getItem('handState');
    return saved ? JSON.parse(saved) : [
      { airport: '', handling: '', address: '', phone: '', email: '' },
      { airport: '', handling: '', address: '', phone: '', email: '' }
    ];
  });

  // Estado do weather
  const [weather, setWeather] = useState({
    location: '—',
    date: '—',
    summary: '—',
    arrival: '—'
  });

  // Fotos da aeronave
  const [aircraftPhotos, setAircraftPhotos] = useState({
    pic1: '',
    pic2: '',
    pic3: ''
  });

  // Logo
  const [logo, setLogo] = useState('Logo.png');

  // Persiste dados no localStorage
  useEffect(() => {
    localStorage.setItem('flightData', JSON.stringify(flightData));
  }, [flightData]);

  useEffect(() => {
    localStorage.setItem('crewState', JSON.stringify(crew));
  }, [crew]);

  useEffect(() => {
    localStorage.setItem('paxState', JSON.stringify(passengers));
  }, [passengers]);

  useEffect(() => {
    localStorage.setItem('handState', JSON.stringify(handling));
  }, [handling]);

  // Funções auxiliares
  const updateFlightData = (field, value) => {
    setFlightData(prev => ({ ...prev, [field]: value }));
  };

  const addCrewMember = () => {
    setCrew(prev => [...prev, { role: '', name: '', phone: '' }]);
  };

  const updateCrewMember = (index, field, value) => {
    setCrew(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeCrewMember = (index) => {
    setCrew(prev => prev.filter((_, i) => i !== index));
  };

  const addPassenger = () => {
    setPassengers(prev => [...prev, { name: '', passport: '', exp: '', phone: '' }]);
  };

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePassenger = (index) => {
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const addHandling = () => {
    setHandling(prev => [...prev, { airport: '', handling: '', address: '', phone: '', email: '' }]);
  };

  const updateHandling = (index, field, value) => {
    setHandling(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeHandling = (index) => {
    setHandling(prev => prev.filter((_, i) => i !== index));
  };

  const resetAllData = () => {
    if (confirm('Limpar tudo e recarregar valores padrão?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const value = {
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
    weather,
    setWeather,
    aircraftPhotos,
    setAircraftPhotos,
    logo,
    setLogo,
    resetAllData
  };

  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
};
