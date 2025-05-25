import React from 'react';
import { TravelSegment } from '../types';
import { FlightIcon, TrainIcon, BusIcon, WalkIcon, CarIcon, ClockIcon, InformationCircleIcon, TicketIcon, BuildingLibraryIcon } from './IconComponents';
import { createGoogleMapsSearchLink } from '../utils';
import { findLocationId } from '../mapLocations';

interface TravelSegmentItemProps {
  segment: TravelSegment;
  time?: string;
  onSelectLocation?: (id: string) => void;
  selectedLocationId?: string;
}

const TravelSegmentItem: React.FC<TravelSegmentItemProps> = ({ segment, time, onSelectLocation, selectedLocationId }) => {
  const getIcon = () => {
    switch (segment.mode) {
      case 'flight': return <FlightIcon className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />;
      case 'train': return <TrainIcon className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />;
      case 'bus': return <BusIcon className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />;
      case 'public_transport': return <CarIcon className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" />;
      case 'walk': return <WalkIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />;
      case 'taxi': return <CarIcon className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />;
      default: return <InformationCircleIcon className="w-6 h-6 text-slate-400 mr-3 mt-1 flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (segment.mode) {
      case 'flight': return 'border-blue-500';
      case 'train': return 'border-red-500';
      case 'bus': return 'border-yellow-500';
      case 'public_transport': return 'border-purple-500';
      case 'walk': return 'border-green-500';
      case 'taxi': return 'border-orange-500';
      default: return 'border-slate-500';
    }
  }

  const locationId = findLocationId(segment.to) || findLocationId(segment.from) || findLocationId(segment.details);
  const isSelected = selectedLocationId && locationId === selectedLocationId;

  const LocationLink: React.FC<{location?: string; label: string}> = ({ location, label }) => {
    if (!location) return null;
    // Basic check for what might be an address vs a station/city name for slightly different styling or query
    const isLikelyAddress = location.match(/\d/) && location.match(/[a-zA-Z]/);
    return (
      <p className="text-slate-400">{label}:&nbsp;
        <a 
          href={createGoogleMapsSearchLink(location)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-300 hover:text-sky-300 hover:underline"
          aria-label={`View ${location} on Google Maps`}
        >
          {location}
        </a>
      </p>
    );
  }


  return (
    <div
      className={`bg-slate-700/50 p-4 rounded-lg shadow-md border-l-4 ${getBorderColor()} ${isSelected ? 'ring-2 ring-sky-400' : ''}`}
      onClick={() => locationId && onSelectLocation?.(locationId)}
      role={locationId ? 'button' : undefined}
      tabIndex={locationId ? 0 : -1}
    >
      <div className="flex items-start">
        {getIcon()}
        <div>
          <h4 className="text-lg font-semibold text-slate-200">{segment.details}</h4>
          {(time || segment.departureTime || segment.arrivalTime) && (
            <div className="text-xs text-slate-400 flex items-center mt-0.5">
              <ClockIcon className="w-3 h-3 mr-1" />
              {time && <span>Event Time: {time} { (segment.departureTime || segment.arrivalTime) && "| "}</span>}
              {segment.departureTime && <span>Dep: {segment.departureTime}</span>}
              {segment.departureTime && segment.arrivalTime && <span className="mx-1">-</span>}
              {segment.arrivalTime && <span>Arr: {segment.arrivalTime}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <LocationLink location={segment.from} label="From" />
        <LocationLink location={segment.to} label="To" />
        {segment.operator && <p className="text-slate-400">Operator: <span className="text-slate-300">{segment.operator}</span></p>}
        {segment.duration && <p className="text-slate-400">Duration: <span className="text-slate-300">{segment.duration}</span></p>}
        {segment.platform && <p className="text-slate-400 flex items-center"><BuildingLibraryIcon className="w-4 h-4 mr-1.5 text-slate-400"/>Platform/Stop: <span className="text-slate-300">{segment.platform}</span></p>}
      </div>
      
      {segment.reservationInfo && (
        <p className="mt-2 text-sm text-slate-400 flex items-center"><TicketIcon className="w-4 h-4 mr-1.5 text-slate-400"/>Reservation: <span className="text-slate-300">{segment.reservationInfo}</span></p>
      )}

      {segment.notes && segment.notes.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-600">
          <h5 className="text-xs font-semibold text-slate-400 mb-1">Notes:</h5>
          <ul className="list-disc list-inside pl-1 space-y-1">
            {segment.notes.map((note, idx) => {
              const pickupAddressMatch = note.match(/^(Pickup Address|Address): (.*)/i);
              if (pickupAddressMatch && pickupAddressMatch[2]) {
                const addressLabel = pickupAddressMatch[1];
                const address = pickupAddressMatch[2];
                return (
                  <li key={idx} className="text-xs text-slate-300">
                    {addressLabel}: <a href={createGoogleMapsSearchLink(address)} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">{address}</a>
                  </li>
                );
              }
              return <li key={idx} className="text-xs text-slate-300">{note}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TravelSegmentItem;
