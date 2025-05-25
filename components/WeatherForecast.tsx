import React from 'react';
import { ForecastDay, getForecastForLocation } from '../weatherData';

interface WeatherForecastProps {
  location?: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ location }) => {
  if (!location) return null;
  const forecast = getForecastForLocation(location);
  if (!forecast) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-sky-200 mb-1">3-Day Forecast</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-200">
        {forecast.map((day: ForecastDay, idx: number) => (
          <div key={idx} className="bg-slate-700/50 p-2 rounded-lg text-center">
            <p className="font-semibold">{day.date}</p>
            <p>{day.conditions}</p>
            <p className="text-xs">{day.high} / {day.low}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
