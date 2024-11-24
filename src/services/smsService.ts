import axios from 'axios';
import { toast } from 'sonner';

const TWILIO_ACCOUNT_SID = 'AC1af93a201df4c52a7dd8219005d82f3a';
const TWILIO_AUTH_TOKEN = '7ead3800a27806c1eb51675e15bba597';
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Twilio's default WhatsApp testing number

export const sendSMSAlert = async (message: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('To', 'whatsapp:+254712961615'); // Add whatsapp: prefix
    formData.append('From', TWILIO_WHATSAPP_NUMBER);
    formData.append('Body', message);

    const response = await axios({
      method: 'post',
      url: `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      data: formData,
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    toast.success('Alert WhatsApp message sent successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error);
    toast.error('Failed to send WhatsApp alert');
    throw error;
  }
};