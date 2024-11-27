from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

logger.info(f"Email configuration loaded. Using address: {SENDER_EMAIL}")

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

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Water Level Alert"
        
        # Add body to email
        msg.attach(MIMEText(message, 'plain'))
        
        logger.info("Attempting to connect to SMTP server")
        # Create SMTP session with longer timeout
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=60)
        server.set_debuglevel(1)  # Enable SMTP debug output
        
        logger.info("Starting TLS")
        server.starttls()
        
        logger.info("Attempting login")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        logger.info("Sending email")
        server.send_message(msg)
        server.quit()
        
        logger.info("Email sent successfully")
        return jsonify({
            'success': True,
            'status': 'Email alert sent successfully'
        })

    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication Error: {str(e)}")
        return jsonify({
            'error': 'Authentication failed. Please check email credentials.',
            'details': str(e)
        }), 401
        
    except Exception as e:
        error_str = str(e)
        logger.error(f"Error sending email: {error_str}")
        
        if "authentication failed" in error_str.lower():
            error_message = "Authentication failed. Please check email credentials."
        else:
            error_message = f"Failed to send email alert: {error_str}"
            
        return jsonify({
            'error': error_message,
            'details': error_str
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)