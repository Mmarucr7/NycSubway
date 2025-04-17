declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      controls: MVCArray<Node>[];
      fitBounds(bounds: LatLngBounds, padding?: number): void;
    }

    class LatLngBounds {
      constructor();
      extend(latLng: LatLngLiteral): void;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(event: string, handler: Function): void;
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
    }

    class Polyline {
      constructor(options?: PolylineOptions);
      setMap(map: Map | null): void;
    }

    class MVCArray<T> {
      push(element: T): number;
    }

    const ControlPosition: {
      TOP_LEFT: number;
      TOP_CENTER: number;
      TOP_RIGHT: number;
      LEFT_TOP: number;
      LEFT_CENTER: number;
      LEFT_BOTTOM: number;
      BOTTOM_LEFT: number;
      BOTTOM_CENTER: number;
      BOTTOM_RIGHT: number;
      RIGHT_TOP: number;
      RIGHT_CENTER: number;
      RIGHT_BOTTOM: number;
    };

    const SymbolPath: {
      BACKWARD_CLOSED_ARROW: number;
      BACKWARD_OPEN_ARROW: number;
      CIRCLE: number;
      FORWARD_CLOSED_ARROW: number;
      FORWARD_OPEN_ARROW: number;
    };

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      styles?: MapTypeStyle[];
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MarkerOptions {
      position?: LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface Icon {
      path: number;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLngLiteral;
    }

    interface PolylineOptions {
      path?: LatLngLiteral[];
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers: { [key: string]: any }[];
    }
  }
} 