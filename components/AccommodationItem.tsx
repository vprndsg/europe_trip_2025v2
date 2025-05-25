import React from 'react';
import { Accommodation } from '../types';
import { BedIcon, ClockIcon, MapPinIcon, MapPinIconAlt, InformationCircleIcon } from './IconComponents';
import { createGoogleMapsSearchLink } from '../utils';
import { findLocationId } from '../mapLocations';

interface AccommodationItemProps {
  accommodation: Accommodation;
  time?: string;
  mainLocation?: string;
  onSelectLocation?: (id: string) => void;
  selectedLocationId?: string;
}

const AccommodationItem: React.FC<AccommodationItemProps> = ({ accommodation, time, mainLocation, onSelectLocation, selectedLocationId }) => {
  const canLinkName = accommodation.name && !accommodation.name.toLowerCase().includes("airbnb");
  const nameQuery = mainLocation && canLinkName ? `${accommodation.name}, ${mainLocation}` : accommodation.name;
  const locationId = findLocationId(accommodation.address || nameQuery);
  const isSelected = selectedLocationId && locationId === selectedLocationId;

  return (
    <div
      className={`bg-slate-700/50 p-4 rounded-lg shadow-md border-l-4 border-indigo-500 ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}
      onClick={() => locationId && onSelectLocation?.(locationId)}
      role={locationId ? 'button' : undefined}
      tabIndex={locationId ? 0 : -1}
    >
      <div className="flex items-start">
        <BedIcon className="w-6 h-6 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-indigo-300">
            {canLinkName ? (
              <a
                href={createGoogleMapsSearchLink(nameQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-200 hover:underline"
                aria-label={`Search for ${nameQuery} on Google Maps`}
              >
                {accommodation.name}
              </a>
            ) : (
              accommodation.name
            )}
          </h4>
          {time && <p className="text-xs text-slate-400 flex items-center"><ClockIcon className="w-3 h-3 mr-1" /> Check-in around: {time}</p>}
        </div>
      </div>
      
      {accommodation.address && (
        <p className="mt-2 text-sm text-slate-400 flex items-center">
          <MapPinIconAlt className="w-4 h-4 mr-1.5 text-indigo-400 flex-shrink-0"/>
          Address: <a 
            href={createGoogleMapsSearchLink(accommodation.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-sky-300 hover:underline ml-1"
            aria-label={`View ${accommodation.address} on Google Maps`}
          >
            {accommodation.address}
          </a>
        </p>
      )}
      {accommodation.reservationDetails && (
        <p className="mt-1 text-sm text-slate-400 flex items-center"><InformationCircleIcon className="w-4 h-4 mr-1.5 text-indigo-400 flex-shrink-0"/>Reservation: <span className="text-slate-300">{accommodation.reservationDetails}</span></p>
      )}

      {accommodation.notes && accommodation.notes.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-600">
          <h5 className="text-xs font-semibold text-slate-400 mb-1">Notes:</h5>
          <ul className="list-disc list-inside pl-1 space-y-1">
            {accommodation.notes.map((note, idx) => (
              <li key={idx} className="text-xs text-slate-300 whitespace-pre-line">{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccommodationItem;
