from flask import Flask, request, jsonify
from flask_cors import CORS
import http.client
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/send-alert', methods=['POST'])
def send_alert():
    try:
        data = request.get_json()
        message = data.get('message', '')
        phone = data.get('phone')

        if not message or not phone:
            return jsonify({'error': 'Message and phone number are required'}), 400

        conn = http.client.HTTPSConnection(os.getenv('INFOBIP_BASE_URL'))
        
        payload = json.dumps({
            "messages": [
                {
                    "from": os.getenv('INFOBIP_SENDER'),
                    "to": phone,
                    "content": {
                        "text": message
                    }
                }
            ]
        })

        headers = {
            'Authorization': f'App {os.getenv("INFOBIP_API_KEY")}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn.request("POST", "/whatsapp/1/message/text", payload, headers)
        response = conn.getresponse()
        result = response.read()

        if response.status in [200, 201]:
            return jsonify({'success': True})
        else:
            return jsonify({
                'success': False,
                'error': result.decode('utf-8')
            })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)