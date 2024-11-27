import axios from 'axios';

const BACKEND_URL = 'https://lovable-flask-backend.onrender.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSMSAlert = async (message: string, to: string) => {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Remove any "whatsapp:" prefix if it exists
      const cleanNumber = to.replace('whatsapp:', '').replace('+', '');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/send-message`,
        {
          message,
          to: cleanNumber
        },
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw new Error(
    lastError?.response?.data?.message || 
    lastError?.message || 
    'Failed to send WhatsApp message after multiple attempts. Please ensure you have joined the Twilio sandbox by sending "join plenty-drawn" to +1 415 523 8886'
  );
};