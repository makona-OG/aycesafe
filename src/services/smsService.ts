import axios from 'axios';

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER;

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    // Format the phone number to WhatsApp format
    const formattedTo = `whatsapp:+${to.replace(/\D/g, '')}`;
    const formattedFrom = `whatsapp:${TWILIO_WHATSAPP_NUMBER}`;

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: formattedTo,
        From: formattedFrom,
        Body: message
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.error_code) {
      throw new Error(response.data.error_message);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error details:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to send WhatsApp message');
  }
};