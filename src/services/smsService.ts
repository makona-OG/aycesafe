import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-message`, {
      message,
      to
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
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
