import axios from 'axios';
import { WeatherInfo } from '@/lib/types';

const OPENWEATHER_API_KEY = '32a5e1d5e77b727c397b3ad20e129adf';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherInfo> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};