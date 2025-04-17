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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  
  // Filter stations based on search term and selected line
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLine = selectedLine ? station.lines.includes(selectedLine) : true;
      return matchesSearch && matchesLine;
    });
  }, [stations, searchTerm, selectedLine]);
  
  return (
    <div className="station-selector p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold mb-3">{label}</h3>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Filter by Line:</label>
        <div className="flex flex-wrap gap-1">
          {SUBWAY_LINES.map(line => (
            <button
              key={line.id}
              className="line-button p-1 rounded-full w-6 h-6 text-xs text-white font-bold flex items-center justify-center"
              style={{ 
                backgroundColor: line.color,
                opacity: selectedLine === line.id ? 1 : 0.6
              }}
              onClick={() => setSelectedLine(prevLine => prevLine === line.id ? null : line.id)}
            >
              {line.id}
            </button>
          ))}
        </div>
      </div>
      
      <div className="station-list h-64 overflow-y-auto border rounded p-2">
        {filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <div
              key={station.id}
              onClick={() => onChange(station.id)}
              className={`
                station-item p-2 rounded cursor-pointer mb-1 hover:bg-gray-100
                ${selectedStation === station.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}
              `}
            >
              <div className="flex justify-between">
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
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No stations found</p>
        )}
      </div>
    </div>
  );
};

export default StationSelector; 