export interface ForecastDay {
  date: string;
  conditions: string;
  high: string;
  low: string;
}

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

export async function fetchForecast(location: string): Promise<ForecastDay[]> {
  // Fetch coordinates for the location
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
  );
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error('Location not found');
  }
  const { latitude, longitude } = geoData.results[0];

  // Determine date range for the next three days
  const now = new Date();
  const startDate = now.toISOString().split('T')[0];
  const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${startDate}&end_date=${endDate}`
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
      high: `${Math.round(daily.temperature_2m_max[i])}°C`,
      low: `${Math.round(daily.temperature_2m_min[i])}°C`
    });
  }
  return days;
}
