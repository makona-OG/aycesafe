from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for all domains with all methods
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Twilio configuration
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_WHATSAPP_NUMBER')

client = Client(account_sid, auth_token)

@app.route('/api/send-message', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.json
        message = data.get('message')
        to_number = data.get('to')
        
        if not message or not to_number:
            return jsonify({'error': 'Message and phone number are required'}), 400

        print(f"Attempting to send message to {to_number}")
        
        # Format the WhatsApp numbers correctly
        to_number = to_number.replace('whatsapp:', '').replace('+', '').strip()
        from_whatsapp = f'whatsapp:+{twilio_number}'
        to_whatsapp = f'whatsapp:+{to_number}'

        print(f"Sending from {from_whatsapp} to {to_whatsapp}")

        # Send message via Twilio WhatsApp
        message = client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )

        print(f"Message sent successfully with SID: {message.sid}")

        return jsonify({
            'success': True,
            'message_sid': message.sid,
            'status': 'WhatsApp message sent successfully'
        })

    except Exception as e:
        print(f"Error sending message: {str(e)}")
        error_message = str(e)
        if "not a valid WhatsApp" in error_message:
            error_message = "Please join the Twilio sandbox first by sending 'join plenty-drawn' to +1 415 523 8886"
        return jsonify({
            'error': error_message,
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)