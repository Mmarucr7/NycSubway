import React, { useState, useMemo } from 'react';
import { Station, SUBWAY_LINES } from '../data/SubwayData';

interface StationSelectorProps {
  stations: Station[];
  selectedStation: string | null;
  onChange: (stationId: string) => void;
  label: string;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  selectedStation,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedStationData = useMemo(() => {
    return stations.find(station => station.id === selectedStation);
  }, [stations, selectedStation]);
  
  return (
    <div className="station-selector relative">
      <div 
        className={`
          p-4 border-2 rounded-lg shadow-lg bg-white/80 backdrop-blur-md cursor-pointer transition-all duration-300
          ${isOpen 
            ? 'border-indigo-500 shadow-indigo-100 scale-[1.02]' 
            : 'border-gray-200/50 hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold mb-2 text-gray-800">{label}</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">
            {selectedStationData ? selectedStationData.name : 'Select a station'}
          </span>
          <span className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="station-list absolute mt-2 w-full max-h-96 overflow-y-auto border-2 border-gray-200/50 rounded-lg shadow-lg bg-white/90 backdrop-blur-md transform transition-all duration-300 animate-fadeIn">
          {stations.map(station => (
            <div
              key={station.id}
              onClick={() => {
                onChange(station.id);
                setIsOpen(false);
              }}
              className={`
                station-item p-3 border-b last:border-b-0 cursor-pointer transition-all duration-200
                ${selectedStation === station.id 
                  ? 'bg-indigo-50/80 border-l-4 border-indigo-500 scale-[1.01]' 
                  : 'hover:bg-gray-50/80 hover:scale-[1.005]'}
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{station.name}</span>
                <div className="line-indicators flex gap-1">
                  {station.lines.map(lineId => {
                    const line = SUBWAY_LINES.find(l => l.id === lineId);
                    return (
                      <span
                        key={lineId}
                        className="line-badge w-5 h-5 rounded-full text-white text-xs flex items-center justify-center shadow-sm transform transition-transform duration-200 hover:scale-110"
                        style={{ backgroundColor: line?.color || '#ccc' }}
                      >
                        {lineId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationSelector; 