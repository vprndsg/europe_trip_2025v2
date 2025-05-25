export interface MapLocation {
  id: string;
  name: string;
  position: [number, number];
  aliases?: string[];
  notes?: string;
}

export const mapLocations: MapLocation[] = [
  { id: 'ber-airport', name: 'BER T1-2', position: [52.3667, 13.5033], aliases: ['ber t1-2', 'ber airport'] },
  { id: 'hermannstrasse', name: 'Hermannstraße', position: [52.467, 13.431], aliases: ['hermannstraße'], notes: 'Last stop, Berlin ABC Ticket: €4.40' },
  { id: 'boddinstrasse', name: 'Boddinstraße', position: [52.4793, 13.432], aliases: ['boddinstraße'] },
  { id: 'neckarstrasse', name: 'Neckarstraße 21b', position: [52.476, 13.432], aliases: ['neckarstraße 21b'] },
  { id: 'appenzell', name: 'Appenzell', position: [47.331, 9.409], aliases: ['appenzell'] },
  { id: 'ebenalp', name: 'Berggasthaus Ebenalp', position: [47.2824, 9.4041], aliases: ['ebenalp'] },
  { id: 'seealpsee', name: 'Seealpsee', position: [47.2858, 9.4046], aliases: ['seealpsee'] },
  { id: 'meglisalp', name: 'Meglisalp', position: [47.2842, 9.4218], aliases: ['meglisalp'] },
  { id: 'lugano', name: 'Lugano', position: [46.0037, 8.9511], aliases: ['lugano'] },
  { id: 'menaggio', name: 'Menaggio', position: [46.0152, 9.2373], aliases: ['menaggio'] },
  { id: 'malpensa', name: 'Milan Malpensa Airport', position: [45.6303, 8.7267], aliases: ['malpensa'] },
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

