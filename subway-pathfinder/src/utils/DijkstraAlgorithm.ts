import { Station, Connection } from '../data/SubwayData';

export interface DijkstraNode {
  id: string;
  distance: number;
  previous: string | null;
  previousLine: string | null;
  visited: boolean;
}

export interface PathSegment {
  from: Station;
  to: Station;
  line: string;
  time: number;
}

export interface PathResult {
  path: PathSegment[];
  totalTime: number;
  totalWaitTime: number;
  totalTravelTime: number;
  transfers: number;
}


export const findShortestPath = (
  stations: Station[],
  connections: Connection[],
  startId: string,
  endId: string
): PathResult => {

  if (startId === endId) {
    return {
      path: [],
      totalTime: 0,
      totalWaitTime: 0,
      totalTravelTime: 0,
      transfers: 0
    };
  }

  const stationMap = new Map<string, Station>();
  stations.forEach(station => {
    stationMap.set(station.id, station);
  });

  const graph = new Map<string, DijkstraNode>();
  stations.forEach(station => {
    graph.set(station.id, {
      id: station.id,
      distance: station.id === startId ? 0 : Infinity,
      previous: null,
      previousLine: null,
      visited: false
    });
  });

  const adjacencyList = new Map<string, { neighbor: string; line: string; time: number }[]>();
  stations.forEach(station => {
    adjacencyList.set(station.id, []);
  });

  connections.forEach(connection => {
    const neighbors = adjacencyList.get(connection.from) || [];
    neighbors.push({
      neighbor: connection.to,
      line: connection.line,
      time: connection.time
    });
    adjacencyList.set(connection.from, neighbors);
  });

  const unvisited = new Set<string>(stations.map(s => s.id));
  
  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let smallestDistance = Infinity;
    
    for (const nodeId of unvisited) {
      const node = graph.get(nodeId);
      if (node && node.distance < smallestDistance) {
        smallestDistance = node.distance;
        currentId = nodeId;
      }
    }

    if (!currentId || smallestDistance === Infinity) {
      break;
    }
    
    if (currentId === endId) {
      break;
    }
    
    unvisited.delete(currentId);
    
    const node = graph.get(currentId);
    if (!node) continue;
    node.visited = true;
    
    const neighbors = adjacencyList.get(currentId) || [];
    neighbors.forEach(({ neighbor, line, time }) => {
      const neighborNode = graph.get(neighbor);
      if (!neighborNode || neighborNode.visited) return;
      
      const station = stationMap.get(neighbor);
      if (!station) return;
      
      let waitTime = 0;
      if (node.previousLine && node.previousLine !== line) {
        waitTime = station.waitTime;
      }
      
      const totalTime = node.distance + time + waitTime;

      if (totalTime < neighborNode.distance) {
        neighborNode.distance = totalTime;
        neighborNode.previous = currentId;
        neighborNode.previousLine = line;
      }
    });
  }

  const path: PathSegment[] = [];
  let current = endId;
  let totalWaitTime = 0;
  let totalTravelTime = 0;
  let transfers = 0;
  let previousLine: string | null = null;
  
  while (current !== startId) {
    const node = graph.get(current);
    if (!node || !node.previous || !node.previousLine) break;
    
    const fromStation = stationMap.get(node.previous);
    const toStation = stationMap.get(current);
    
    if (!fromStation || !toStation) break;
    
    const connection = connections.find(
      conn => conn.from === node.previous && conn.to === current && conn.line === node.previousLine
    );
    
    if (!connection) break;
    
    if (previousLine && previousLine !== node.previousLine) {
      transfers++;
      totalWaitTime += toStation.waitTime;
    }
    
    totalTravelTime += connection.time;
    previousLine = node.previousLine;
    
    path.unshift({
      from: fromStation,
      to: toStation,
      line: connection.line,
      time: connection.time
    });
    
    current = node.previous;
  }
  
  const totalTime = totalTravelTime + totalWaitTime;
  
  return {
    path,
    totalTime,
    totalWaitTime,
    totalTravelTime,
    transfers
  };
}; 