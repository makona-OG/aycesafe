from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import socket

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

@app.route('/api/send-message', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    try:
        logger.info("Received send-message request")
        data = request.get_json()
        message = data.get('message', '')
        to_email = data.get('to')
        
        logger.info(f"Sending email to: {to_email}")
        
        if not message or not to_email:
            logger.error("Missing required fields")
            return jsonify({'error': 'Message and email address are required'}), 400

        success, error = send_email(to_email, message)
        
        if success:
            logger.info("Email sent successfully")
            return jsonify({
                'success': True,
                'status': 'Email alert sent successfully'
            })
        else:
            logger.error(f"Failed to send email: {error}")
            return jsonify({
                'error': f'Failed to send email: {error}',
                'details': error
            }), 500

    except Exception as e:
        logger.error(f"Request handling error: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)