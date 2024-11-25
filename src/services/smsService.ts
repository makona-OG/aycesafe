import axios from 'axios';
import { toast } from 'sonner';

const TWILIO_ACCOUNT_SID = 'AC1af93a201df4c52a7dd8219005d82f3a';
const TWILIO_AUTH_TOKEN = '7ead3800a27806c1eb51675e15bba597';
const TWILIO_PHONE_NUMBER = '+14155238886';

export const sendSMSAlert = async (message: string, to: string) => {
  // Mock implementation - in a real app, this would call your backend API
  console.log(`Would send message to ${to}: ${message}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Message sent successfully' });
    }, 1000);
  });
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
