
export enum EventType {
  TRAVEL = 'TRAVEL',
  ACCOMMODATION = 'ACCOMMODATION',
  ACTIVITY = 'ACTIVITY',
  GENERAL = 'GENERAL',
}

export interface TravelSegment {
  mode: 'flight' | 'train' | 'bus' | 'public_transport' | 'walk' | 'taxi' | 'car';
  details: string;
  from?: string;
  to?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  operator?: string;
  reservationInfo?: string;
  platform?: string;
  notes?: string[];
}

export interface Accommodation {
  name: string;
  reservationDetails?: string;
  arrivalTime?: string;
  address?: string;
  notes?: string[];
}

export interface Activity {
  title: string;
  description?: string;
  location?: string;
  distance?: string;
  time?: string; // Duration for activity
  elevationGain?: string;
  elevationLoss?: string;
  difficulty?: string;
  notes?: string[];
}

export interface ItineraryEvent {
  type: EventType;
  time?: string; // Specific time for the event
  description?: string;
  travelSegment?: TravelSegment;
  accommodation?: Accommodation;
  activity?: Activity;
}

export interface ItineraryDay {
  id: string;
  title: string;
  dateRange: string;
  mainLocation?: string;
  events: ItineraryEvent[];
}

export interface Itinerary {
  title: string;
  days: ItineraryDay[];
}
