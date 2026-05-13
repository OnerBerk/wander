import { useWeather } from '@/api/features/weather/queries/use-weather';
import { useIsDay } from './useIsDay';
import { useMemo } from 'react';

import cloudyDayImg from '@/assets/weather/weather-cloudy-day.png';
import cloudyNightImg from '@/assets/weather/weather-cloudy-night.png';
import fullDayImg from '@/assets/weather/weather-full-day.png';
import fullNightImg from '@/assets/weather/weather-full-night.png';
import rainyDayImg from '@/assets/weather/weather-rainy-day.png';
import rainyNightImg from '@/assets/weather/weather-rainy-night.png';
import snowDayImg from '@/assets/weather/weather-snow-day.png';
import snowNightImg from '@/assets/weather/weather-snow-night.png';
import stormyDayImg from '@/assets/weather/weather-stormy-day.png';
import stormyNightImg from '@/assets/weather/weather-stormy-night.png';

type WeatherCondition = 'full' | 'cloudy' | 'rainy' | 'snow' | 'stormy';

const DAY_ICONS: Record<WeatherCondition, string> = {
  full: fullDayImg,
  cloudy: cloudyDayImg,
  rainy: rainyDayImg,
  snow: snowDayImg,
  stormy: stormyDayImg,
};

const NIGHT_ICONS: Record<WeatherCondition, string> = {
  full: fullNightImg,
  cloudy: cloudyNightImg,
  rainy: rainyNightImg,
  snow: snowNightImg,
  stormy: stormyNightImg,
};

const CODE_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'full',
  1: 'full',
  2: 'cloudy',
  3: 'cloudy',
  45: 'cloudy',
  48: 'cloudy',
  51: 'rainy',
  53: 'rainy',
  55: 'rainy',
  56: 'rainy',
  57: 'rainy',
  61: 'rainy',
  63: 'rainy',
  65: 'rainy',
  66: 'rainy',
  67: 'rainy',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rainy',
  81: 'rainy',
  82: 'rainy',
  85: 'snow',
  86: 'snow',
  95: 'stormy',
  96: 'stormy',
  99: 'stormy',
};

export const useWeatherIcon = () => {
  const { data: weather } = useWeather();
  const isDay = useIsDay();

  return useMemo(() => {
    if (!weather) return null;
    const condition = CODE_TO_CONDITION[weather.weatherCode];
    if (!condition) return null;
    return isDay ? DAY_ICONS[condition] : NIGHT_ICONS[condition];
  }, [weather, isDay]);
};
