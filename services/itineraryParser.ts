
import { Itinerary, ItineraryDay, ItineraryEvent, EventType, TravelSegment, Accommodation, Activity } from '../types';

export function parseItinerary(text: string): Itinerary {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '' || line === ''); // Keep empty lines to detect block ends
  const days: ItineraryDay[] = [];
  let currentDay: ItineraryDay | null = null;
  let currentEventContext: ItineraryEvent | null = null;
  let isParsingRouteDescription = false;
  let routeDescriptionLines: string[] = [];

  const dayTitleRegex = /^Day (\d+(?:-\d+)?)\s*(.*?)\s*\((.*?)\)/i;
  const juneDateTitleRegex = /^(June \d+):\s*(.*)/i; // For June 19: Appenzell -> Äscher/Ebenalp

  const flightArrivalRegex = /Arrive (.*?)(?: to (.*?))? on (\w+ \d+)/i;
  const publicTransportToRegex = /Public-transport to (.*)/i;
  const boardTrainRegex = /(\d{2}:\d{2}(?: ?– board)?)\s*–\s*board (S-Bahn S\d+|U-Bahn U\d+)(?: toward (.*?))? at “(.*?)” station/i;
  const rideDurationRegex = /Ride ~(\d+ min)\./i;
  const arriveStationRegex = /(\d{2}:\d{2})\s*–\s*arrive (.*?)(\s*\(last stop\))?\./i;
  const ticketInfoRegex = /Single ticket (.*?) \((.*?)\) covers the whole trip/i;
  const walkRegex = /Walk \d+ m \(≈\d+ min\): (.*)/i;
  const etaRegex = /ETA at (.*?): (.*)/i;
  const addressRegex = /^(Neckarstraße 21b, 12053 Berlin, Germany)/i;

  const timePattern = '(\\d{1,2}:\\d{2}(?:\\s?(?:am|pm|AM|PM))?)';
  const departureRegex = new RegExp(`^Departure: (.*?) at ${timePattern}(?: \\((.*?)\\))?`, 'i');
  const trainDetailsRegex = /^(\w+ \d+), Seats: (.*?), Reservation No.: (.*)/i;
  const arrivalInRegex = new RegExp(`^Arrival (?:in|at) (.*?)(?: at|: )${timePattern}`, 'i');
  const transferRegex = new RegExp(`^Transfer(?: at|:) (.*?)(?:, depart at |, depart )${timePattern}`, 'i');
  
  const continueToRegex = /Continue from (.*?) to (.*)/i;
  const stayAtRegex = /^(?:Stay|Stay in Menaggio) at (.*?)(?:, res under (.*?))?$/i; // "Stay at Gasthaus Hof" or "Stay in Menaggio at this Airbnb"
  const overnightRegex = /^Overnight: (.*?)(?:\s+\((.*?)\))?$/i;
  const accommodationArrivalRegex = /^Arrival at hotel:?\s*~?(\d{1,2}:\d{2}(?:\s?(?:am|pm|AM|PM))?)/i;

  const routeStartRegex = /^Route:$/i;
  const distanceRegex = /^Distance: (.*)/i;
  const timeDetailRegex = /^Time: (.*)/i; // Specifically for hike duration etc.
  const elevationGainRegex = /^Elevation Gain: (.*)/i;
  const elevationDetailRegex = /^Elevation: (.*)/i; // Combined loss/gain
  const difficultyRegex = /^Difficulty: (.*)/i;
  const notesStartRegex = /^Notes:$/i;

  const trainPlatformRegex = /^Train: Go to Platform\s*(\w+) at (.*?)\.(?:.*?(S\d+ toward .*?)), open seating/i;
  const trainTransferPlatformRegex = /^Train: From your arrival platform.*?Platform\s*(\w+)\. Board.*? (IR .*?|IC \d+ toward .*?), open seating/i;
  const busTransferRegex = /^Bus: Exit the train.*?Stop\s*(\w+)\.\s*(Panorama-express BP \d+ toward .*?)(?:\s*\(mandatory free seat reservation.*?\))?/i;
  const reservationNoRegex = /^Reservation No.: (.*)/i;

  const privateTaxiRegex = /^Private Taxi Transfer: (.*?) → (.*)/i;
  const uberFromRegex = /^Uber from (.*?) to (.*)/i;
  const uberToRegex = /^Uber to (.*)/i;
  const pickupAddressRegex = /^Pickup Address: (.*)/i;
  const pickupTimeRegex = /^Pickup Time: (.*)/i;
  const driverContactRegex = /^Driver Contact: (.*)/i;
  const emailRegex = /^Email: (.*)/i;
  const phoneRegex = /^Phone \(WhatsApp\): (.*)/i;
  const confirmedPriceRegex = /^Confirmed Price: (.*)/i;
  const paymentRegex = /^Payment: (.*)/i;
  const flightDepartureRegex = /^Flight (\w+ \d+) from (.*?) at (\d{1,2}:\d{2}(?:am|pm)?)/i;

  function finalizeRouteDescription() {
    if (isParsingRouteDescription && routeDescriptionLines.length > 0 && currentEventContext && currentEventContext.type === EventType.ACTIVITY && currentEventContext.activity) {
      currentEventContext.activity.description = (currentEventContext.activity.description || "") + "\n" + routeDescriptionLines.join('\n').trim();
    }
    routeDescriptionLines = [];
    isParsingRouteDescription = false;
  }
  
  let dayCounter = 0; // For June XX titles

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '' && isParsingRouteDescription) { // Empty line can signify end of route block
      finalizeRouteDescription();
      continue;
    }
    if (!line && !isParsingRouteDescription) continue;


    const dayTitleMatch = line.match(dayTitleRegex);
    const juneDateMatch = line.match(juneDateTitleRegex);

    if (dayTitleMatch || juneDateMatch) {
      finalizeRouteDescription(); // Finalize any pending route from previous day.
      dayCounter++;
      let id, title, dateRange, mainLoc;
      if (dayTitleMatch) {
        id = `day${dayTitleMatch[1].replace('-', '_')}`;
        title = dayTitleMatch[2].trim();
        dateRange = dayTitleMatch[3].trim();
      } else if (juneDateMatch) {
        id = `day_june${juneDateMatch[1].split(' ')[1] || dayCounter}`;
        title = juneDateMatch[2].trim();
        dateRange = juneDateMatch[1].trim();
      } else { continue; } // Should not happen

      if (title.toLowerCase().includes("berlin")) mainLoc = "Berlin";
      else if (title.toLowerCase().includes("appenzell")) mainLoc = "Appenzell";
      else if (title.toLowerCase().includes("äscher") || title.toLowerCase().includes("ebenalp")) mainLoc = "Swiss Alps (Äscher/Ebenalp)";
      else if (title.toLowerCase().includes("seealpsee") || title.toLowerCase().includes("meglisalp")) mainLoc = "Swiss Alps (Seealpsee/Meglisalp)";
      else if (title.toLowerCase().includes("italy") || title.toLowerCase().includes("como")) mainLoc = "Lake Como, Italy";
      else if (title.toLowerCase().includes("milan")) mainLoc = "Milan, Italy";


      currentDay = { id, title, dateRange, mainLocation: mainLoc, events: [] };
      days.push(currentDay);
      currentEventContext = null;
      continue;
    }

    if (!currentDay) continue;

    if (isParsingRouteDescription) {
      // Check if the current line starts a new type of detail or is clearly not part of route description
      if (line.match(distanceRegex) || line.match(timeDetailRegex) || line.match(elevationGainRegex) || line.match(elevationDetailRegex) || line.match(difficultyRegex) || line.match(overnightRegex) || line.match(stayAtRegex) || line.match(departureRegex) || line.match(dayTitleRegex) || line.match(juneDateTitleRegex) || line.startsWith("—") ) {
        finalizeRouteDescription();
        // Reprocess current line now that route description is finalized
      } else {
        routeDescriptionLines.push(line);
        continue;
      }
    }
    
    let event: ItineraryEvent | null = null;
    let consumedLines = 0;

    // Helper to add notes to currentEventContext or a new event's segment/accommodation
    const addNoteToContext = (note: string, targetEvent?: ItineraryEvent) => {
      const target = targetEvent || currentEventContext;
      if (target) {
        if (target.travelSegment) {
          target.travelSegment.notes = target.travelSegment.notes || [];
          target.travelSegment.notes.push(note);
        } else if (target.accommodation) {
          target.accommodation.notes = target.accommodation.notes || [];
          target.accommodation.notes.push(note);
        } else if (target.activity) {
          target.activity.notes = target.activity.notes || [];
          target.activity.notes.push(note);
        } else { // general event
            target.description = (target.description ? target.description + "\n" : "") + note;
        }
      }
    };
    
    if (line.match(notesStartRegex)) {
      let k = i + 1;
      while (k < lines.length) {
        const next = lines[k].trim();
        if (!next || next.match(dayTitleRegex) || next.match(juneDateTitleRegex) || next.match(departureRegex) ||
            next.match(arrivalInRegex) || next.match(transferRegex) || next.match(boardTrainRegex) ||
            next.match(privateTaxiRegex) || next.match(flightDepartureRegex) || next.match(continueToRegex) ||
            next.match(stayAtRegex) || next.match(overnightRegex) || next.match(routeStartRegex)) {
          break;
        }
        addNoteToContext(next);
        k++;
      }
      i = k - 1;
      continue;
    }

    const flightArrivalMatch = line.match(flightArrivalRegex);
    if (flightArrivalMatch) {
      event = { type: EventType.TRAVEL, time: flightArrivalMatch[1].trim(), travelSegment: { mode: 'flight', details: `Flight ${flightArrivalMatch[3]}`, operator: flightArrivalMatch[3].split(' ')[0], to: flightArrivalMatch[2]?.trim(), arrivalTime: flightArrivalMatch[1].trim(), notes: [] }};
      if (lines[i+1] && lines[i+1].trim().startsWith("(prior flight is")) { addNoteToContext(lines[i+1].trim(), event); consumedLines++; }
    } else if (line.match(publicTransportToRegex)) {
      const match = line.match(publicTransportToRegex)!;
      event = { type: EventType.TRAVEL, travelSegment: { mode: 'public_transport', details: `Public transport to ${match[1]}`, to: match[1], notes: [] }};
    } else if (line.match(boardTrainRegex)) {
      const match = line.match(boardTrainRegex)!;
      event = { type: EventType.TRAVEL, time: match[1].replace('– board', '').trim(), travelSegment: { mode: 'train', operator: match[2], details: `Board ${match[2]}${match[3] ? ` toward ${match[3]}` : ''} at ${match[4]}`, from: match[4], to: match[3]?.trim(), departureTime: match[1].replace('– board', '').trim(), notes: [] }};
      if (lines[i+1] && lines[i+1].trim().match(ticketInfoRegex)) { const m = lines[i+1].trim().match(ticketInfoRegex)!; addNoteToContext(`Ticket: ${m[1]} (${m[2]})`, event); consumedLines++; }
      if (lines[i+consumedLines+1] && lines[i+consumedLines+1].trim().match(rideDurationRegex)) { const m = lines[i+consumedLines+1].trim().match(rideDurationRegex)!; if(event.travelSegment) event.travelSegment.duration = m[1]; consumedLines++; }
    } else if (line.match(arriveStationRegex)) {
      const match = line.match(arriveStationRegex)!;
      event = { type: EventType.TRAVEL, time: match[1], travelSegment: { mode: 'train', details: `Arrive at ${match[2].trim()}${match[3] || ''}`, to: match[2].trim(), arrivalTime: match[1] }};
      if (lines[i+1] && lines[i+1].trim().startsWith("Follow “U8” signs")) { addNoteToContext(lines[i+1].trim(), event); consumedLines++; }
    } else if (line.match(walkRegex)) {
      const match = line.match(walkRegex)!;
      event = { type: EventType.TRAVEL, travelSegment: { mode: 'walk', details: `Walk: ${match[1]}` }};
    } else if (line.match(etaRegex)) {
      const match = line.match(etaRegex)!;
      event = { type: EventType.GENERAL, time: match[2].replace('~','').trim(), description: `ETA at ${match[1]}: ${match[2]}` };
    } else if (line.match(addressRegex)) {
      event = { type: EventType.GENERAL, description: `Destination Address: ${line}` };
    } else if (line.match(departureRegex)) {
      const match = line.match(departureRegex)!;
      const from = match[1]; const time = match[2]; const extra = match[3];
      let details = `Depart from ${from} at ${time}`;
      if (extra) details += ` (${extra})`;
      let operator, reservationInfo;
      const notes: string[] = [];
      if (lines[i+1] && (lines[i+1].toLowerCase().includes('jenn booking train tickets') || lines[i+1].toLowerCase().includes('(jenn booking tickets)'))) {
          notes.push(lines[i+1].replace('(Jenn booking tickets)','Jenn booking tickets').trim());
          consumedLines++;
      }
      const trainDetailsMatch = lines[i+consumedLines+1]?.match(trainDetailsRegex);
      if (trainDetailsMatch) {
        operator = trainDetailsMatch[1].split(" ")[0];
        details = `${trainDetailsMatch[1]} from ${from}`;
        reservationInfo = `Seats: ${trainDetailsMatch[2]}, Reservation No.: ${trainDetailsMatch[3]}`;
        consumedLines++;
      }
      event = { type: EventType.TRAVEL, time, travelSegment: { mode: 'train', details, from, departureTime: time, operator, reservationInfo, notes: notes.length > 0 ? notes : undefined }};
    } else if (line.match(arrivalInRegex)) {
      const match = line.match(arrivalInRegex)!;
      let mode: TravelSegment['mode'] = 'train';
      if (currentEventContext?.travelSegment?.mode === 'bus') mode = 'bus'; // Inherit mode if it was a bus transfer
      event = { type: EventType.TRAVEL, time: match[2], travelSegment: { mode, details: `Arrival at ${match[1]} at ${match[2]}`, to: match[1], arrivalTime: match[2] }};
    } else if (line.match(transferRegex)) {
      const match = line.match(transferRegex)!;
      const loc = match[1].trim(); const time = match[2].trim();
      let mode: TravelSegment['mode'] = 'train'; let details = `Transfer at ${loc}, depart ${time}`; let operator, reservationInfo, platform;
      const notes: string[] = [];
      const nextLine1 = lines[i+1]?.trim();
      const nextLine2 = lines[i+2]?.trim();

      const trainDetailsMatch = nextLine1?.match(trainDetailsRegex); // ICE 703, Seats...
      const trainPlatformMatch = nextLine1?.match(trainPlatformRegex); // Train: Go to Platform 3A... S23...
      const trainTransferPlatformMatch = nextLine1?.match(trainTransferPlatformRegex); // Train: From your arrival platform... IR Voralpen...
      const busTransferMatch = nextLine1?.match(busTransferRegex); // Bus: Exit the train... Panorama-express...
      
      if (trainDetailsMatch) {
        operator = trainDetailsMatch[1].split(" ")[0];
        details = `${trainDetailsMatch[1]} from ${loc}`;
        reservationInfo = `Seats: ${trainDetailsMatch[2]}, Reservation No.: ${trainDetailsMatch[3]}`;
        consumedLines++;
      } else if (trainPlatformMatch) {
        platform = trainPlatformMatch[1];
        operator = trainPlatformMatch[3].split(" ")[0];
        details = `${trainPlatformMatch[3]} from ${loc} (Platform ${platform})`;
        if (nextLine1?.includes("open seating")) notes.push("open seating");
        if (nextLine1?.includes("local commuter train")) notes.push("local commuter train");
        consumedLines++;
      } else if (trainTransferPlatformMatch) {
        platform = trainTransferPlatformMatch[1];
        operator = trainTransferPlatformMatch[2].split(" ")[0];
        details = `${trainTransferPlatformMatch[2]} from ${loc} (Platform ${platform})`;
        if (nextLine1?.includes("open seating")) notes.push("open seating");
        if (nextLine1?.includes("café trolley available")) notes.push("café trolley available");
        if (nextLine1?.includes("dining car available")) notes.push("dining car available");
        consumedLines++;
      } else if (busTransferMatch) {
        mode = 'bus';
        platform = `Stop ${busTransferMatch[1]}`; // Bus stop
        operator = busTransferMatch[2].split(" ")[0];
        details = `${busTransferMatch[2]} from ${loc} (${platform})`;
        if (nextLine1?.includes("mandatory free seat reservation")) notes.push("mandatory free seat reservation via SBB Mobile");
        consumedLines++;
        if (lines[i+consumedLines+1]?.match(reservationNoRegex)) {
            notes.push(lines[i+consumedLines+1].trim());
            consumedLines++;
        }
      }
      event = { type: EventType.TRAVEL, description: `Transfer at ${loc}`, travelSegment: { mode, details, from: loc, departureTime: time, operator, reservationInfo, platform, notes: notes.length > 0 ? notes: undefined }};
    } else if (line.match(continueToRegex)) {
        const match = line.match(continueToRegex)!;
        event = { type: EventType.TRAVEL, travelSegment: { mode: 'train', details: `Continue from ${match[1]} to ${match[2]} (local connection, tickets not reserved)`, from: match[1], to: match[2], notes:["local connection, tickets not reserved"]}};
    } else if (line.match(stayAtRegex)) {
      const match = line.match(stayAtRegex)!;
      const notes: string[] = [];
      if (match[1].toLowerCase().includes('airbnb')) {
          notes.push("Stay in Menaggio at this Airbnb");
      }
      event = { type: EventType.ACCOMMODATION, accommodation: { name: match[1].trim(), reservationDetails: match[2] ? `Reservation under ${match[2].trim()}` : undefined, notes: notes.length > 0 ? notes : [] }};
      // Greedily consume following lines as notes if they don't start a new major event type
      let k = i + 1;
      while(k < lines.length) {
          const nextL = lines[k].trim();
          if(!nextL || nextL.match(dayTitleRegex) || nextL.match(juneDateTitleRegex) || nextL.match(departureRegex) || nextL.match(routeStartRegex) || nextL.match(stayAtRegex) || nextL.match(overnightRegex) || nextL.match(privateTaxiRegex) || nextL.match(flightDepartureRegex)) break;

          const arrivalMatch = nextL.match(accommodationArrivalRegex);
          if (arrivalMatch) {
              event.accommodation!.arrivalTime = arrivalMatch[1];
          } else if (nextL.match(notesStartRegex)) {
              k++;
              while(k < lines.length) {
                  const noteLine = lines[k].trim();
                  if(!noteLine || noteLine.match(dayTitleRegex) || noteLine.match(juneDateTitleRegex) || noteLine.match(departureRegex) || noteLine.match(routeStartRegex) || noteLine.match(stayAtRegex) || noteLine.match(overnightRegex) || noteLine.match(privateTaxiRegex) || noteLine.match(flightDepartureRegex)) break;
                  addNoteToContext(noteLine, event);
                  k++;
              }
              break;
          } else {
              addNoteToContext(nextL, event);
          }
          k++;
      }
      consumedLines += (k - (i+1));
    } else if (line.match(overnightRegex)) {
      const match = line.match(overnightRegex)!;
      event = { type: EventType.ACCOMMODATION, accommodation: { name: match[1].trim(), reservationDetails: match[2]?.trim(), notes: [] }};
      let k = i + 1;
      while(k < lines.length) {
          const nextL = lines[k].trim();
          if(!nextL || nextL.match(dayTitleRegex) || nextL.match(juneDateTitleRegex) || nextL.match(departureRegex) || nextL.match(routeStartRegex) || nextL.match(stayAtRegex) || nextL.match(overnightRegex) || nextL.match(privateTaxiRegex)|| nextL.match(flightDepartureRegex)) break;

          const arrivalMatch = nextL.match(accommodationArrivalRegex);
          if (arrivalMatch) {
              event.accommodation!.arrivalTime = arrivalMatch[1];
          } else if (nextL.match(notesStartRegex)) {
              k++;
              while(k < lines.length) {
                  const noteLine = lines[k].trim();
                  if(!noteLine || noteLine.match(dayTitleRegex) || noteLine.match(juneDateTitleRegex) || noteLine.match(departureRegex) || noteLine.match(routeStartRegex) || noteLine.match(stayAtRegex) || noteLine.match(overnightRegex) || noteLine.match(privateTaxiRegex)|| noteLine.match(flightDepartureRegex)) break;
                  addNoteToContext(noteLine, event);
                  k++;
              }
              break;
          } else {
              addNoteToContext(nextL, event);
          }
          k++;
      }
      consumedLines += (k - (i+1));
    } else if (line.match(routeStartRegex)) {
      finalizeRouteDescription(); // Finalize previous if any (shouldn't happen mid-route)
      isParsingRouteDescription = true;
      const hikeTitleMatch = currentDay.title.match(/.*?→\s*(.*?)(?:\s*→\s*(.*?))?(?:\/|$)/i);
      let hikeTitle = "Hike";
      if (hikeTitleMatch) {
        hikeTitle = `Hike: ${hikeTitleMatch[1].trim()}`;
        if (hikeTitleMatch[2]) hikeTitle += ` → ${hikeTitleMatch[2].trim()}`;
      }
      event = { type: EventType.ACTIVITY, activity: { title: hikeTitle, description: "", notes: [] }};
    } else if (currentEventContext && currentEventContext.type === EventType.ACTIVITY && currentEventContext.activity && !isParsingRouteDescription) {
      const activity = currentEventContext.activity;
      const distanceMatch = line.match(distanceRegex);
      const timeMatch = line.match(timeDetailRegex);
      const elevationGainMatch = line.match(elevationGainRegex);
      const elevationDetailMatch = line.match(elevationDetailRegex); // e.g. Elevation: -500 m descent, +400 m ascent
      const difficultyMatch = line.match(difficultyRegex);

      if (distanceMatch) activity.distance = distanceMatch[1];
      else if (timeMatch) activity.time = timeMatch[1];
      else if (elevationGainMatch) activity.elevationGain = elevationGainMatch[1];
      else if (elevationDetailMatch) {
          const parts = elevationDetailMatch[1].split(',');
          parts.forEach(part => {
              if (part.includes("descent")) activity.elevationLoss = part.trim();
              if (part.includes("ascent")) activity.elevationGain = (activity.elevationGain ? activity.elevationGain + ", " : "") + part.trim();
          });
      }
      else if (difficultyMatch) activity.difficulty = difficultyMatch[1];
      else if (line.startsWith("—") || line.startsWith("(")) { // comment lines often start with these
          addNoteToContext(line);
      }
    } else if (line.match(privateTaxiRegex)) {
        const match = line.match(privateTaxiRegex)!;
        event = { type: EventType.TRAVEL, travelSegment: { mode: 'taxi', details: `Private Taxi: ${match[1]} → ${match[2]}`, from: match[1], to: match[2], notes: [] }};
        let k = i + 1;
        while(k < lines.length) {
            const nextL = lines[k].trim();
            if (!nextL || nextL.match(dayTitleRegex) || nextL.match(juneDateTitleRegex) || nextL.match(flightDepartureRegex) || nextL.match(privateTaxiRegex)) break;
            if (nextL.match(pickupAddressRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else if (nextL.match(pickupTimeRegex)) { if(event.travelSegment) { event.travelSegment.departureTime = nextL.match(pickupTimeRegex)![1]; event.travelSegment.notes?.push(nextL); }}
            else if (nextL.match(driverContactRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else if (nextL.match(emailRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else if (nextL.match(phoneRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else if (nextL.match(confirmedPriceRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else if (nextL.match(paymentRegex)) { if(event.travelSegment) event.travelSegment.notes?.push(nextL); }
            else { break; } // Unknown line, stop consuming for taxi
            k++;
        }
        consumedLines += (k - (i+1));
    } else if (line.match(uberFromRegex)) {
        const match = line.match(uberFromRegex)!;
        event = { type: EventType.TRAVEL, travelSegment: { mode: 'taxi', details: `Uber from ${match[1]} to ${match[2]}`, from: match[1], to: match[2], notes: [] }};
    } else if (line.match(uberToRegex)) {
        const match = line.match(uberToRegex)!;
        event = { type: EventType.TRAVEL, travelSegment: { mode: 'taxi', details: `Uber to ${match[1]}`, to: match[1], notes: [] }};
    } else if (line.match(flightDepartureRegex)) {
        const match = line.match(flightDepartureRegex)!;
        event = { type: EventType.TRAVEL, time: match[3], travelSegment: { mode: 'flight', details: `Flight ${match[1]} from ${match[2]}`, operator: match[1].split(" ")[0], from: match[2], departureTime: match[3], notes: [] }};
        if (lines[i+1] && lines[i+1].trim().startsWith("(then UA")) { addNoteToContext(lines[i+1].trim(), event); consumedLines++; }
    } else if (line.toLowerCase().includes("hang out in berlin")) {
        event = {type: EventType.ACTIVITY, activity: { title: "Hang out in Berlin", description: "Explore the city and enjoy local attractions."}};
    } else if (line.toLowerCase().includes("lake como") && currentDay.title.toLowerCase().includes("lake como")) {
        // This is usually part of day title, special handling might be needed if it's a standalone line
        // For now, assume day title handles it. If it's a specific activity line:
        // event = {type: EventType.ACTIVITY, activity: { title: "Enjoy Lake Como", description: "Relax and explore the surroundings."}};
    } else if (line.startsWith("— ") || line.startsWith("(") && line.endsWith(")")) { // Informational notes
        if(currentEventContext) addNoteToContext(line);
        else event = { type: EventType.GENERAL, description: line }; // If no context, make it a general event
    }
    

    if (event) {
      currentDay.events.push(event);
      currentEventContext = event;
    }
    i += consumedLines; // Advance index by number of consumed lines
  }

  finalizeRouteDescription(); // Finalize any route description at the very end of parsing.

  // Post-processing: Add implicit activities if not parsed explicitly
  days.forEach(day => {
    if (day.title.toLowerCase().includes("hang out in berlin") && !day.events.some(e => e.activity?.title.toLowerCase().includes("hang out in berlin"))) {
        day.events.unshift({type: EventType.ACTIVITY, activity: { title: "Hang out in Berlin", description: "Explore the city, visit sights, and enjoy the local culture."}});
    }
    if (day.title.toLowerCase().includes("lake como") && !day.events.some(e => e.activity?.title.toLowerCase().includes("lake como"))) {
        day.events.unshift({type: EventType.ACTIVITY, activity: { title: "Enjoy Lake Como", description: "Relax by the lake, explore Menaggio, take ferry trips, and enjoy Italian cuisine."}});
    }
  });

  return { title: "European Adventure Itinerary", days };
}
