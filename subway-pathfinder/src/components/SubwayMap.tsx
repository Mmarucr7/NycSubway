import { useRef, useEffect, useState } from 'react';
import { Station, Connection, SUBWAY_LINES } from '../data/SubwayData';

interface SubwayMapProps {
  stations: Station[];
  connections: Connection[];
  path: Connection[];
  startStation: string | null;
  endStation: string | null;
}

const SubwayMap: React.FC<SubwayMapProps> = ({ 
  stations, 
  connections, 
  path, 
  startStation, 
  endStation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [mapPolylines, setMapPolylines] = useState<google.maps.Polyline[]>([]);
  const [mapInfoWindows, setMapInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Ensure Google Maps is available
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not available");
      setError("Google Maps API not available. Please check your internet connection and try again.");
      return;
    }
    
    if (map) return; // Don't re-initialize if we already have a map
    
    try {
      console.log("Creating new Google Map instance");
      // Initialize map centered on New York City
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.75, lng: -73.98 },
        zoom: 12,
        styles: [
          {
            featureType: 'transit.station',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      setMap(newMap);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Error initializing map: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [mapRef.current, window.google]);
  
  // Update the map when props change
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers and polylines
    mapMarkers.forEach(marker => marker.setMap(null));
    mapPolylines.forEach(polyline => polyline.setMap(null));
    mapInfoWindows.forEach(infoWindow => infoWindow.close());
    
    // Prepare arrays for new map elements
    const markers: google.maps.Marker[] = [];
    const infoWindows: google.maps.InfoWindow[] = [];
    const allPolylines: google.maps.Polyline[] = [];
    
    // Create markers for stations
    stations.forEach(station => {
      if (!station.latitude || !station.longitude) return;
      
      const isStart = station.id === startStation;
      const isEnd = station.id === endStation;
      const isOnPath = path.some(conn => conn.from === station.id || conn.to === station.id);
      
      let iconColor = '#FFFFFF'; // Default white
      if (isStart) {
        iconColor = '#00FF00'; // Green for start
      } else if (isEnd) {
        iconColor = '#FF0000'; // Red for end
      } else if (isOnPath) {
        iconColor = '#0066FF'; // Blue for path
      }
      
      const marker = new window.google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        title: station.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isStart || isEnd ? 8 : isOnPath ? 6 : 4,
          fillColor: iconColor,
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeWeight: 1
        }
      });
      
      markers.push(marker);
      
      // Create info window with station info
      const infoContent = `
        <div class="station-info">
          <h3>${station.name}</h3>
          <div class="station-lines">
            ${station.lines.map(lineId => {
              const line = SUBWAY_LINES.find(l => l.id === lineId);
              return `<span style="
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: ${line?.color || '#ccc'};
                color: white;
                text-align: center;
                line-height: 20px;
                font-weight: bold;
                margin-right: 3px;
              ">${lineId}</span>`;
            }).join('')}
          </div>
          <p>Average wait time: ${station.waitTime} min</p>
        </div>
      `;
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent
      });
      
      infoWindows.push(infoWindow);
      
      marker.addListener('click', () => {
        // Close all other info windows
        infoWindows.forEach(iw => iw.close());
        
        // Open this info window
        infoWindow.open(map, marker);
      });
    });
    
    // Draw all connections as thin lines
    connections.forEach(connection => {
      const from = stations.find(s => s.id === connection.from);
      const to = stations.find(s => s.id === connection.to);
      
      if (!from || !to || !from.latitude || !from.longitude || !to.latitude || !to.longitude) return;
      
      // Find the line color
      const line = SUBWAY_LINES.find(l => l.id === connection.line);
      
      const polyline = new window.google.maps.Polyline({
        path: [
          { lat: from.latitude, lng: from.longitude },
          { lat: to.latitude, lng: to.longitude }
        ],
        strokeColor: line?.color || '#ccc',
        strokeOpacity: 0.4,
        strokeWeight: 2
      });
      
      polyline.setMap(map);
      allPolylines.push(polyline);
    });
    
    // Draw the path as thicker lines
    if (path.length > 0) {
      // Create a map to group segments by subway line
      const lineSegments = new Map<string, { points: google.maps.LatLngLiteral[], color: string }>();
      
      path.forEach(connection => {
        const from = stations.find(s => s.id === connection.from);
        const to = stations.find(s => s.id === connection.to);
        
        if (!from || !to || !from.latitude || !from.longitude || !to.latitude || !to.longitude) return;
        
        const line = SUBWAY_LINES.find(l => l.id === connection.line);
        
        if (!lineSegments.has(connection.line)) {
          lineSegments.set(connection.line, {
            points: [
              { lat: from.latitude, lng: from.longitude },
              { lat: to.latitude, lng: to.longitude }
            ],
            color: line?.color || '#ccc'
          });
        } else {
          const segment = lineSegments.get(connection.line);
          if (segment) {
            segment.points.push({ lat: to.latitude, lng: to.longitude });
          }
        }
      });
      
      // Draw each line segment with its own color
      lineSegments.forEach((segment, lineId) => {
        const polyline = new window.google.maps.Polyline({
          path: segment.points,
          strokeColor: segment.color,
          strokeOpacity: 1,
          strokeWeight: 4
        });
        
        polyline.setMap(map);
        allPolylines.push(polyline);
      });
      
      // Auto zoom and center to fit the route
      if (path.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        
        path.forEach(connection => {
          const from = stations.find(s => s.id === connection.from);
          const to = stations.find(s => s.id === connection.to);
          
          if (from?.latitude && from?.longitude) {
            bounds.extend({ lat: from.latitude, lng: from.longitude });
          }
          
          if (to?.latitude && to?.longitude) {
            bounds.extend({ lat: to.latitude, lng: to.longitude });
          }
        });
        
        // Add some padding to the bounds
        map.fitBounds(bounds);
      }
    }
    
    // Create legend
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `
      <div style="
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <h3 style="margin-top: 0; margin-bottom: 8px;">NYC Subway Map</h3>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #00FF00;
            border: 1px solid black;
            margin-right: 8px;
          "></div>
          Start Station
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #FF0000;
            border: 1px solid black;
            margin-right: 8px;
          "></div>
          End Station
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #0066FF;
            border: 1px solid black;
            margin-right: 8px;
          "></div>
          Path Station
        </div>
        <div style="display: flex; align-items: center;">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #FFFFFF;
            border: 1px solid black;
            margin-right: 8px;
          "></div>
          Other Station
        </div>
      </div>
    `;
    
    // Clear any existing legends first
    const existingLegends = document.querySelectorAll('.map-legend');
    existingLegends.forEach(el => el.remove());
    
    // Add the new legend
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(legend);
    
    // Store references to map elements for cleanup
    setMapMarkers(markers);
    setMapPolylines(allPolylines);
    setMapInfoWindows(infoWindows);
    
  }, [map, stations, connections, path, startStation, endStation]);
  
  return (
    <div className="subway-map">
      {error ? (
        <div className="error-message p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">
            Please check your internet connection and ensure that Google Maps is accessible.
          </p>
        </div>
      ) : (
        <div 
          ref={mapRef} 
          style={{ width: '100%', height: '100%', minHeight: '600px', borderRadius: '0.5rem' }}
        ></div>
      )}
    </div>
  );
};

// Add type definitions for the Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

export default SubwayMap; 