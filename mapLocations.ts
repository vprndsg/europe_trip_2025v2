export interface MapLocation {
  id: string;
  name: string;
  position: [number, number];
  aliases?: string[];
  notes?: string;
}

export const mapLocations: MapLocation[] = [
  { id: 'berlin-city', name: 'Berlin City Centre', position: [52.52, 13.405], aliases: ['berlin', 'berlin city'] },
  { id: 'ber-airport', name: 'BER T1-2', position: [52.3651, 13.5098], aliases: ['ber t1-2', 'ber airport', 'berlin airport', 'berlin brandenburg airport', 'ber'] },
  { id: 'neckarstrasse-21b', name: 'Neckarstraße 21b', position: [52.480248, 13.434019], aliases: ['neckarstraße 21b'] },
  { id: 'berlin-sudkreuz', name: 'Berlin Südkreuz', position: [52.4753, 13.3658], aliases: ['südkreuz', 'berlin südkreuz', 'suedkreuz'] },
  { id: 'appenzell', name: 'Appenzell', position: [47.3308, 9.4088], aliases: ['appenzell'] },
  { id: 'gasthaus-hof', name: 'Gasthaus Hof', position: [47.330981, 9.407536], aliases: ['gasthaus hof', 'gasthof-hotel hof', 'gasthof-hotel hof ag'] },
  { id: 'munich-hbf', name: 'München Hbf', position: [48.1402, 11.5585], aliases: ['munich hbf', 'münchen hbf', 'munchen hbf'] },
  { id: 'st-gallen', name: 'St. Gallen', position: [47.4239, 9.3748], aliases: ['st. gallen', 'st gallen'] },
  { id: 'herisau', name: 'Herisau', position: [47.3862, 9.2792], aliases: ['herisau'] },
  { id: 'arth-goldau', name: 'Arth-Goldau', position: [47.0481, 8.5254], aliases: ['arth-goldau', 'arth goldau'] },
  { id: 'aescher', name: 'Berggasthaus Äscher', position: [47.2843, 9.4149], aliases: ['äscher', 'aescher'] },
  {
    id: 'ebenalp',
    name: 'Berggasthaus Ebenalp',
    position: [47.283197, 9.411678],
    aliases: ['ebenalp', 'berggasthaus ebenalp']
  },
  { id: 'seealpsee', name: 'Seealpsee', position: [47.2698, 9.4026], aliases: ['seealpsee'] },
  { id: 'meglisalp',
    name: 'Meglisalp hamlet',
    position: [47.2559, 9.3856],
    aliases: ['meglisalp', 'meglisalp hamlet'],
    notes: 'Early-morning mist around the 15th-century chapel and stone barns.'
  },
  { id: 'lugano', name: 'Lugano', position: [46.0055, 8.9469], aliases: ['lugano'] },
  {
    id: 'menaggio-airbnb',
    name: 'Airbnb – Via IV Novembre 6',
    position: [46.0167, 9.2333],
    aliases: [
      'menaggio airbnb',
      'airbnb via iv novembre 6',
      'via iv novembre 6',
      'this airbnb'
    ],
    notes: 'Your lakeside flat; pin helps the app pan straight to the door.'
  },
  // Berlin food & drink spots
  {
    id: 'hops-barley',
    name: 'Hops & Barley Hausbrauerei',
    position: [52.5090, 13.4606],
    aliases: ['hops & barley', 'hops and barley', 'hops barley'],
    notes: 'Tiny Friedrichshain brew-pub pouring its own unfiltered Märzen, plus bratwurst rolls on weekend nights'
  },
  {
    id: 'brlo-gleisdreieck',
    name: 'BRLO Brwhouse',
    position: [52.49997, 13.37353],
    aliases: ['brlo', 'brlo brwhouse', 'brlo gleisdreieck'],
    notes: 'Container-built beer-garden in Park am Gleisdreieck; order the house Helles and a smoked-sausage platter'
  },
  {
    id: 'konnopkes',
    name: 'Konnopke\u2019s Imbiss',
    position: [52.54066, 13.41219],
    aliases: ["konnopke's", 'konnopkes', 'konnopke\u2019s imbiss'],
    notes: 'Berlin\u2019s classic Currywurst stand under the elevated U2—cheap, quick, iconic'
  },
  {
    id: 'fotoimpex',
    name: 'Fotoimpex (analog-camera shop)',
    position: [52.5200, 13.4049],
    aliases: ['fotoimpex', 'fotoimpex berlin'],
    notes: 'Your go-to for film, batteries and last-minute lens wipes before the Alps leg (store is on Alte Sch\u00F6nhauser Str. 32B)'
  },
  {
    id: 'east-side-gallery',
    name: 'East Side Gallery (Oberbaumbr\u00fccke end)',
    position: [52.5050, 13.4396],
    aliases: ['east side gallery', 'oberbaumbr\u00fccke end'],
    notes: '1.3 km of Berlin-Wall murals; go at golden hour for side-lit color and Spree reflections.'
  },

  // Appenzell stops
  {
    id: 'locher-brewery',
    name: 'Brauerei Locher AG / “Qu\u00F6llfrisch” Visitor-Centre',
    position: [47.33099, 9.41246],
    aliases: ['brauerei locher', 'qu\u00F6llfrisch', 'locher brewery'],
    notes: '160-year-old brewery—30-min tasting tour daily at 10:15; pick up trail-friendly 33 cl cans'
  },
  {
    id: 'faessler-butcher',
    name: 'Metzgerei F\u00E4ssler',
    position: [47.33173, 9.39944],
    aliases: ['metzgerei f\u00E4ssler', 'metzgerei faessler', 'faessler'],
    notes: 'Family butcher (since 1895) two streets from Gasthaus Hof; grab Appenzeller Siedwurst for backpack lunches'
  },
  {
    id: 'landsgemeinde-platz',
    name: 'Landsgemeinde-platz, Appenzell',
    position: [47.3330, 9.4170],
    aliases: ['landsgemeindeplatz', 'landsgemeinde-platz'],
    notes: 'Painted fa\u00E7ades and flag-lined square\u2014classic Swiss village scene'
  },

  // Lake Como area
  {
    id: 'divino-13',
    name: 'Divino 13 bar (Piazza Garibaldi, Menaggio)',
    position: [46.0172, 9.2374],
    aliases: ['divino 13', 'divino13', 'divino bar menaggio'],
    notes: '8 taps rotating Italian craft brews + taglieri of local salumi; perfect first-night stroll spot'
  },
  {
    id: 'birrificio-como',
    name: 'Il Birrificio di Como',
    position: [45.79530, 8.95798],
    aliases: ['birrificio di como', 'il birrificio di como', 'como brewery'],
    notes: 'Lombardy\u2019s flagship brew-pub (20 km south; easy train hop). Try the “Hammer” Doppelbock with their porchetta sandwich.'
  },
  {
    id: 'hotel-bellavista-terrace',
    name: 'Hotel Bellavista roof-terrace',
    position: [46.0169, 9.2361],
    aliases: ['hotel bellavista terrace', 'bellavista roof terrace'],
    notes: 'Sunset panorama across Bellagio; tripod-friendly railing.'
  },
  {
    id: 'villa-carlotta',
    name: 'Villa Carlotta (Tremezzo)',
    position: [45.9852, 9.2270],
    aliases: ['villa carlotta'],
    notes: 'Botanical terraces; spring azaleas frame the lake and Grigna range.'
  },
  {
    id: 'villa-balbianello',
    name: 'Villa del Balbianello',
    position: [45.9590, 9.2015],
    aliases: ['villa del balbianello', 'balbianello'],
    notes: 'Star Wars & Bond film set; best reached by morning taxi-boat from Lenno.'
  },
  {
    id: 'castello-di-vezio',
    name: 'Castello di Vezio (Varenna ridge)',
    position: [46.0065, 9.2853],
    aliases: ['castello di vezio', 'vezio castle'],
    notes: 'Drone-like vistas without a drone; late-day light over three lake arms.'
  },
  {
    id: 'osteria-il-pozzo',
    name: 'Osteria il Pozzo, Piazza Garibaldi',
    position: [46.0164, 9.2372],
    aliases: ['osteria il pozzo', 'il pozzo menaggio'],
    notes: 'Lake-fish risotto & local Nebbiolo; candle-lit tables perfect for night street shots.'
  },
];

export function findLocationId(text?: string): string | undefined {
  if (!text) return undefined;
  const lc = text.toLowerCase();
  let bestMatch: { id: string; len: number } | undefined;
  for (const loc of mapLocations) {
    const aliases = [loc.name.toLowerCase(), ...(loc.aliases || []).map(a => a.toLowerCase())];
    for (const alias of aliases) {
      if (lc.includes(alias) && alias.length > (bestMatch?.len ?? 0)) {
        bestMatch = { id: loc.id, len: alias.length };
      }
    }
  }
  return bestMatch?.id;
}

export function getLocationById(id: string): MapLocation | undefined {
  return mapLocations.find(l => l.id === id);
}

