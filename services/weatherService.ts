export interface ForecastDay {
  date: string;
  conditions: string;
  high: string;
  low: string;
}

// Local fallback data used when network requests fail
import fallbackForecasts from '../src/data/fallbackWeather';

const weatherCodeDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

function describeWeather(code: number): string {
  return weatherCodeDescriptions[code] || 'N/A';
}

// Fallback coordinates for locations that the geocoding API sometimes fails to
// resolve.  Keys should match the `mainLocation` strings produced by the
// itinerary parser.
const fallbackCoords: Record<string, { latitude: number; longitude: number }> = {
  'Lake Como, Italy': { latitude: 46.017, longitude: 9.233 } // Menaggio
};


// Manual station coordinates for important trail segments. Allows bypassing
// the geocoding lookup for these known locations.
const stationCoords: Record<string, { latitude: number; longitude: number }> = {
  // Keys should exactly match what the itinerary parser emits
  'Swiss Alps (Äscher/Ebenalp)': { latitude: 47.283, longitude: 9.433 },
  'Swiss Alps (Seealpsee/Meglisalp)': { latitude: 47.283, longitude: 9.433 },
  'Berggasthaus Ebenalp': { latitude: 47.283, longitude: 9.433 },
  'Seealpsee': { latitude: 47.283, longitude: 9.433 },
  'Meglisalp': { latitude: 47.283, longitude: 9.433 },
  'Gasthaus Hof': { latitude: 47.330981, longitude: 9.407536 }, // Appenzell village
  // Add more fixed points here as needed
};
export async function fetchForecast(location: string): Promise<ForecastDay[]> {
  try {
    // Determine coordinates for the location
    let latitude: number | undefined;
    let longitude: number | undefined;

    if (stationCoords[location]) {
      ({ latitude, longitude } = stationCoords[location]);
    } else {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        ({ latitude, longitude } = geoData.results[0]);
      } else if (fallbackCoords[location]) {
        ({ latitude, longitude } = fallbackCoords[location]);
      }
    }

    if (latitude === undefined || longitude === undefined) {
      throw new Error('Location not found');
    }

    // Determine date range for the next three days
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit&start_date=${startDate}&end_date=${endDate}`
    );
    const weatherData = await weatherRes.json();
    const daily = weatherData.daily;
    if (!daily || !daily.time) {
      throw new Error('No forecast data');
    }

    const days: ForecastDay[] = [];
    for (let i = 0; i < daily.time.length && i < 3; i++) {
      const dateStr = new Date(daily.time[i]).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      days.push({
        date: dateStr,
        conditions: describeWeather(daily.weathercode[i]),
        high: `${Math.round(daily.temperature_2m_max[i])}°F`,
        low: `${Math.round(daily.temperature_2m_min[i])}°F`
      });
    }
    return days;
  } catch (err) {
    if (fallbackForecasts[location]) {
      return fallbackForecasts[location];
    }
    throw err;
  }
}
