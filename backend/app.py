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

        # Ensure the phone number starts with + and country code
        if not to_number.startswith('+'):
            return jsonify({'error': 'Phone number must include country code (e.g., +1)'}), 400
            
        # Format WhatsApp numbers
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
            'message_sid': message.sid,
            'status': 'Message sent successfully'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to send message. Make sure you have joined the Twilio WhatsApp sandbox.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)