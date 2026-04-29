# Smart Expense Tracker MVP

**Track. Understand. Improve.**

A simple, powerful expense tracking web application for students and young professionals to take control of their finances.

## Features

- 🔐 Secure authentication with email verification
- 💸 Quick expense logging (< 10 seconds)
- 🗂️ Smart category suggestions
- 📊 Real-time dashboard with visualizations
- 🎯 Budget tracking with alerts
- 🔔 Smart notifications
- 📱 Fully responsive design
- 🔄 Recurring expenses support

## Tech Stack

- Django 4.2+
- PostgreSQL / SQLite
- Bootstrap 5
- Chart.js
- Celery (background tasks)

## Quick Start

### Prerequisites
- Python 3.8+
- pip
- virtualenv

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saunak3105/smart-expense-tracker.git
cd smart-expense-tracker
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Setup environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run development server:
```bash
python manage.py runserver
```

Visit `http://localhost:8000` in your browser.

## Project Structure

```
smart-expense-tracker/
├── config/                 # Django settings
├── apps/
│   ├── users/             # Authentication & profiles
│   ├── expenses/          # Expense management
│   ├── categories/        # Category system
│   ├── budgets/           # Budget tracking
│   ├── dashboard/         # Analytics
│   └── notifications/     # Alerts
├── templates/             # HTML templates
├── static/                # CSS, JS, images
├── tests/                 # Test suite
├── manage.py
├── requirements.txt
└── .env.example
```

## API Endpoints

### Authentication
- `POST /auth/signup/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `POST /auth/password-reset/` - Password reset

### Expenses
- `GET /expenses/` - List expenses
- `POST /expenses/` - Create expense
- `GET /expenses/<id>/` - Get expense details
- `PUT /expenses/<id>/` - Update expense
- `DELETE /expenses/<id>/` - Delete expense

### Dashboard
- `GET /dashboard/` - Dashboard data
- `GET /dashboard/summary/` - Spending summary
- `GET /dashboard/breakdown/` - Category breakdown
- `GET /dashboard/trends/` - Daily trends

### Budgets
- `GET /budgets/<month>/` - Get budget
- `POST /budgets/` - Create budget
- `PUT /budgets/<month>/` - Update budget

## Security Features

✅ CSRF protection on all forms
✅ XSS prevention with template escaping
✅ SQL injection prevention via Django ORM
✅ Password hashing with PBKDF2
✅ HTTPS/TLS support
✅ Secure cookies
✅ Row-level access control
✅ Rate limiting
✅ Email verification
✅ Audit logging

## Testing

Run tests with coverage:
```bash
pytest --cov=apps --cov-report=html
```

Target: 70%+ code coverage

## Deployment

### Docker
```bash
docker-compose up
```

### Production
See `docs/DEPLOYMENT.md` for detailed instructions.

## Performance Targets

- 📈 DAU: 500+ (Month 3)
- 👥 MAU: 2,000+ (Month 3)
- ⏱️ Dashboard load: < 1 second
- 📝 Expense logging: < 10 seconds
- 💾 7-day retention: > 45%

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@smartexpensetracker.com or open an issue on GitHub.

## Roadmap

- ✅ MVP with core features (Week 8)
- 🔜 Recurring expenses automation (Week 12)
- 🔜 Advanced analytics (Week 16)
- 🔜 Mobile app (Q3 2026)
- 🔜 Open banking integration (Q4 2026)

---

**Made with ❤️ by Saunak**
