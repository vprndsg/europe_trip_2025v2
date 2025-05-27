import { ForecastDay } from '../../services/weatherService';

const fallbackForecasts: Record<string, ForecastDay[]> = {
  'Swiss Alps (Äscher/Ebenalp)': [
    { date: 'Jun 20', conditions: 'Partly cloudy', high: '60°F', low: '45°F' },
    { date: 'Jun 21', conditions: 'Mostly sunny', high: '64°F', low: '47°F' },
    { date: 'Jun 22', conditions: 'Chance of rain', high: '58°F', low: '43°F' }
  ],
  'Swiss Alps (Seealpsee/Meglisalp)': [
    { date: 'Jun 20', conditions: 'Partly cloudy', high: '60°F', low: '45°F' },
    { date: 'Jun 21', conditions: 'Mostly sunny', high: '64°F', low: '47°F' },
    { date: 'Jun 22', conditions: 'Chance of rain', high: '58°F', low: '43°F' }
  ],
};

export default fallbackForecasts;
