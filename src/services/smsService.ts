import axios from 'axios';

// WhatsApp Cloud API configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    // Format the phone number (remove any non-numeric characters and add country code)
    const formattedNumber = to.replace(/\D/g, '');
    
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedNumber,
        type: "text",
        text: { 
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
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