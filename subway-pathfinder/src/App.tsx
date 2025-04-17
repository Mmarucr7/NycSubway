import { useState, useEffect } from 'react'
import './App.css'
import { STATIONS, BIDIRECTIONAL_CONNECTIONS, Connection } from './data/SubwayData'
import { findShortestPath, PathResult } from './utils/DijkstraAlgorithm'
import SubwayMap from './components/SubwayMap'
import RouteDetails from './components/RouteDetails'
import StationSelector from './components/StationSelector'

function App() {
  const [startStation, setStartStation] = useState<string | null>(null)
  const [endStation, setEndStation] = useState<string | null>(null)
  const [pathResult, setPathResult] = useState<PathResult | null>(null)
  const [pathConnections, setPathConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showRoute, setShowRoute] = useState<boolean>(false)

  useEffect(() => {
    if (startStation && endStation && showRoute) {
      setIsLoading(true)
      
      // Use a small timeout to allow the UI to update before running the algorithm
      setTimeout(() => {
        try {
          // Calculate quickest route using Dijkstra's algorithm
          const result = findShortestPath(
            STATIONS,
            BIDIRECTIONAL_CONNECTIONS,
            startStation,
            endStation
          )
          
          setPathResult(result)
          
          // Convert path segments to connections for the map
          const connections = result.path.map(segment => ({
            from: segment.from.id,
            to: segment.to.id,
            line: segment.line,
            time: segment.time
          }))
          
          setPathConnections(connections)
        } catch (error) {
          console.error('Error calculating route:', error)
        } finally {
          setIsLoading(false)
        }
      }, 100)
    } else {
      setPathResult(null)
      setPathConnections([])
    }
  }, [startStation, endStation, showRoute])

  return (
    <div className="app min-h-screen bg-gray-100 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">NYC Subway Pathfinder</h1>
        <p className="text-gray-600 mb-2">
          Find the fastest route between NYC subway stations using Dijkstra's algorithm
        </p>
        <p className="text-sm text-gray-500">
          Integrating real New York City map with accurate station locations and fastest route visualization
        </p>
      </header>
      
      <main className="container mx-auto">
        <div className="station-selectors mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StationSelector
              stations={STATIONS}
              selectedStation={startStation}
              onChange={setStartStation}
              label="Select Starting Station"
            />
            
            <StationSelector
              stations={STATIONS}
              selectedStation={endStation}
              onChange={setEndStation}
              label="Select Destination Station"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            {startStation && endStation && (
              <button 
                onClick={() => {
                  setStartStation(endStation)
                  setEndStation(startStation)
                }}
                disabled={isLoading}
                className={`p-2 text-white rounded transition-colors ${
                  isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                }`}
              >
                Swap Stations
              </button>
            )}
            
            <button
              onClick={() => setShowRoute(true)}
              disabled={!startStation || !endStation || isLoading}
              className={`p-2 text-white rounded transition-colors ${
                (!startStation || !endStation || isLoading) 
                  ? 'bg-green-300 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 cursor-pointer'
              }`}
            >
              {isLoading ? 'Calculating...' : 'Find Route'}
            </button>
          </div>
        </div>
        
        {showRoute && (
          <div className="route-container flex flex-col lg:flex-row gap-6">
            <div className="map-container lg:w-2/4">
              <div className="p-2 bg-white rounded-lg shadow-md mb-2">
                <h2 className="text-center font-bold">Interactive Map View</h2>
                <p className="text-xs text-center text-gray-500 mb-2">Click on stations for more details</p>
              </div>
              <SubwayMap
                stations={STATIONS}
                connections={BIDIRECTIONAL_CONNECTIONS}
                path={pathConnections}
                startStation={startStation}
                endStation={endStation}
              />
            </div>
            
            <div className="route-details-container lg:w-2/4">
              <div className="p-2 bg-white rounded-lg shadow-md mb-2">
                <h2 className="text-center font-bold">Step-by-Step Directions</h2>
                <p className="text-xs text-center text-gray-500">For the quickest route</p>
              </div>
              {pathResult && (
                <div className="route-summary p-4 border rounded-lg shadow-md bg-white mb-4">
                  <h3 className="font-bold mb-2">Quickest Route Summary</h3>
                  <p>Total time: <span className="font-medium">{pathResult.totalTime} minutes</span></p>
                  <p>Travel time: <span className="font-medium">{pathResult.totalTravelTime} minutes</span></p>
                  <p>Wait time: <span className="font-medium">{pathResult.totalWaitTime} minutes</span></p>
                  <p>Transfers: <span className="font-medium">{pathResult.transfers}</span></p>
                </div>
              )}
              <RouteDetails pathResult={pathResult} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>Created with React, TypeScript, and Dijkstra's algorithm</p>
        <p className="mt-1">© {new Date().getFullYear()} NYC Subway Pathfinder</p>
      </footer>
    </div>
  )
}

export default App
