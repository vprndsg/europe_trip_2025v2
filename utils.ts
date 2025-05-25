export const createGoogleMapsSearchLink = (query: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
