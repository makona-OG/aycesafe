# AyceSafe - Water Level Monitoring System

## Overview

AyceSafe is a comprehensive water level monitoring system that provides real-time updates and alerts for water level changes. The system consists of a React-based frontend and a Python Flask backend, integrated with LoRaWAN sensors for continuous monitoring.

## Features

- Real-time water level monitoring
- SMS and WhatsApp alerts via Infobip integration
- Historical data analysis and trends
- Interactive dashboard with maps and charts
- Weather condition monitoring
- Responsive design for all devices

## Prerequisites

Before running the project, ensure you have:

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python (v3.8 or higher)
- pip (Python package manager)

## Frontend Setup

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install frontend dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Setup

1. Navigate to the backend directory:
```sh
cd backend
```

2. Create a virtual environment (recommended):
```sh
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install backend dependencies:
```sh
pip install -r requirements.txt
```

4. Configure environment variables:
Create a `.env` file in the backend directory with the following variables:
```
INFOBIP_API_KEY=your_api_key_here
INFOBIP_BASE_URL=api.infobip.com
INFOBIP_SENDER=your_sender_number
```

5. Start the Flask server:
```sh
python app.py
```

The backend API will be available at `http://localhost:5000`

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── lib/           # Utilities and types
├── backend/
│   ├── app.py         # Flask application
│   └── requirements.txt
└── public/            # Static assets
```

## API Endpoints

### POST /api/send-alert
Sends WhatsApp alerts through Infobip integration
- Request body:
  ```json
  {
    "message": "Alert message",
    "phone": "recipient_phone_number"
  }
  ```

## Technologies Used

### Frontend
- Vite
- React
- TypeScript
- shadcn/ui
- Tailwind CSS
- react-leaflet (for maps)
- recharts (for charts)
- Tanstack Query

### Backend
- Flask
- Flask-CORS
- python-dotenv
- Infobip API integration

## Development Guidelines

1. Follow the existing code style and structure
2. Use TypeScript for type safety
3. Implement responsive designs using Tailwind CSS
4. Utilize shadcn/ui components when possible
5. Follow RESTful API practices

## Deployment

### Frontend
The frontend can be deployed using platforms like Netlify, Vercel, or GitHub Pages. For deployment instructions, visit our [deployment documentation](https://docs.lovable.dev/tips-tricks/custom-domain/).

### Backend
The backend can be deployed to platforms like Heroku, DigitalOcean, or AWS. Ensure environment variables are properly configured in your deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support and questions, please:
- Open an issue in the repository
- Contact the development team
- Visit our [documentation](https://docs.aycesafe.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.