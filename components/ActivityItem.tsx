import React from 'react';
import { Activity } from '../types';
import { HikeIcon, SparklesIcon, ClockIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon, InformationCircleIcon, MapPinIcon } from './IconComponents';
import { createGoogleMapsSearchLink } from '../utils';

import { findLocationId } from '../mapLocations';

interface ActivityItemProps {
  activity: Activity;
  time?: string;
  onSelectLocation?: (id: string) => void;
  selectedLocationId?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, time, onSelectLocation, selectedLocationId }) => {
  const isHike = activity.title.toLowerCase().includes('hike') || activity.difficulty || activity.distance || activity.elevationGain;

  let mapQuery: string | null = null;
  let mapLabel: string | null = null;
  let locationId: string | undefined;

  if (activity.location) {
    mapQuery = activity.location;
    mapLabel = activity.location;
    locationId = findLocationId(activity.location);
  } else if (activity.title) {
    let tempQuery = activity.title;
    if (tempQuery.startsWith("Hike: ")) tempQuery = tempQuery.substring(6);
    else if (tempQuery.startsWith("Activity: ")) tempQuery = tempQuery.substring(10);
    
    const arrowParts = tempQuery.split("→");
    const potentialQuery = arrowParts[arrowParts.length - 1].trim();

    // Avoid linking very generic terms like "Berlin" from "Hang out in Berlin"
    // but allow specific place names or regions like "Lake Como"
    const genericTerms = ["berlin", "appenzell"]; // add more if needed
    const isGenericActivityTitle = !activity.title.toLowerCase().startsWith("hike to") && 
                                   !activity.title.toLowerCase().startsWith("visit ") && 
                                   genericTerms.some(term => potentialQuery.toLowerCase().includes(term)) && 
                                   arrowParts.length === 1 && 
                                   !activity.title.toLowerCase().startsWith("hike:");


    if (potentialQuery.toLowerCase() === "lake como") {
        mapQuery = "Lake Como, Italy";
        mapLabel = "Lake Como";
    } else if (!isGenericActivityTitle && potentialQuery) {
        mapQuery = potentialQuery;
        mapLabel = potentialQuery;
    }
    locationId = findLocationId(potentialQuery);
  }


  const isSelected = selectedLocationId && locationId === selectedLocationId;

  return (
    <div
      className={`bg-slate-700/50 p-4 rounded-lg shadow-md border-l-4 border-emerald-500 ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
      onClick={() => locationId && onSelectLocation?.(locationId)}
      role={locationId ? 'button' : undefined}
      tabIndex={locationId ? 0 : -1}
    >
      <div className="flex items-start">
        {isHike ? <HikeIcon className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" /> : <SparklesIcon className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" />}
        <div>
          <h4 className="text-lg font-semibold text-emerald-300">{activity.title}</h4>
          {time && <p className="text-xs text-slate-400 flex items-center"><ClockIcon className="w-3 h-3 mr-1" /> {time}</p>}
        </div>
      </div>
      
      {activity.description && (
        <div className="mt-2 text-slate-300 whitespace-pre-line text-sm leading-relaxed">
            {activity.description.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {activity.distance && (
          <p className="text-slate-400 flex items-center"><InformationCircleIcon className="w-4 h-4 mr-1.5 text-emerald-400" />Distance: {activity.distance}</p>
        )}
        {activity.time && !time && /* Show activity duration if not already shown as event time */ (
          <p className="text-slate-400 flex items-center"><ClockIcon className="w-4 h-4 mr-1.5 text-emerald-400" />Duration: {activity.time}</p>
        )}
        {activity.elevationGain && (
          <p className="text-slate-400 flex items-center"><ArrowUpTrayIcon className="w-4 h-4 mr-1.5 text-emerald-400" />Elevation Gain: {activity.elevationGain}</p>
        )}
        {activity.elevationLoss && (
          <p className="text-slate-400 flex items-center"><ArrowDownTrayIcon className="w-4 h-4 mr-1.5 text-emerald-400" />Elevation Loss: {activity.elevationLoss}</p>
        )}
        {activity.difficulty && (
          <p className="text-slate-400 flex items-center col-span-1 sm:col-span-2"><AdjustmentsHorizontalIcon className="w-4 h-4 mr-1.5 text-emerald-400" />Difficulty: {activity.difficulty}</p>
        )}
      </div>

      {mapQuery && mapLabel && (
        <div className="mt-3">
          <a 
            href={createGoogleMapsSearchLink(mapQuery)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center"
            aria-label={`View ${mapLabel} on Google Maps`}
          >
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> View {mapLabel} on map
          </a>
        </div>
      )}

      {activity.notes && activity.notes.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-600">
          <h5 className="text-xs font-semibold text-slate-400 mb-1">Notes:</h5>
          <ul className="list-disc list-inside pl-1 space-y-1">
            {activity.notes.map((note, idx) => (
              <li key={idx} className="text-xs text-slate-300">{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
