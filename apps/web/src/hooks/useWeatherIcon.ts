import {useWeather} from '@/api/features/weather/queries/use-weather';
import {useIsDay} from './useIsDay';
import {useMemo} from 'react';

import sunnyImg from '@/assets/weather/weather-sunny.png';
import moonImg from '@/assets/weather/weather-moon.png';
import cloudyImg from '@/assets/weather/weather-cloudy.png';
import rainyImg from '@/assets/weather/weather-rainy.png';
import stormImg from '@/assets/weather/weather-stormy.png';
import snowImg from '@/assets/weather/weather-snow.png';

type WeatherCondition = 'sunny' | 'moon' | 'cloudy' | 'rainy' | 'snow' | 'storm';

const ICONS: Record<WeatherCondition, string> = {
  sunny: sunnyImg,
  moon: moonImg,
  cloudy: cloudyImg,
  rainy: rainyImg,
  snow: snowImg,
  storm: stormImg,
};

const CODE_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'sunny',
  1: 'cloudy',
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
  95: 'storm',
  96: 'storm',
  99: 'storm',
};

export const useWeatherIcon = () => {
  const {data: weather} = useWeather();
  const isDay = useIsDay();

  return useMemo(() => {
    if (!weather) return null;
    const condition = CODE_TO_CONDITION[weather.weatherCode];
    if (!condition) return null;
    const resolved = condition === 'sunny' && !isDay ? 'moon' : condition;
    return ICONS[resolved];
  }, [weather, isDay]);
};
