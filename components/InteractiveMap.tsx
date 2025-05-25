
import React, { useEffect, useRef, useState } from 'react';
import { CrosshairsIcon, MapPinIcon, InformationCircleIcon } from './IconComponents';

// Declare L globally for Leaflet
declare var L: any;

const InteractiveMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To store Leaflet map instance
  const userMarkerRef = useRef<any>(null); // To store user's location marker
  
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
    const overlayMaps = {
      "Hiking Trails": hikingTrailsLayer
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);

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
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

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
        className="absolute top-3 right-3 z-[1001] bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg shadow-lg transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        title="Recenter on Me"
        aria-label="Recenter map on current location"
      >
        <CrosshairsIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default InteractiveMap;
