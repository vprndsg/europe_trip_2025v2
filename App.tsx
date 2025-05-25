
import React, { useState, useEffect } from 'react';
import { Itinerary, ItineraryDay as ItineraryDayType } from './types';
import { parseItinerary } from './services/itineraryParser';
import ItineraryDayCard from './components/ItineraryDayCard';
import Header from './components/Header';
import Footer from './components/Footer';
import InteractiveMap from './components/InteractiveMap';
import { mapLocations, findLocationId, getLocationById } from './mapLocations';
import { LoadingSpinnerIcon, MapIcon, EyeIcon, EyeSlashIcon } from './components/IconComponents';

const rawItineraryData = `
Day 1-2 fly to Berlin (June 14-15)
Arrive 6pm to BER on UA 8715 (prior flight is UA 926 to FRA)
Public-transport to Neckarstraße 21b, 12053 Berlin

18:19 – board S-Bahn S45 toward Südkreuz at “BER T1-2” station (trains every 20 min).
– Single ticket Berlin ABC (€4.40) covers the whole trip; buy at DB/BVG machines or in the BVG app.
– Ride ~34 min.

18:53 – arrive Hermannstraße (last stop). Follow “U8” signs downstairs.

18:57 – board U-Bahn U8 toward Wittenau; ride 1 stop (~2 min).

18:59 – arrive Boddinstraße.

Walk 400 m (≈5 min): exit toward Boddinstraße, head south, turn right on Neckarstraße to 21b.

ETA at Jenn’s house: ~19:05

Neckarstraße 21b, 12053 Berlin, Germany

Days 2-5 hang out in berlin (June 15-18, 2 full days)

Day 5 travel to Appenzell, stay there (June 18)
Jenn booking train tickets - leave Berlin 9:40am
Departure: Berlin Südkreuz at 09:41 (Jenn booking tickets)
ICE 703, Seats: Wagon 7, Seats 123, 124, 127, 128 (2 window, 2 aisle, table seating, open coach, mobile-friendly)
Reservation No.: 804880024364

Arrival in München Hbf: 14:02

Transfer at München Hbf: Depart at 14:54
EC 190, Seats: Wagon 4, Seats 61, 62, 63, 68 (2 window, 2 aisle, open coach)
Reservation No.: 804880024366

Arrival in St. Gallen (CH): 17:28

Continue from St. Gallen to Appenzell
(local connection, tickets not reserved)

Stay at Gasthaus Hof , res under Eileen for 2 double rooms

June 19: Appenzell → Äscher/Ebenalp
Route:
From Appenzell, follow yellow Wanderweg signs toward Schlatt–Schwende and Wasserauen.
At Wasserauen station (852 m), take the white-red-white mountain path marked “Wildkirchli / Ebenalp.”
Ascend via Alp Bommen and Gartenwald, passing through the Wildkirchli caves.
Reach Berggasthaus Äscher, then take the short steep path up to Berggasthaus Ebenalp near the cable car station.
Distance: ~12 km
Time: 4.5–5 hours
Elevation Gain: +900 m
Difficulty: SAC T2 (well-marked mountain path; steep and rocky in upper sections)
Overnight: Berggasthaus Ebenalp (confirmed)
80 CHF/person plus extra for dinner

June 20: Ebenalp → Seealpsee → Meglisalp
Route:
Descend via the same path past Äscher to Seealpsee (marked “Seealpsee 1 h”).
Follow the eastern lakeshore trail, stopping at Seealpsee for lunch and dairy visit (Alpkäserei).
From Seealpsee, follow signs (“Meglisalp 1½ h / 2.4 km”) ascending steadily through alpine pastures and forest to Meglisalp (1517 m).
Distance: ~7 km
Time: 3–4 hours (not including stops)
Elevation: -500 m descent, +400 m ascent
Difficulty: SAC T2 (steep descent, steady ascent)
Overnight: Berggasthaus Meglisalp
2 double rooms (bring cash)
Dinner: 5:30–7:30 pm
Hot tub: 8:00–10:00 pm
620 CHF total for res + hotpot + breakfast (155 CHF/pp) plus extra for dinner

June 21: Meglisalp → Appenzell
Route:
Descend the same marked trail from Meglisalp down to Seealpsee, then continue down the gravel path to Wasserauen (marked “Wasserauen 1 h”).
From Wasserauen, follow gentle valley footpath marked “Appenzell 1¾ h,” along Schwendebach and Sitter streams into town. (Optionally shorten by train.)
Distance: ~12 km
Time: ~4 hours total
Elevation: -740 m descent, mostly gentle valley terrain after initial descent
Difficulty: SAC T1–T2 (steep descent initially, then easy valley trails)
Overnight: Gasthaus Hof, Appenzell
Reservation under Eileen (quad room)

Day 9 transit to Italy (June 22)
Departure: Appenzell at 10:30.
Train: Go to Platform 3A at Appenzell Bahnhof. Look for the blue‑white sign S23 Gossau SG. S23 toward Gossau SG, open seating (local commuter train)
Arrival: Herisau at 11:00

Transfer: Herisau, depart at 11:13
Train: From your arrival platform take the stairs under the tracks to Platform 1. Board the red‑white train marked IR Voralpen‑Express → Luzern. IR Voralpen-Express toward Luzern, open seating (café trolley available)
Arrival: Arth-Goldau at 12:45

Transfer: Arth-Goldau, depart at 12:49
Train: Quick three‑minute change: use the underground passage to Platform 5 for IC 21 → Lugano. IC 21 toward Lugano, open seating (optional seat reservation, dining car available)
Arrival: Lugano at 14:02

Transfer: Lugano (walk 5 min to Lugano Stazione Nord, Stop D), depart at 14:40
Bus: Exit the train, follow yellow “Bus” pictograms to the station forecourt, then right for “Stazione Nord” bus stands. Stand at Stop D. Panorama-express BP 631 toward St. Moritz Bahnhof (mandatory free seat reservation via SBB Mobile, seat number issued upon booking)
Reservation No.: [TBA after booking]
Arrival: Menaggio, Hotel Bellavista at 15:27

Stay: Hotel Bellavista, Menaggio

Days 10-14 Lake Como (June 23-26, 3 full days)
Stay in Menaggio at this Airbnb

Day 14 go home from Milan (June 26)
Private Taxi Transfer: Menaggio → Milan Malpensa Airport (MXP)
Pickup Address: Via IV Novembre 6, 22017 Menaggio
Pickup Time: 10:00 AM (recommended by driver, Sara Vanzini)
Driver Contact: Sara Vanzini
Email: rivatecabmenaggio@gmail.com
Phone (WhatsApp): +39 3338601035
Confirmed Price: €200 total (including tolls/surcharges)
Payment: (Payment methods to be confirmed with driver directly)

Flight EN 8811 from MXP at 2:35pm (then UA 927 from FRA > SFO)
`;

