# Deployment Guide

This guide covers deploying the Mafia Party Game Platform in various environments.

## Table of Contents
1. [Docker Deployment (Recommended)](#docker-deployment)
2. [Manual Deployment](#manual-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Troubleshooting](#troubleshooting)

## Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/NickKapanadze/SAGITweb.git
cd SAGITweb
```

2. Start all services:
```bash
docker-compose up -d
```

3. Wait for services to initialize (about 30 seconds)

4. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Stopping Services

```bash
docker-compose down
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Manual Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=mafia_game
DB_SYNC=true
REDIS_URL=redis://localhost:6379
PORT=3000
```

5. Ensure PostgreSQL is running and create database:
```bash
psql -U postgres
CREATE DATABASE mafia_game;
\q
```

6. Seed default roles (optional - will be done automatically on first run):
```bash
npm run build
node dist/database/seeds/roles.seed.js
```

7. Start the backend:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

4. Start the frontend:
```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

## Production Deployment

### Using Docker in Production

1. Update `docker-compose.yml` for production:
   - Set `DB_SYNC=false` (use migrations instead)
   - Use environment-specific secrets
   - Add volume for persistent data

2. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

3. Run with production config:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Using NGINX Reverse Proxy

Example NGINX configuration:

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:3001;
}

server {
    listen 80;
    server_name mafiagame.example.com;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_NAME` | Database name | mafia_game |
| `DB_SYNC` | Auto-sync schema (dev only) | true |
| `DB_LOGGING` | Enable query logging | false |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `PORT` | Server port | 3000 |
| `CORS_ORIGIN` | Allowed CORS origins | * |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRY` | JWT expiration time | 7d |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3000 |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | ws://localhost:3000 |

## Database Setup

### Running Migrations

Migrations are handled automatically by TypeORM when `DB_SYNC=true` in development.

For production, you should use proper migrations:

```bash
cd backend
npm run migration:generate -- -n InitialSchema
npm run migration:run
```

### Seeding Default Roles

Default roles are seeded automatically on first run. To manually seed:

```bash
cd backend
npm run seed
```

### Database Backup

```bash
# Backup
pg_dump -U postgres mafia_game > backup.sql

# Restore
psql -U postgres mafia_game < backup.sql
```

## Troubleshooting

### Backend won't start

1. Check PostgreSQL is running:
```bash
psql -U postgres -c "SELECT version();"
```

2. Check Redis is running:
```bash
redis-cli ping
```

3. Verify environment variables:
```bash
cd backend
cat .env
```

### Frontend can't connect to backend

1. Check CORS settings in backend
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check backend is accessible:
```bash
curl http://localhost:3000
```

### WebSocket connection fails

1. Ensure Socket.IO is properly configured
2. Check firewall settings
3. Verify WebSocket URL in frontend config

### Database connection errors

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists:
```bash
psql -U postgres -l
```

### Port conflicts

If ports 3000, 3001, 5432, or 6379 are in use:

1. Stop conflicting services
2. Or change ports in configuration files
3. Update docker-compose.yml if using Docker

## Performance Optimization

### Production Recommendations

1. **Enable caching**: Use Redis for session storage
2. **Database indexing**: Add indexes on frequently queried columns
3. **Connection pooling**: Configure TypeORM connection pool
4. **Static asset optimization**: Use CDN for frontend assets
5. **Horizontal scaling**: Run multiple backend instances behind load balancer

### Monitoring

Consider adding:
- Application monitoring (e.g., PM2, New Relic)
- Database monitoring (e.g., pgAdmin, DataDog)
- Log aggregation (e.g., ELK stack)
- Health checks for services

## Security Checklist

- [ ] Change default database passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Restrict CORS_ORIGIN to specific domains
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Use environment-specific secrets
- [ ] Disable DB_SYNC in production
- [ ] Configure firewall rules
- [ ] Regular security updates

## Scaling

### Horizontal Scaling

To scale the backend:

1. Run multiple backend instances
2. Use load balancer (NGINX, HAProxy)
3. Enable sticky sessions for WebSocket
4. Share Redis instance across instances

### Database Scaling

For high traffic:

1. Use read replicas for queries
2. Implement connection pooling
3. Add database indexes
4. Consider database partitioning

## Support

For issues and questions:
- GitHub Issues: https://github.com/NickKapanadze/SAGITweb/issues
- Documentation: README.md
