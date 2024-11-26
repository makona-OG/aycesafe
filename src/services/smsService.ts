import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    // Remove any "whatsapp:" prefix if it exists
    const cleanNumber = to.replace('whatsapp:', '').replace('+', '');
    
    const response = await axios.post(
      `${BACKEND_URL}/api/send-message`,
      {
        message,
        to: cleanNumber
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error details:', error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to send WhatsApp message. Make sure you have joined the Twilio sandbox by sending "join plenty-drawn" to +1 415 523 8886'
    );
  }
};