import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 60000; // Increased to 60 seconds for better reliability

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSMSAlert = async (message: string, to: string) => {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to send email to ${to}`);
      
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

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt;
        console.log(`Waiting ${delay}ms before retry...`);
        await sleep(delay);
        continue;
      }
    }
  }

  const errorMessage = lastError?.response?.data?.error || 
    lastError?.message || 
    'Failed to connect to the server. Please check your internet connection and ensure the backend server is running at http://localhost:5000';
  
  throw new Error(errorMessage);
};