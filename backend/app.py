from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Twilio configuration
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_WHATSAPP_NUMBER')

@app.route('/api/send-message', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        return response, 200
        
    try:
        data = request.get_json()
        message = data.get('message', '').encode('utf-8').decode('utf-8')
        to_number = data.get('to')
        
        if not message or not to_number:
            return jsonify({'error': 'Message and phone number are required'}), 400

        # Format the WhatsApp numbers correctly
        to_number = to_number.replace('whatsapp:', '').replace('+', '').strip()
        from_whatsapp = f'whatsapp:+{twilio_number}'
        to_whatsapp = f'whatsapp:+{to_number}'

        # Remove any non-ASCII characters
        message = ''.join(char for char in message if ord(char) < 128)
        
        # Create a new client instance for each request
        client = Client(account_sid, auth_token)
        
        # Send message
        message = client.messages.create(
            from_=from_whatsapp,
            body=message,
            to=to_whatsapp
        )

        return jsonify({
            'success': True,
            'message_sid': message.sid,
            'status': 'WhatsApp message sent successfully'
        })

    except Exception as e:
        error_str = str(e)
        print(f"Error sending message: {error_str}")
        
        if "not a valid WhatsApp" in error_str:
            error_message = "Please join the Twilio sandbox first by sending 'join plenty-drawn' to +1 415 523 8886"
        elif "authenticate" in error_str.lower():
            error_message = "Authentication failed. Please check Twilio credentials."
        elif "rate limit" in error_str.lower():
            error_message = "Too many requests. Please try again later."
        else:
            error_message = f"Failed to send WhatsApp message: {error_str}"
            
        return jsonify({
            'error': error_message,
            'details': error_str
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)