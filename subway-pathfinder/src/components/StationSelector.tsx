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
    <div className="station-selector">
      <div 
        className="p-4 border rounded-lg shadow-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold mb-2">{label}</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {selectedStationData ? selectedStationData.name : 'Select a station'}
          </span>
          <span className="text-gray-500">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="station-list mt-2 max-h-96 overflow-y-auto border rounded-lg shadow-md bg-white">
          {stations.map(station => (
            <div
              key={station.id}
              onClick={() => {
                onChange(station.id);
                setIsOpen(false);
              }}
              className={`
                station-item p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50
                ${selectedStation === station.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{station.name}</span>
                <div className="line-indicators flex gap-1">
                  {station.lines.map(lineId => {
                    const line = SUBWAY_LINES.find(l => l.id === lineId);
                    return (
                      <span
                        key={lineId}
                        className="line-badge w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
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