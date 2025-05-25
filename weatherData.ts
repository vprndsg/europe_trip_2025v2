export interface ForecastDay {
  date: string;
  conditions: string;
  high: string;
  low: string;
}

const forecastData: Record<string, ForecastDay[]> = {
  "Berlin": [
    { date: "Jun 15", conditions: "Sunny", high: "24°C", low: "14°C" },
    { date: "Jun 16", conditions: "Partly Cloudy", high: "22°C", low: "13°C" },
    { date: "Jun 17", conditions: "Showers", high: "20°C", low: "12°C" }
  ],
  "Appenzell": [
    { date: "Jun 18", conditions: "Rain", high: "18°C", low: "10°C" },
    { date: "Jun 19", conditions: "Mostly Sunny", high: "21°C", low: "9°C" },
    { date: "Jun 20", conditions: "Cloudy", high: "19°C", low: "8°C" }
  ],
  "Swiss Alps (Äscher/Ebenalp)": [
    { date: "Jun 19", conditions: "Cloudy", high: "14°C", low: "6°C" },
    { date: "Jun 20", conditions: "Showers", high: "12°C", low: "5°C" },
    { date: "Jun 21", conditions: "Partly Sunny", high: "15°C", low: "6°C" }
  ],
  "Swiss Alps (Seealpsee/Meglisalp)": [
    { date: "Jun 20", conditions: "Showers", high: "13°C", low: "5°C" },
    { date: "Jun 21", conditions: "Partly Sunny", high: "16°C", low: "6°C" },
    { date: "Jun 22", conditions: "Sunny", high: "18°C", low: "7°C" }
  ],
  "Lake Como, Italy": [
    { date: "Jun 23", conditions: "Sunny", high: "26°C", low: "17°C" },
    { date: "Jun 24", conditions: "Partly Cloudy", high: "27°C", low: "18°C" },
    { date: "Jun 25", conditions: "Sunny", high: "28°C", low: "19°C" }
  ],
  "Milan, Italy": [
    { date: "Jun 26", conditions: "Sunny", high: "29°C", low: "20°C" },
    { date: "Jun 27", conditions: "Mostly Sunny", high: "30°C", low: "21°C" },
    { date: "Jun 28", conditions: "Sunny", high: "31°C", low: "21°C" }
  ]
};

export function getForecastForLocation(location: string): ForecastDay[] | undefined {
  const key = Object.keys(forecastData).find(k => k.toLowerCase() === location.toLowerCase());
  return key ? forecastData[key] : undefined;
}
