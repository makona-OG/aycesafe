import axios from 'axios';

const BACKEND_URL = 'http://238c205e-99b9-4429-b4d0-909d4fc6f115.lovableproject.com/api';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/send-message`,
      {
        message,
        to: `whatsapp:+${to}`
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