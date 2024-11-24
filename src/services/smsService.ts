import axios from 'axios';
import { toast } from 'sonner';

const TWILIO_ACCOUNT_SID = 'AC1af93a201df4c52a7dd8219005d82f3a';
const TWILIO_AUTH_TOKEN = '7ead3800a27806c1eb51675e15bba597';
const TWILIO_PHONE_NUMBER = '+17035954060';

export const sendSMSAlert = async (message: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('To', '+254712961615');
    formData.append('From', TWILIO_PHONE_NUMBER);
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

    toast.success('Alert SMS sent successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error sending SMS:', error.response?.data || error);
    toast.error('Failed to send SMS alert');
    throw error;
  }
};