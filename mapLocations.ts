export interface MapLocation {
  id: string;
  name: string;
  position: [number, number];
  aliases?: string[];
  notes?: string;
}

export const mapLocations: MapLocation[] = [
  { id: 'ber-airport', name: 'BER T1-2', position: [52.3651, 13.5098], aliases: ['ber t1-2', 'ber airport'] },
  { id: 'hermannstrasse', name: 'Hermannstraße', position: [52.4673, 13.4315], aliases: ['hermannstraße'], notes: 'Last stop, Berlin ABC Ticket: €4.40' },
  { id: 'boddinstrasse', name: 'Boddinstraße', position: [52.4800, 13.4310], aliases: ['boddinstraße'] },
  { id: 'neckarstrasse', name: 'Neckarstraße 21b', position: [52.4760, 13.4315], aliases: ['neckarstraße 21b'] },
  { id: 'appenzell', name: 'Appenzell', position: [47.3308, 9.4088], aliases: ['appenzell'] },
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

