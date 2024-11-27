from flask import Flask, request, jsonify
from flask_cors import CORS
import http.client
import json
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/send-alert', methods=['POST'])
def send_alert():
    try:
        data = request.get_json()
        message = data.get('message', '')
        phone = data.get('phone')

        logger.info(f"Received alert request - Phone: {phone}, Message: {message}")

        if not message or not phone:
            logger.error("Missing required fields")
            return jsonify({'error': 'Message and phone number are required'}), 400

        # Format phone number if it doesn't start with country code
        if not phone.startswith('+'):
            phone = '+' + phone

        conn = http.client.HTTPSConnection(os.getenv('INFOBIP_BASE_URL'))
        
        payload = json.dumps({
            "messages": [
                {
                    "from": os.getenv('INFOBIP_SENDER'),
                    "to": phone,
                    "content": {
                        "templateName": "test_whatsapp_template_en",
                        "templateData": {
                            "body": {
                                "placeholders": [message]
                            }
                        },
                        "language": "en"
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {os.getenv("INFOBIP_API_KEY")}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        logger.info("Sending request to Infobip")
        conn.request("POST", "/whatsapp/1/message/template", payload, headers)
        response = conn.getresponse()
        result = response.read()
        
        logger.info(f"Infobip response status: {response.status}")
        logger.info(f"Infobip response: {result.decode('utf-8')}")

        if response.status in [200, 201]:
            return jsonify({'success': True})
        else:
            error_message = result.decode('utf-8')
            logger.error(f"Infobip error: {error_message}")
            return jsonify({
                'success': False,
                'error': error_message
            })

    except Exception as e:
        logger.error(f"Error sending alert: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)