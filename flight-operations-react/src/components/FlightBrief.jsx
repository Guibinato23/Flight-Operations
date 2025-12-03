import { useFlightContext } from '../contexts/FlightContext';
import FlightBriefForm from './FlightBriefForm';
import FlightBriefPreview from './FlightBriefPreview';
import '../styles/FlightBrief.css';

const FlightBrief = () => {
  return (
    <div className="flightbrief">
      <div className="app">
        <FlightBriefForm />
        <FlightBriefPreview />
      </div>
    </div>
  );
};

export default FlightBrief;
