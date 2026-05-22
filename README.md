# SmartExpense Tracker

A production-quality expense tracking system built with Django 4.2 and React.

## Features
- **Modern Dashboard**: Real-time spending analytics with charts.
- **Budget Tracking**: Set monthly limits and monitor utilization.
- **RESTful API**: Built with Django Rest Framework.
- **Secure Auth**: Token-based authentication.

## Tech Stack
- **Backend**: Python 3.11, Django 4.2, DRF, SQLite.
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide Icons.

## Setup Instructions

### Backend
1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install djangorestframework django-cors-headers
   ```
2. Run migrations:
   ```bash
   python manage.py migrate
   ```
3. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` to view the application. Log in using your superuser credentials.
