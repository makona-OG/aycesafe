import axios from 'axios';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-message`, {
      message,
      to
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to SMS service. Please ensure the backend server is running.');
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const handleSMSQuery = (keyword: string, waterLevel: number, weather: any) => {
  switch (keyword.toLowerCase()) {
    case 'level':
      return `Current water level: ${waterLevel}m`;
    case 'weather':
      return `Current weather:\nTemp: ${weather.temperature}°C\nCondition: ${weather.condition}\nRainfall: ${weather.rainfall}mm`;
    case 'status':
      return `🌊 Full Status Update:\nWater Level: ${waterLevel}m\nTemp: ${weather.temperature}°C\nCondition: ${weather.condition}\nRainfall: ${weather.rainfall}mm`;
    case 'help':
      return `Available commands:\n- LEVEL: Get current water level\n- WEATHER: Get weather info\n- STATUS: Get full status update\n- HELP: Show this message`;
    default:
      return `Unknown command. Text HELP for available commands.`;
  }
};