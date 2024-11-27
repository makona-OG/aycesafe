from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from infobip_api_client.api_client import ApiClient, Configuration
from infobip_api_client.model.whatsapp_message import WhatsAppMessage
from infobip_api_client.api.whatsapp_api import WhatsAppApi
from infobip_api_client.exceptions import ApiException

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

# Infobip configuration
INFOBIP_API_KEY = os.getenv('INFOBIP_API_KEY')
INFOBIP_BASE_URL = os.getenv('INFOBIP_BASE_URL')
INFOBIP_SENDER = os.getenv('INFOBIP_SENDER')

def send_whatsapp(to_phone, message):
    try:
        configuration = Configuration(
            host=INFOBIP_BASE_URL,
            api_key={'APIKeyHeader': INFOBIP_API_KEY}
        )
        api_client = ApiClient(configuration)
        whatsapp_api = WhatsAppApi(api_client)

        whatsapp_message = WhatsAppMessage(
            from_=INFOBIP_SENDER,
            to=to_phone,
            content={
                'text': message
            }
        )

        response = whatsapp_api.send_whatsapp_message(whatsapp_message)
        return True, None
    except ApiException as e:
        logger.error(f"WhatsApp API Error: {str(e)}")
        return False, str(e)
    except Exception as e:
        logger.error(f"Unexpected Error: {str(e)}")
        return False, str(e)

@app.route('/api/send-alert', methods=['POST', 'OPTIONS'])
def send_alert():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    try:
        data = request.get_json()
        message = data.get('message', '')
        phone = data.get('phone')
        
        if not message or not phone:
            return jsonify({'error': 'Message and phone number are required'}), 400

        success, error = send_whatsapp(phone, message)

        return jsonify({
            'success': success,
            'error': error
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