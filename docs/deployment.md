# Production Deployment Blueprint

## 1. Environment Configuration

### Backend (`backend/.env`)
```env
DEBUG=False
SECRET_KEY=production-crypto-secret-key-change-this
ALLOWED_HOSTS=api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgres://user:password@localhost:5432/nms_db
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## 2. Server Infrastructure
- **Web Server**: Nginx as Reverse Proxy & SSL termination.
- **App Server**: Gunicorn WSGI workers.
- **Database**: PostgreSQL 15+ with daily automated backup cron jobs.
- **Frontend Hosting**: Vercel / Netlify / Nginx static host.
