import axios from 'axios';

const BACKEND_URL = 'https://lovable-flask-backend.onrender.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSMSAlert = async (message: string, to: string) => {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to send message to ${to}`);
      
      // Remove any "whatsapp:" prefix if it exists
      const cleanNumber = to.replace('whatsapp:', '').replace('+', '').strip();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/send-message`,
        {
          message,
          to: cleanNumber
        },
        {
          timeout: REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      console.log('Message sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If we get a specific error from the backend, throw it immediately
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (attempt < MAX_RETRIES) {
        console.log(`Waiting ${RETRY_DELAY * attempt}ms before retry...`);
        await sleep(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw new Error(
    lastError?.response?.data?.error || 
    lastError?.message || 
    'Failed to send WhatsApp message. Please ensure you have joined the Twilio sandbox by sending "join plenty-drawn" to +1 415 523 8886'
  );
};