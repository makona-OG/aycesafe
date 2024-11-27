from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import socket
from twilio.rest import Client

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Increase socket timeout
socket.setdefaulttimeout(30)

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv('GMAIL_ADDRESS')
SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER')

def send_email(to_email, message):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = "Water Level Alert"
    msg.attach(MIMEText(message, 'plain'))
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:
            server.set_debuglevel(1)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            return True, None
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication Error: {str(e)}")
        return False, "Authentication failed"
    except (socket.timeout, socket.gaierror) as e:
        logger.error(f"Network Error: {str(e)}")
        return False, "Network connection error"
    except Exception as e:
        logger.error(f"Unexpected Error: {str(e)}")
        return False, str(e)

def send_sms(to_phone, message):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        return True, None
    except Exception as e:
        logger.error(f"SMS Error: {str(e)}")
        return False, str(e)

def send_whatsapp(to_phone, message):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=f"whatsapp:{TWILIO_WHATSAPP_NUMBER}",
            to=f"whatsapp:{to_phone}"
        )
        return True, None
    except Exception as e:
        logger.error(f"WhatsApp Error: {str(e)}")
        return False, str(e)

@app.route('/api/send-alert', methods=['POST', 'OPTIONS'])
def send_alert():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    try:
        data = request.get_json()
        message = data.get('message', '')
        channels = data.get('channels', [])
        recipients = data.get('recipients', {})
        
        if not message or not channels or not recipients:
            return jsonify({'error': 'Message, channels, and recipients are required'}), 400

        results = {
            'email': None,
            'sms': None,
            'whatsapp': None
        }

        if 'email' in channels and recipients.get('email'):
            success, error = send_email(recipients['email'], message)
            results['email'] = {'success': success, 'error': error}

        if 'sms' in channels and recipients.get('phone'):
            success, error = send_sms(recipients['phone'], message)
            results['sms'] = {'success': success, 'error': error}

        if 'whatsapp' in channels and recipients.get('phone'):
            success, error = send_whatsapp(recipients['phone'], message)
            results['whatsapp'] = {'success': success, 'error': error}

        return jsonify({
            'success': any(result and result.get('success') for result in results.values() if result),
            'results': results
        })

    except Exception as e:
        logger.error(f"Request handling error: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)