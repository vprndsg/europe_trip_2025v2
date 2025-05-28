import { ForecastDay } from '../../services/weatherService';

const fallbackForecasts: Record<string, ForecastDay[]> = {
  'Swiss Alps (Äscher/Ebenalp)': [
    { date: 'Jun 20', conditions: 'Partly cloudy', high: '60°F', low: '45°F', sunrise: '5:45 AM', sunset: '8:15 PM' },
    { date: 'Jun 21', conditions: 'Mostly sunny', high: '64°F', low: '47°F', sunrise: '5:45 AM', sunset: '8:16 PM' },
    { date: 'Jun 22', conditions: 'Chance of rain', high: '58°F', low: '43°F', sunrise: '5:44 AM', sunset: '8:17 PM' }
  ],
  'Swiss Alps (Seealpsee/Meglisalp)': [
    { date: 'Jun 20', conditions: 'Partly cloudy', high: '60°F', low: '45°F', sunrise: '5:45 AM', sunset: '8:15 PM' },
    { date: 'Jun 21', conditions: 'Mostly sunny', high: '64°F', low: '47°F', sunrise: '5:45 AM', sunset: '8:16 PM' },
    { date: 'Jun 22', conditions: 'Chance of rain', high: '58°F', low: '43°F', sunrise: '5:44 AM', sunset: '8:17 PM' }
  ],
};

export default fallbackForecasts;
