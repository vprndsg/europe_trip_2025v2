import React from 'react';
import { InformationCircleIcon, ClockIcon } from './IconComponents';
import { createGoogleMapsSearchLink } from '../utils';
import { findLocationId } from '../src/mapLocations';

interface GeneralEventItemProps {
  description: string;
  time?: string;
  onSelectLocation?: (id: string) => void;
  selectedLocationId?: string;
}

const GeneralEventItem: React.FC<GeneralEventItemProps> = ({ description, time, onSelectLocation, selectedLocationId }) => {
  const addressMatch = description.match(/^(?:Destination Address|Address): (.*)/i);
  let content;
  const locationId = findLocationId(addressMatch ? addressMatch[1] : description);
  const isSelected = selectedLocationId && locationId === selectedLocationId;

  if (addressMatch && addressMatch[1]) {
    const addressLabel = description.substring(0, description.indexOf(addressMatch[1]));
    const address = addressMatch[1];
    content = (
      <p className="text-slate-300 text-sm whitespace-pre-line">
        {addressLabel}
        <a 
          href={createGoogleMapsSearchLink(address)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sky-400 hover:text-sky-300 hover:underline"
          aria-label={`View ${address} on Google Maps`}
        >
          {address}
        </a>
      </p>
    );
  } else {
    content = <p className="text-slate-300 text-sm whitespace-pre-line">{description}</p>;
  }

  return (
    <div
      className={`bg-slate-700/50 p-4 rounded-lg shadow-md border-l-4 border-slate-500 ${isSelected ? 'ring-2 ring-slate-400' : ''}`}
      onClick={() => locationId && onSelectLocation?.(locationId)}
      role={locationId ? 'button' : undefined}
      tabIndex={locationId ? 0 : -1}
    >
      <div className="flex items-start">
        <InformationCircleIcon className="w-6 h-6 text-slate-400 mr-3 mt-1 flex-shrink-0" />
        <div>
            {time && <p className="text-xs text-slate-400 flex items-center mb-1"><ClockIcon className="w-3 h-3 mr-1" /> {time}</p>}
            {content}
        </div>
      </div>
    </div>
  );
};

export default GeneralEventItem;
