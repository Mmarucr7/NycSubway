# NYC Subway Pathfinder

A React + TypeScript application that finds the fastest route between NYC subway stations using Dijkstra's algorithm.

## 🚀 Features

  - **Interactive NYC Subway Map**: Visual representation of the NYC subway system with real geographic coordinates.
  - **Quickest Route Calculation**: Implementation of Dijkstra's algorithm to find the fastest path between any two stations.
  - **Real-Time Visualization**: Shows the quickest route directly on the map with color-coded subway lines.
  - **Detailed Route Information**: Step-by-step directions, total time, and transfer information.
  - **Smart Route Planning**: Accounts for wait times at transfer stations and travel times between stations.
  - **Station Filtering**: Search stations by name or filter by subway line.

## ⚙️ How It Works

1.  **Dijkstra's Algorithm**: The application uses a modified version of Dijkstra's algorithm that accounts for not just distance between stations, but also:

      * Travel time between stations
      * Wait time when transferring between lines
      * Number of transfers

2.  **Data Model**: The subway system is represented as a graph where:

      * Nodes are subway stations with properties (name, lines, wait time, coordinates)
      * Edges are connections between stations with properties (line, travel time)

3.  **Route Calculation**: When selecting a start and end station, the algorithm:

      * Finds the optimal path by minimizing total travel time
      * Includes transfer wait times in the calculation
      * Returns detailed information about the route including transfers and timing

## 🛠️ Technologies Used

  - **React**: Frontend framework
  - **TypeScript**: Type-safe JavaScript
  - **Google Maps API**: For interactive mapping
  - **Vite**: Fast build tooling
  - **Material-UI**: For UI components
  - **Chart.js**: For data visualization
  - **Tailwind CSS**: For styling

## 🏁 Getting Started

### Prerequisites

  - Node.js (v14+)
  - npm or yarn
  - Google Maps API key with Maps JavaScript API enabled

### Installation

1.  Clone the repository

    ```
    git clone https://github.com/siddh113/NycSubway.git
    cd NycSubway/subway-pathfinder
    ```

2.  Install dependencies

    ```
    npm install
    ```

3.  Set up environment variables

      - Copy `.env.example` to `.env`
      - Add your Google Maps API key to the `.env` file

    <!-- end list -->

    ```
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    ```

4.  Start the development server

    ```
    npm run dev
    ```

5.  Visit `http://localhost:5173` in your browser

### Environment Variables

The application requires the following environment variables to function properly:

| Variable                 | Description                                      | Required |
| ------------------------ | ------------------------------------------------ | -------- |
| VITE\_GOOGLE\_MAPS\_API\_KEY | Google Maps API key with Maps JavaScript API enabled | Yes      |

For more information about getting a Google Maps API key, visit the [Google Maps Platform documentation](https://developers.google.com/maps/documentation/javascript/get-api-key).

## 📁 Project Structure

```
subway-pathfinder/
├── src/
│   ├── components/          # React components
│   │   ├── SubwayMap.tsx    # Map visualization component
│   │   ├── RouteDetails.tsx # Route directions component
│   │   └── StationSelector.tsx # Station selection component
│   ├── data/
│   │   └── SubwayData.ts    # Subway station and connection data
│   ├── utils/
│   │   └── DijkstraAlgorithm.ts # Path-finding algorithm
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML entry point
└── package.json             # Project dependencies and scripts
```

## 🔮 Future Enhancements

  - Add real-time subway status information
  - Include more detailed subway data with all NYC stations
  - Implement alternative routing options (fewer transfers, less walking)
  - Add accessibility information for stations
  - Include walking directions to and from stations

## 🙏 Acknowledgments

  - MTA for NYC subway system information
  - Google Maps for mapping API
  - React and TypeScript communities for excellent documentation and support
