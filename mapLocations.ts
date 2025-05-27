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
  { id: 'meglisalp', name: 'Meglisalp', position: [47.2559, 9.3856], aliases: ['meglisalp'] },
  { id: 'lugano', name: 'Lugano', position: [46.0055, 8.9469], aliases: ['lugano'] },
    { id: 'menaggio-airbnb',
    name: 'Airbnb – Via IV Novembre 6',
    position: [46.0167, 9.2333],
    aliases: [
      'menaggio airbnb',
      'airbnb via iv novembre 6',
      'via iv novembre 6',
      'this airbnb'   // extra alias from the feature branch
    ] },


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

