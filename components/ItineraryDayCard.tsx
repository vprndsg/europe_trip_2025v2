import React, { useState } from 'react';
import { ItineraryDay, ItineraryEvent, EventType } from '../types';
import ActivityItem from './ActivityItem';
import TravelSegmentItem from './TravelSegmentItem';
import AccommodationItem from './AccommodationItem';
import GeneralEventItem from './GeneralEventItem';
import { MapPinIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from './IconComponents';
import WeatherForecast from './WeatherForecast';

interface ItineraryDayCardProps {
  day: ItineraryDay;
  onSelectLocation?: (id: string) => void;
  selectedLocationId?: string;
  onHighlightLine?: (line: [number, number][]) => void;
}

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day, onSelectLocation, selectedLocationId, onHighlightLine }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
    if (navigator?.vibrate) {
      navigator.vibrate(10);
    }
  };
  const renderEvent = (event: ItineraryEvent, index: number) => {
    switch (event.type) {
      case EventType.ACTIVITY:
        return event.activity ? <ActivityItem key={index} activity={event.activity} time={event.time} onSelectLocation={onSelectLocation} selectedLocationId={selectedLocationId} /> : null;
      case EventType.TRAVEL:
        return event.travelSegment ? <TravelSegmentItem key={index} segment={event.travelSegment} time={event.time} onSelectLocation={onSelectLocation} selectedLocationId={selectedLocationId} onHighlightLine={onHighlightLine} /> : null;
      case EventType.ACCOMMODATION:
        return event.accommodation ? (
          <AccommodationItem
            key={index}
            accommodation={event.accommodation}
            time={event.accommodation.arrivalTime || event.time}
            mainLocation={day.mainLocation}
            onSelectLocation={onSelectLocation}
            selectedLocationId={selectedLocationId}
          />
        ) : null;
      case EventType.GENERAL:
        return <GeneralEventItem key={index} description={event.description || ""} time={event.time} onSelectLocation={onSelectLocation} selectedLocationId={selectedLocationId} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
      <button onClick={toggleExpanded} className="p-6 bg-gradient-to-r from-sky-600 to-cyan-500 w-full text-left flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>
             {day.id.startsWith("day_june") ? "" : day.id.replace('day','Day ').replace('_', '-')} : {day.title}
          </h2>
          <div className="flex items-center mt-2 text-sky-100">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <p className="text-sm ">{day.dateRange}</p>
          </div>
          {day.mainLocation && (
            <div className="flex items-center mt-1 text-sky-100">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <p className="text-sm font-medium">{day.mainLocation}</p>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-6 h-6 text-white ml-4 mt-1" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-white ml-4 mt-1" />
        )}
      </button>
      <div className={`overflow-hidden transition-all ${isExpanded ? 'max-h-[1000px] p-6' : 'max-h-0 p-0'}`}>
        <div className="space-y-6">
          <WeatherForecast location={day.mainLocation} />
          {day.events.length > 0 ? (
            day.events.map(renderEvent)
          ) : (
            <p className="text-slate-400 italic">No specific events planned for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDayCard;
