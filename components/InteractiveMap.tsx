
import React, { useEffect, useRef, useState } from 'react';
import { CrosshairsIcon, InformationCircleIcon } from './IconComponents';
import { MapLocation } from '../mapLocations';

// Declare L globally for Leaflet
declare var L: any;

interface InteractiveMapProps {
  markers?: MapLocation[];
  lines?: [number, number][][];
  selectedLocationId?: string;
  panTo?: [number, number] | null;
  highlightLine?: [number, number][] | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ markers = [], lines = [], selectedLocationId, panTo, highlightLine }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To store Leaflet map instance
  const userMarkerRef = useRef<any>(null); // To store user's location marker
  const markerMapRef = useRef<Record<string, any>>({});
  const transitLinesGroupRef = useRef<any>(null);
  const highlightLineRef = useRef<any>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // Initialize map only once

    // Define Tile Layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const hikingTrailsLayer = L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (data from OpenStreetMap)'
    });

    // Initialize Leaflet map
    const map = L.map(mapRef.current, {
        center: [51.505, -0.09], // Default view
        zoom: 13,
        layers: [osmLayer] // Default base layer
    });
    mapInstanceRef.current = map;

    // Layer Control
    const baseMaps = {
      "Street Map": osmLayer,
      "Satellite": satelliteLayer
    };
    const transitLinesGroup = L.layerGroup();
    transitLinesGroupRef.current = transitLinesGroup;

    const overlayMaps = {
      "Hiking Trails": hikingTrailsLayer,
      "Transit Lines": transitLinesGroup
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Add initial lines to transit group
    lines.forEach(path => {
      L.polyline(path, { color: '#38BDF8', weight: 4, opacity: 0.7 }).addTo(transitLinesGroup);
    });
    transitLinesGroup.addTo(map);

    // Custom 'You are here' icon
    const userIcon = L.divIcon({
        html: `
            <div style="background-color: #38BDF8; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);">
                <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
            </div>
        `,
        className: '', // No default Leaflet class
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    // Add provided markers
    markers.forEach(loc => {
      const marker = L.marker(loc.position, { icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      })}).addTo(map).bindPopup(`<strong>${loc.name}</strong>${loc.notes ? '<br/>'+loc.notes : ''}`);
      markerMapRef.current[loc.id] = marker;
    });

 

    // Fit map to markers and lines
    const bounds = L.latLngBounds([]);
    markers.forEach(loc => bounds.extend(loc.position));
    lines.forEach(path => path.forEach(p => bounds.extend(p)));
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2));
    }

    // Geolocation
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setCurrentPosition(newPos);
          setError(null);
          setIsLocating(false);

          if (mapInstanceRef.current) {
            if (!userMarkerRef.current) {
              userMarkerRef.current = L.marker(newPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current)
                .bindPopup("You are here!")
                .openPopup();
              mapInstanceRef.current.setView(newPos, 16); // Zoom in on first location
            } else {
              userMarkerRef.current.setLatLng(newPos);
            }
          }
        },
        (err) => {
          console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
          if (err.code === err.PERMISSION_DENIED) {
            setError("Location permission denied. Please enable it in your browser settings to use the live map.");
          } else {
            setError("Could not get your location. Please ensure location services are enabled.");
          }
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (mapInstanceRef.current) {
          if (transitLinesGroupRef.current) {
            transitLinesGroupRef.current.clearLayers();
          }
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (!mapInstanceRef.current || !transitLinesGroupRef.current) return;
    const group = transitLinesGroupRef.current;
    group.clearLayers();
    lines.forEach(path => {
      L.polyline(path, { color: '#38BDF8', weight: 4, opacity: 0.7 }).addTo(group);

 
    });
    if (lines.length > 0) {
      const bounds = L.latLngBounds([]);
      lines.forEach(path => path.forEach(p => bounds.extend(p)));
      Object.values(markerMapRef.current).forEach((m: any) => bounds.extend(m.getLatLng()));
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds.pad(0.2));
      }
    }
  }, [lines]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocationId) return;
    const marker = markerMapRef.current[selectedLocationId];
    if (marker) {
      Object.keys(markerMapRef.current).forEach(id => {
        const m = markerMapRef.current[id];
        m.setIcon(L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        }));
      });
      marker.setIcon(L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [30, 50],
        iconAnchor: [15, 50],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      }));
      mapInstanceRef.current.setView(marker.getLatLng(), 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedLocationId]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (panTo) {
      mapInstanceRef.current.panTo(panTo);
    }
  }, [panTo]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (highlightLineRef.current) {
      mapInstanceRef.current.removeLayer(highlightLineRef.current);
      highlightLineRef.current = null;
    }
    if (highlightLine && highlightLine.length > 1) {
      highlightLineRef.current = L.polyline(highlightLine, { color: '#f97316', weight: 5 }).addTo(mapInstanceRef.current);
      const bounds = L.latLngBounds(highlightLine);
      mapInstanceRef.current.fitBounds(bounds.pad(0.2));
    }
  }, [highlightLine]);

  const recenterMap = () => {
    if (mapInstanceRef.current && currentPosition) {
      mapInstanceRef.current.setView(currentPosition, mapInstanceRef.current.getZoom() < 15 ? 16 : mapInstanceRef.current.getZoom());
      if(userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    } else if (isLocating) {
        alert("Still trying to find your location. Please wait a moment.");
    } else if (error) {
        alert("Cannot recenter: " + error);
    }
  };

  return (
    <div className="relative">
      <div id="map" ref={mapRef} className="leaflet-container bg-slate-700">
        {/* Map is rendered here by Leaflet */}
      </div>
      {(isLocating || error) && (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-800 bg-opacity-75 flex flex-col justify-center items-center z-[1001] p-4 rounded-lg"> {/* Increased z-index */}
          {isLocating && !error && <p className="text-sky-300 text-lg">Finding your location...</p>}
          {error && 
            <div className="text-center">
              <InformationCircleIcon className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 font-semibold">Location Error</p>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          }
        </div>
      )}
       <button
        onClick={recenterMap}
        disabled={!currentPosition && !isLocating}
        className="absolute bottom-3 left-3 z-[1001] bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg shadow-lg transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        title="Recenter on Me"
        aria-label="Recenter map on current location"
      >
        <CrosshairsIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default InteractiveMap;
