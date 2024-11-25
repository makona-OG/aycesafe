from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Twilio configuration
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_WHATSAPP_NUMBER')

client = Client(account_sid, auth_token)

@app.route('/api/send-message', methods=['POST'])
def send_message():
    try:
        data = request.json
        message = data.get('message')
        to_number = data.get('to')
        
        if not message or not to_number:
            return jsonify({'error': 'Message and phone number are required'}), 400

        # Format the phone number to include country code if not present
        if not to_number.startswith('+'):
            to_number = '+' + to_number
        
        # Format the WhatsApp numbers
        whatsapp_to = f"whatsapp:{to_number}"
        whatsapp_from = f"whatsapp:{twilio_number}"
        
        # Send message via Twilio
        message = client.messages.create(
            from_=whatsapp_from,
            body=message,
            to=whatsapp_to
        )

        return jsonify({
            'success': True,
            'message_sid': message.sid
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)