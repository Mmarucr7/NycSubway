export interface Station {
  id: string;
  name: string;
  lines: string[];
  waitTime: number; // average wait time in minutes
  latitude?: number;
  longitude?: number;
}

export interface Connection {
  from: string;
  to: string;
  line: string;
  time: number; // travel time in minutes
}

// NYC Subway Lines
export const SUBWAY_LINES = [
  { id: '1', color: '#EE352E', name: '1 Line' },
  { id: '2', color: '#EE352E', name: '2 Line' },
  { id: '3', color: '#EE352E', name: '3 Line' },
  { id: '4', color: '#00933C', name: '4 Line' },
  { id: '5', color: '#00933C', name: '5 Line' },
  { id: '6', color: '#00933C', name: '6 Line' },
  { id: '7', color: '#B933AD', name: '7 Line' },
  { id: 'A', color: '#0039A6', name: 'A Line' },
  { id: 'C', color: '#0039A6', name: 'C Line' },
  { id: 'E', color: '#0039A6', name: 'E Line' },
  { id: 'B', color: '#FF6319', name: 'B Line' },
  { id: 'D', color: '#FF6319', name: 'D Line' },
  { id: 'F', color: '#FF6319', name: 'F Line' },
  { id: 'M', color: '#FF6319', name: 'M Line' },
  { id: 'N', color: '#FCCC0A', name: 'N Line' },
  { id: 'Q', color: '#FCCC0A', name: 'Q Line' },
  { id: 'R', color: '#FCCC0A', name: 'R Line' },
  { id: 'W', color: '#FCCC0A', name: 'W Line' },
  { id: 'G', color: '#6CBE45', name: 'G Line' },
  { id: 'J', color: '#996633', name: 'J Line' },
  { id: 'Z', color: '#996633', name: 'Z Line' },
  { id: 'L', color: '#A7A9AC', name: 'L Line' },
  { id: 'S', color: '#808183', name: 'S Line' },
];

// Sample of NYC Subway Stations
export const STATIONS: Station[] = [
  { id: 'times_sq', name: 'Times Square - 42nd St', lines: ['1', '2', '3', 'N', 'Q', 'R', 'W', '7', 'S'], waitTime: 2, latitude: 40.7556, longitude: -73.9867 },
  { id: 'grand_central', name: 'Grand Central - 42nd St', lines: ['4', '5', '6', '7', 'S'], waitTime: 3, latitude: 40.7527, longitude: -73.9772 },
  { id: 'herald_sq', name: 'Herald Square - 34th St', lines: ['B', 'D', 'F', 'M', 'N', 'Q', 'R', 'W'], waitTime: 2.5, latitude: 40.7496, longitude: -73.9876 },
  { id: 'penn_station', name: 'Penn Station - 34th St', lines: ['1', '2', '3', 'A', 'C', 'E'], waitTime: 3, latitude: 40.7506, longitude: -73.9939 },
  { id: 'union_sq', name: 'Union Square - 14th St', lines: ['4', '5', '6', 'L', 'N', 'Q', 'R', 'W'], waitTime: 2, latitude: 40.7356, longitude: -73.9906 },
  { id: 'canal_st', name: 'Canal St', lines: ['1', '6', 'N', 'Q', 'R', 'W', 'J', 'Z'], waitTime: 2.5, latitude: 40.7192, longitude: -74.0007 },
  { id: 'atlantic_av', name: 'Atlantic Av - Barclays Ctr', lines: ['2', '3', '4', '5', 'B', 'D', 'N', 'Q', 'R'], waitTime: 3, latitude: 40.6841, longitude: -73.9778 },
  { id: 'fulton_st', name: 'Fulton St', lines: ['2', '3', '4', '5', 'A', 'C', 'J', 'Z'], waitTime: 2, latitude: 40.7091, longitude: -74.0078 },
  { id: 'columbus_circle', name: 'Columbus Circle - 59th St', lines: ['1', 'A', 'B', 'C', 'D'], waitTime: 2, latitude: 40.7682, longitude: -73.9819 },
  { id: 'rockefeller', name: 'Rockefeller Center - 47-50 Sts', lines: ['B', 'D', 'F', 'M'], waitTime: 2, latitude: 40.7587, longitude: -73.9802 },
  { id: 'lexington_53', name: 'Lexington Av/53rd St', lines: ['E', 'M'], waitTime: 2.5, latitude: 40.7574, longitude: -73.9695 },
  { id: '59_lex', name: '59th St - Lexington Av', lines: ['4', '5', '6', 'N', 'R', 'W'], waitTime: 2, latitude: 40.7627, longitude: -73.9672 },
  { id: 'bway_lafayette', name: 'Broadway-Lafayette St', lines: ['B', 'D', 'F', 'M', '6'], waitTime: 2.5, latitude: 40.7258, longitude: -73.9965 },
  { id: 'delancey', name: 'Delancey St/Essex St', lines: ['F', 'J', 'M', 'Z'], waitTime: 2, latitude: 40.7184, longitude: -73.9881 },
  { id: 'chambers', name: 'Chambers St', lines: ['1', '2', '3', 'A', 'C', 'J', 'Z'], waitTime: 2, latitude: 40.7134, longitude: -74.0098 },
];

// Sample connections between stations
export const CONNECTIONS: Connection[] = [
  { from: 'times_sq', to: 'grand_central', line: '7', time: 4 },
  { from: 'times_sq', to: 'herald_sq', line: 'N', time: 3 },
  { from: 'times_sq', to: 'penn_station', line: '1', time: 4 },
  { from: 'times_sq', to: 'columbus_circle', line: '1', time: 5 },
  { from: 'grand_central', to: '59_lex', line: '6', time: 4 },
  { from: 'grand_central', to: 'lexington_53', line: 'E', time: 3 },
  { from: 'herald_sq', to: 'union_sq', line: 'N', time: 6 },
  { from: 'herald_sq', to: 'rockefeller', line: 'B', time: 3 },
  { from: 'penn_station', to: 'herald_sq', line: 'A', time: 4 },
  { from: 'penn_station', to: 'chambers', line: '1', time: 7 },
  { from: 'union_sq', to: 'canal_st', line: '6', time: 6 },
  { from: 'union_sq', to: 'bway_lafayette', line: 'N', time: 4 },
  { from: 'canal_st', to: 'chambers', line: '1', time: 3 },
  { from: 'canal_st', to: 'fulton_st', line: 'J', time: 4 },
  { from: 'atlantic_av', to: 'union_sq', line: 'Q', time: 12 },
  { from: 'atlantic_av', to: 'canal_st', line: 'N', time: 9 },
  { from: 'fulton_st', to: 'chambers', line: 'A', time: 2 },
  { from: 'columbus_circle', to: '59_lex', line: 'N', time: 7 },
  { from: 'columbus_circle', to: 'rockefeller', line: 'B', time: 3 },
  { from: 'rockefeller', to: 'lexington_53', line: 'E', time: 4 },
  { from: 'lexington_53', to: '59_lex', line: '6', time: 3 },
  { from: 'bway_lafayette', to: 'delancey', line: 'F', time: 3 },
  { from: 'bway_lafayette', to: 'canal_st', line: '6', time: 4 },
  { from: 'delancey', to: 'canal_st', line: 'J', time: 3 },
];

// Add reverse connections (subway lines go both ways)
export const BIDIRECTIONAL_CONNECTIONS: Connection[] = [
  ...CONNECTIONS,
  ...CONNECTIONS.map(conn => ({
    from: conn.to,
    to: conn.from,
    line: conn.line,
    time: conn.time
  }))
]; 