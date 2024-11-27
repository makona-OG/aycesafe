import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const REQUEST_TIMEOUT = 60000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendAlert = async (
  message: string,
  recipients: {
    email?: string;
    phone?: string;
  },
  channels: ('email' | 'sms' | 'whatsapp')[]
) => {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Frontend] Attempt ${attempt} to send alerts`);
      
      const response = await axios({
        method: 'post',
        url: `${BACKEND_URL}/api/send-alert`,
        data: {
          message,
          recipients,
          channels
        },
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error: any) {
      lastError = error;
      console.error(`[Frontend] Attempt ${attempt} failed:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt;
        console.log(`[Frontend] Waiting ${delay}ms before retry...`);
        await sleep(delay);
        continue;
      }
    }
  }

  throw new Error(lastError?.response?.data?.error || 
    lastError?.message || 
    'Failed to send alerts. Please check your internet connection and ensure the backend server is running.');
};