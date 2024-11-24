import axios from 'axios';

const TWILIO_ACCOUNT_SID = 'AC1af93a201df4c52a7dd8219005d82f3a';
const TWILIO_AUTH_TOKEN = '7ead3800a27806c1eb51675e15bba597';
const TWILIO_PHONE_NUMBER = '+17035954060';

export const sendSMSAlert = async (message: string) => {
  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: '+254712961615',
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};