function buildRouteLines(itin: Itinerary): [number, number][][] {
  const lines: [number, number][][] = [];
  let lastPos: [number, number] | undefined;
  itin.days.forEach(day => {
    day.events.forEach(event => {
      const seg = event.travelSegment;
      if (seg) {
        const fromId = findLocationId(seg.from);
        const toId = findLocationId(seg.to);
        const from = fromId ? getLocationById(fromId) : undefined;
        const to = toId ? getLocationById(toId) : undefined;
        const start = from?.position || lastPos;
        const end = to?.position;
        if (start && end) {
          lines.push([start, end]);
          lastPos = end;
        } else if (end) {
          if (lastPos) {
            lines.push([lastPos, end]);
          }
          lastPos = end;
        } else if (from) {
          lastPos = from.position;
        }
      }
    });
  });
  return lines;
}

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [routeLines, setRouteLines] = useState<[number, number][][]>([]);

  useEffect(() => {
    try {
      setIsLoading(true);
      const parsedData = parseItinerary(rawItineraryData);
      setItinerary(parsedData);
      setRouteLines(buildRouteLines(parsedData));
      setError(null);
    } catch (e) {
      console.error("Error parsing itinerary:", e);
      setError("Failed to parse itinerary data. Please check the console for details.");
      setItinerary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    if (!showMap) setShowMap(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100 flex flex-col">
      <Header title={itinerary?.title || "Trip Itinerary"} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
            aria-live="polite"
            aria-pressed={showMap}
          >
            {showMap ? <EyeSlashIcon className="w-5 h-5 mr-2" /> : <EyeIcon className="w-5 h-5 mr-2" />}
            {showMap ? 'Hide Live Map' : 'Show Live Map'}
          </button>
        </div>

        {showMap && (
          <div className="mb-8 p-4 bg-slate-800 rounded-lg shadow-xl sticky top-20 z-40">
            <InteractiveMap
              markers={mapLocations}
              lines={routeLines}
              selectedLocationId={selectedLocationId}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinnerIcon className="w-12 h-12 text-sky-400" />
            <p className="ml-4 text-xl text-sky-300">Loading your amazing trip...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-700 border border-red-900 text-white px-6 py-4 rounded-lg shadow-xl">
            <h3 className="font-bold text-xl mb-2">Oops! Something went wrong.</h3>
            <p>{error}</p>
          </div>
        )}
        {itinerary && !isLoading && !error && (
          <div className="space-y-8">
            {itinerary.days.map((day: ItineraryDayType) => (
              <ItineraryDayCard key={day.id} day={day} onSelectLocation={handleSelectLocation} selectedLocationId={selectedLocationId} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;

