import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 60000; // 60 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSMSAlert = async (message: string, to: string) => {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Frontend] Attempt ${attempt} to send email to ${to}`);
      console.log(`[Frontend] Sending request to ${BACKEND_URL}/api/send-message`);
      
      const response = await axios({
        method: 'post',
        url: `${BACKEND_URL}/api/send-message`,
        data: {
          message,
          to
        },
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('[Frontend] Server response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      console.log('[Frontend] Email sent successfully:', response.data);
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

  const errorMessage = lastError?.response?.data?.error || 
    lastError?.message || 
    'Failed to send alert. Please check your internet connection and ensure the backend server is running.';
  
  throw new Error(errorMessage);
};