import React from 'react';
import { ItineraryDay, ItineraryEvent, EventType } from '../types';
import ActivityItem from './ActivityItem';
import TravelSegmentItem from './TravelSegmentItem';
import AccommodationItem from './AccommodationItem';
import GeneralEventItem from './GeneralEventItem';
import { MapPinIcon, CalendarIcon } from './IconComponents';

interface ItineraryDayCardProps {
  day: ItineraryDay;
}

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day }) => {
  const renderEvent = (event: ItineraryEvent, index: number) => {
    switch (event.type) {
      case EventType.ACTIVITY:
        return event.activity ? <ActivityItem key={index} activity={event.activity} time={event.time} /> : null;
      case EventType.TRAVEL:
        return event.travelSegment ? <TravelSegmentItem key={index} segment={event.travelSegment} time={event.time} /> : null;
      case EventType.ACCOMMODATION:
        return event.accommodation ? <AccommodationItem key={index} accommodation={event.accommodation} time={event.time} mainLocation={day.mainLocation} /> : null;
      case EventType.GENERAL:
        return <GeneralEventItem key={index} description={event.description || ""} time={event.time} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
      <div className="p-6 bg-gradient-to-r from-sky-600 to-cyan-500">
        <h2 className="text-2xl font-bold text-white flex items-center" style={{ fontFamily: "'Roboto Slab', serif" }}>
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
      <div className="p-6 space-y-6">
        {day.events.length > 0 ? (
          day.events.map(renderEvent)
        ) : (
          <p className="text-slate-400 italic">No specific events planned for this day.</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryDayCard;