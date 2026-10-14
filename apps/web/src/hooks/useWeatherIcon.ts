import { useWeather } from '@/api/features/weather/queries/use-weather';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useIsDay } from './useIsDay';

import cloudyDayImg from '@/assets/weather/weather-cloudy-day.webp';
import cloudyNightImg from '@/assets/weather/weather-cloudy-night.webp';
import fullDayImg from '@/assets/weather/weather-full-day.webp';
import fullNightImg from '@/assets/weather/weather-full-night.webp';
import rainyDayImg from '@/assets/weather/weather-rainy-day.webp';
import rainyNightImg from '@/assets/weather/weather-rainy-night.webp';
import snowDayImg from '@/assets/weather/weather-snow-day.webp';
import snowNightImg from '@/assets/weather/weather-snow-night.webp';
import stormyDayImg from '@/assets/weather/weather-stormy-day.webp';
import stormyNightImg from '@/assets/weather/weather-stormy-night.webp';

type WeatherCondition = 'full' | 'cloudy' | 'rainy' | 'snow' | 'stormy';
interface WeatherIcon {
  src: string;
  alt: string;
  line: string;
}

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

const CONDITION_LABELS: Record<WeatherCondition, string> = {
  full: 'beau temps',
  cloudy: 'temps nuageux',
  rainy: 'pluie',
  snow: 'neige',
  stormy: 'orage',
};

const weatherLine = (hour: string, temp: number, wind: number, condition: WeatherCondition) => {
  const lines: Record<WeatherCondition, string> = {
    full: `Il est ${hour}, le ciel est dégagé, ${temp}°C, le vent file à ${wind} km/h.`,
    cloudy: `Il est ${hour}, le ciel est couvert, ${temp}°C, le vent file à ${wind} km/h.`,
    rainy: `Il est ${hour}, il pleut, ${temp}°C, vent à ${wind} km/h, le parapluie est de sortie.`,
    snow: `Il est ${hour}, il neige, ${temp}°C, vent à ${wind} km/h, les gants sont de sortie.`,
    stormy: `Il est ${hour}, l'orage gronde, ${temp}°C, vent à ${wind} km/h.`,
  };
  return lines[condition];
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

export const useWeatherIcon = (): WeatherIcon | null => {
  const { data: weather } = useWeather();
  const isDay = useIsDay();

  return useMemo(() => {
    if (!weather) return null;
    const condition = CODE_TO_CONDITION[weather.weatherCode];
    if (!condition) return null;
    const hour = DateTime.now().setZone('Europe/Paris').toFormat("H'h'mm");
    return {
      src: isDay ? DAY_ICONS[condition] : NIGHT_ICONS[condition],
      alt: `Météo actuelle : ${CONDITION_LABELS[condition]}`,
      line: weatherLine(hour, Math.round(weather.temperature), Math.round(weather.windSpeed), condition),
    };
  }, [weather, isDay]);
};
