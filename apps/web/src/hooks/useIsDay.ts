import {useWeather} from '@/api/features/weather/queries/use-weather';
import {DateTime} from 'luxon';
import {useMemo} from 'react';

export const useIsDay = () => {
  const {data: weather} = useWeather();

  const timeOfDay = useMemo(() => {
    if (!weather) return true;
    const now = DateTime.now();
    const sunrise = DateTime.fromISO(weather.sunrise);
    const sunset = DateTime.fromISO(weather.sunset);
    return now > sunrise && now < sunset ? true : false;
  }, [weather]);

  return timeOfDay;
};
