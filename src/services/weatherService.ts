import axios from 'axios';
import { WeatherInfo } from '@/lib/types';

// Using OpenMeteo which is free and doesn't require API key
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherInfo> => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,weather_code`
    );

    const weatherCode = response.data.current.weather_code;
    const condition = getWeatherCondition(weatherCode);

    return {
      temperature: Math.round(response.data.current.temperature_2m),
      condition: condition,
      rainfall: response.data.current.rain || 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const getWeatherCondition = (code: number): string => {
  if (code <= 3) return "Clear";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  return "Thunderstorm";
};