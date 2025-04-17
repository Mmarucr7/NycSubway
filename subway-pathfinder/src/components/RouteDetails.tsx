import React from 'react';
import { PathResult, PathSegment } from '../utils/DijkstraAlgorithm';
import { SUBWAY_LINES } from '../data/SubwayData';

interface RouteDetailsProps {
  pathResult: PathResult | null;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ pathResult }) => {
  if (!pathResult || pathResult.path.length === 0) {
    return (
      <div className="route-details p-4 border rounded-lg shadow-md bg-white">
        <p className="text-center text-gray-500">Select stations to see route details</p>
      </div>
    );
  }

  // Group segments by line to show transfers clearly
  const groupSegmentsByLine = (segments: PathSegment[]) => {
    const groups: { line: string, segments: PathSegment[], color: string }[] = [];
    let currentGroup: { line: string, segments: PathSegment[], color: string } | null = null;

    segments.forEach(segment => {
      if (!currentGroup || currentGroup.line !== segment.line) {
        const lineInfo = SUBWAY_LINES.find(l => l.id === segment.line);
        currentGroup = {
          line: segment.line,
          segments: [segment],
          color: lineInfo?.color || '#ccc'
        };
        groups.push(currentGroup);
      } else {
        currentGroup.segments.push(segment);
      }
    });

    return groups;
  };

  const lineGroups = groupSegmentsByLine(pathResult.path);

  return (
    <div className="route-details p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-3">Route Details</h2>
      
      <div className="route-summary mb-4 p-3 bg-gray-100 rounded">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-600">Total Time:</p>
            <p className="font-bold">{pathResult.totalTime} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Transfers:</p>
            <p className="font-bold">{pathResult.transfers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Travel Time:</p>
            <p className="font-bold">{pathResult.totalTravelTime} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wait Time:</p>
            <p className="font-bold">{pathResult.totalWaitTime} minutes</p>
          </div>
        </div>
      </div>

      <div className="route-steps">
        <p className="text-sm text-gray-600 mb-2">Start at <span className="font-bold">{pathResult.path[0].from.name}</span></p>
        
        {lineGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="route-group mb-3">
            <div className="flex items-center mb-2">
              <div 
                className="line-indicator w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: group.color }}
              ></div>
              <p className="font-bold">Take {group.line} Line</p>
            </div>
            
            <div className="pl-6 border-l-2" style={{ borderColor: group.color }}>
              {group.segments.map((segment, segIndex) => (
                <div key={segIndex} className="station-step mb-2">
                  <p>
                    <span className="font-medium">{segment.from.name}</span> → 
                    <span className="font-medium">{segment.to.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({segment.time} min)</span>
                  </p>
                </div>
              ))}
            </div>
            
            {groupIndex < lineGroups.length - 1 && (
              <div className="transfer-info pl-6 mb-3">
                <p className="text-sm text-gray-600">
                  Transfer at <span className="font-medium">{group.segments[group.segments.length - 1].to.name}</span>
                  <span className="text-gray-500 ml-2">
                    (Wait ~{group.segments[group.segments.length - 1].to.waitTime} min)
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
        
        <p className="text-sm text-gray-600 mt-2">
          Arrive at <span className="font-bold">{pathResult.path[pathResult.path.length - 1].to.name}</span>
        </p>
      </div>
    </div>
  );
};

export default RouteDetails; 