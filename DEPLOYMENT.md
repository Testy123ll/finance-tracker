# Deployment Guide

This guide provides step-by-step instructions for deploying the Finance Tracker application.

## Prerequisites

- Git repository set up (✓ Done)
- Environment variables configured
- Database service (PostgreSQL)
- Deployment platforms selected

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Push code to GitHub** (Already done ✓)
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select `finance-tracker-frontend` as the root directory

3. **Set Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-domain.com
     ```

4. **Deploy**
   - Click "Deploy" - Vercel will auto-deploy on git push

#### Backend Deployment (Railway.app)

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Select your repository

2. **Configure Service**
   - Set root directory: `finance-tracker-backend`
   - Add environment variables:
     ```
     DATABASE_URL=<your-postgresql-url>
     JWT_SECRET=<your-secret-key>
     PORT=3001
     CORS_ORIGIN=https://your-frontend-domain.vercel.app
     ```

3. **Deploy**
   - Railway will auto-deploy on git push
   - Get your backend URL from Railway dashboard

---

### Option 2: Heroku (Frontend & Backend)

#### Setup Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### Deploy Backend to Heroku

```bash
cd finance-tracker-backend

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set DATABASE_URL="your-postgres-url"
heroku config:set JWT_SECRET="your-secret"
heroku config:set CORS_ORIGIN="https://your-frontend.herokuapp.com"

# Deploy
git push heroku main
```

#### Deploy Frontend to Heroku

```bash
cd ../finance-tracker-frontend

# Create Heroku app
heroku create your-frontend-app-name

# Set environment variables
heroku config:set NEXT_PUBLIC_API_URL="https://your-backend.herokuapp.com"

# Deploy
git push heroku main
```

---

### Option 3: Docker Deployment (Advanced)

#### Create Backend Dockerfile

```dockerfile
# finance-tracker-backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3001
CMD ["npm", "start"]
```

#### Create Frontend Dockerfile

```dockerfile
# finance-tracker-frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Post-Deployment

### 1. Run Database Migrations

After deploying the backend, run migrations:

```bash
cd finance-tracker-backend

# Using Heroku
heroku run npx prisma migrate deploy

# Using Railway
railway run npx prisma migrate deploy
```

### 2. Test the Connection

- Visit your frontend URL
- Try registering/logging in
- Check browser console for any errors

### 3. Update URLs

If you're switching backends:

**In Vercel Dashboard (Frontend):**
- Update `NEXT_PUBLIC_API_URL` environment variable

**Update CORS in Backend:**
- Update `CORS_ORIGIN` to match your frontend URL

### 4. Monitor Logs

**Vercel:**
```bash
vercel logs
```

**Railway:**
- Dashboard → Logs tab

**Heroku:**
```bash
heroku logs --tail
```

---

## Troubleshooting

### 401 Unauthorized Errors
- Check JWT_SECRET is same in backend
- Verify token is being sent in request headers

### CORS Errors
- Update CORS_ORIGIN in backend environment
- Ensure frontend URL matches CORS_ORIGIN

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check database service is running
- Test connection string locally first

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for environment variable typos

---

## CI/CD Pipeline (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}
      
      - name: Deploy Backend
        run: |
          curl -X POST ${{ secrets.RAILWAY_DEPLOY_HOOK }}
```

---

## Production Checklist

- [ ] Environment variables configured on all platforms
- [ ] Database migrations run successfully
- [ ] Frontend can communicate with backend
- [ ] Authentication flow works (register/login)
- [ ] CORS properly configured
- [ ] JWT_SECRET is securely stored
- [ ] Database backups configured
- [ ] Error monitoring set up
- [ ] Custom domain configured
- [ ] HTTPS enabled (automatic on most platforms)

---

## Updating After Deployment

1. Make changes locally
2. Test thoroughly
3. Commit and push to main branch
4. Platforms auto-deploy (if webhooks set up)
5. Run any database migrations if needed
6. Verify changes on deployed site

---

Need help? Check the main README.md for troubleshooting steps.
