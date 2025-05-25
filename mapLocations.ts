export interface MapLocation {
  id: string;
  name: string;
  position: [number, number];
  aliases?: string[];
  notes?: string;
}

export const mapLocations: MapLocation[] = [
  { id: 'ber-airport', name: 'BER T1-2', position: [52.3651, 13.5098], aliases: ['ber t1-2', 'ber airport', 'berlin airport', 'berlin brandenburg airport', 'ber'] },
  { id: 'hermannstrasse', name: 'Hermannstraße', position: [52.4673, 13.4315], aliases: ['hermannstraße'], notes: 'Last stop, Berlin ABC Ticket: €4.40' },
  { id: 'boddinstrasse', name: 'Boddinstraße', position: [52.4800, 13.4310], aliases: ['boddinstraße'] },
  { id: 'neckarstrasse', name: 'Neckarstraße 21b', position: [52.4760, 13.4315], aliases: ['neckarstraße 21b'] },
  { id: 'berlin-sudkreuz', name: 'Berlin Südkreuz', position: [52.4753, 13.3658], aliases: ['südkreuz', 'berlin südkreuz', 'suedkreuz'] },
  { id: 'appenzell', name: 'Appenzell', position: [47.3308, 9.4088], aliases: ['appenzell'] },
  { id: 'munich-hbf', name: 'München Hbf', position: [48.1402, 11.5585], aliases: ['munich hbf', 'münchen hbf', 'munchen hbf'] },
  { id: 'st-gallen', name: 'St. Gallen', position: [47.4239, 9.3748], aliases: ['st. gallen', 'st gallen'] },
  { id: 'herisau', name: 'Herisau', position: [47.3862, 9.2792], aliases: ['herisau'] },
  { id: 'arth-goldau', name: 'Arth-Goldau', position: [47.0481, 8.5254], aliases: ['arth-goldau', 'arth goldau'] },
  { id: 'aescher', name: 'Berggasthaus Äscher', position: [47.2843, 9.4149], aliases: ['äscher', 'aescher'] },
  { id: 'ebenalp', name: 'Berggasthaus Ebenalp', position: [47.2867, 9.4286], aliases: ['ebenalp'] },
  { id: 'seealpsee', name: 'Seealpsee', position: [47.2698, 9.4026], aliases: ['seealpsee'] },
  { id: 'meglisalp', name: 'Meglisalp', position: [47.2559, 9.3856], aliases: ['meglisalp'] },
  { id: 'lugano', name: 'Lugano', position: [46.0055, 8.9469], aliases: ['lugano'] },
  { id: 'menaggio', name: 'Menaggio', position: [46.0170, 9.2330], aliases: ['menaggio'] },
  { id: 'malpensa', name: 'Milan Malpensa Airport', position: [45.6300, 8.7231], aliases: ['malpensa'] },
];

export function findLocationId(text?: string): string | undefined {
  if (!text) return undefined;
  const lc = text.toLowerCase();
  const loc = mapLocations.find(l => [l.name.toLowerCase(), ...(l.aliases || [])].some(a => lc.includes(a)));
  return loc?.id;
}

export function getLocationById(id: string): MapLocation | undefined {
  return mapLocations.find(l => l.id === id);
}

