import axios from 'axios';

const BACKEND_URL = 'https://floodwatcher-hub.onrender.com';
const REQUEST_TIMEOUT = 60000;

export const sendAlert = async (
  message: string,
  phone: string
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${BACKEND_URL}/api/send-alert`,
      data: {
        message,
        phone
      },
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 
      error?.message || 
      'Failed to send WhatsApp alert');
  }
};
