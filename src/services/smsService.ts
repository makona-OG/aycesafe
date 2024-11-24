import axios from 'axios';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const sendSMSAlert = async (message: string) => {
  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: '+254712961615',
        From: TWILIO_PHONE_NUMBER!,
        Body: message,
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID!,
          password: TWILIO_AUTH_TOKEN!,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};