import axios from 'axios';

export const sendSMSAlert = async (message: string, to: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/send-message', {
      message,
      to: `whatsapp:+${to.replace(/\D/g, '')}`
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error details:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to send WhatsApp message');
  }
};