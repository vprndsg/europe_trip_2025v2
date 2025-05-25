import React, { useEffect, useState } from 'react';
import { ForecastDay, fetchForecast } from '../services/weatherService';

interface WeatherForecastProps {
  location?: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ location }) => {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    setForecast(null);
    setError(null);
    fetchForecast(location)
      .then(data => {
        if (!cancelled) setForecast(data);
      })
      .catch(e => {
        if (!cancelled) setError('Failed to load weather');
      });
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (!location) return null;

  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  if (!forecast) {
    return <div className="text-sm text-sky-200">Loading forecast...</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-sky-200 mb-1">3-Day Forecast (°F)</h4>
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
