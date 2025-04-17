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
    <div className="app min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 text-gray-800">NYC Subway Pathfinder</h1>
        <p className="text-lg text-gray-600 mb-2">
          Find the fastest route between NYC subway stations using Dijkstra's algorithm
        </p>
        <p className="text-sm text-gray-500">
          Integrating real New York City map with accurate station locations and fastest route visualization
        </p>
      </header>
      
      <main className="container mx-auto max-w-7xl">
        <div className="station-selectors mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`
                  px-6 py-2 text-white rounded-lg transition-all duration-200 shadow-md
                  ${isLoading 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'}
                `}
              >
                Swap Stations
              </button>
            )}
            
            <button
              onClick={() => setShowRoute(true)}
              disabled={!startStation || !endStation || isLoading}
              className={`
                px-6 py-2 text-white rounded-lg transition-all duration-200 shadow-md
                ${(!startStation || !endStation || isLoading)
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'}
              `}
            >
              {isLoading ? 'Calculating...' : 'Find Route'}
            </button>
          </div>
        </div>
        
        {showRoute && (
          <div className="route-container flex flex-col lg:flex-row gap-8">
            <div className="map-container lg:w-2/4">
              <div className="p-4 bg-white rounded-lg shadow-lg mb-4">
                <h2 className="text-xl font-bold text-center text-gray-800">Interactive Map View</h2>
                <p className="text-sm text-center text-gray-500 mt-1">Click on stations for more details</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <SubwayMap
                  stations={STATIONS}
                  connections={BIDIRECTIONAL_CONNECTIONS}
                  path={pathConnections}
                  startStation={startStation}
                  endStation={endStation}
                />
              </div>
            </div>
            
            <div className="route-details-container lg:w-2/4">
              <div className="p-4 bg-white rounded-lg shadow-lg mb-4">
                <h2 className="text-xl font-bold text-center text-gray-800">Step-by-Step Directions</h2>
                <p className="text-sm text-center text-gray-500 mt-1">For the quickest route</p>
              </div>
              {pathResult && (
                <div className="route-summary p-6 bg-white rounded-lg shadow-lg mb-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Quickest Route Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total time</p>
                      <p className="text-lg font-semibold text-gray-800">{pathResult.totalTime} minutes</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Travel time</p>
                      <p className="text-lg font-semibold text-gray-800">{pathResult.totalTravelTime} minutes</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Wait time</p>
                      <p className="text-lg font-semibold text-gray-800">{pathResult.totalWaitTime} minutes</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Transfers</p>
                      <p className="text-lg font-semibold text-gray-800">{pathResult.transfers}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <RouteDetails pathResult={pathResult} />
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Created with React, TypeScript, and Dijkstra's algorithm</p>
        <p className="mt-1">© {new Date().getFullYear()} NYC Subway Pathfinder</p>
      </footer>
    </div>
  )
}

export default App
