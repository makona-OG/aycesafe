import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    // Format WhatsApp number if it doesn't include WhatsApp prefix
    const formattedNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    const response = await axios.post(`${API_URL}/send-message`, {
      message,
      to: formattedNumber
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to WhatsApp service. Please check your connection and ensure the backend server is running.');
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to send WhatsApp message. Please try again later.');
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