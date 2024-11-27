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

        # Format the WhatsApp numbers correctly
        to_number = to_number.replace('whatsapp:', '').replace('+', '').strip()
        from_whatsapp = f'whatsapp:+{twilio_number}'
        to_whatsapp = f'whatsapp:+{to_number}'

        # Send message via Twilio WhatsApp
        message = client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )

        return jsonify({
            'success': True,
            'message_sid': message.sid,
            'status': 'WhatsApp message sent successfully'
        })

    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': 'Failed to send WhatsApp message. Make sure you have joined the Twilio sandbox by sending "join plenty-drawn" to +1 415 523 8886'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)