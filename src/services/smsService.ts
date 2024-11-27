import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSMSAlert = async (message: string, to: string) => {
  let lastError;
  
  // Remove emoji characters and non-ASCII characters from the message
  const sanitizedMessage = message
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Remove emojis
    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to send message to ${to}`);
      
      // Remove any "whatsapp:" prefix if it exists and trim whitespace
      const cleanNumber = to.replace('whatsapp:', '').replace('+', '').trim();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/send-message`,
        {
          message: sanitizedMessage,
          to: cleanNumber
        },
        {
          timeout: REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
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
      
      // Network errors should retry
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt; // Exponential backoff
        console.log(`Waiting ${delay}ms before retry...`);
        await sleep(delay);
        continue;
      }
    }
  }

  // If we get here, all retries failed
  const errorMessage = lastError?.response?.data?.error || 
    lastError?.message || 
    'Failed to connect to the server. Please check your internet connection and ensure the backend server is running at http://localhost:5000';
  
  throw new Error(errorMessage);
};