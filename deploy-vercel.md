# Deploying Finance Tracker to Vercel

## Prerequisites
1. A Vercel account (https://vercel.com)
2. A PostgreSQL database (you can use Supabase, Railway, or any PostgreSQL provider)

## Deployment Steps

### 1. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository: `Testy123ll/finance-tracker`

### 2. Configure Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: /
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`

### 3. Environment Variables
Add these environment variables in the Vercel dashboard:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_random_jwt_secret_key_(at_least_32_characters)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Database Setup

If you don't have a PostgreSQL database yet:

### Option 1: Supabase (Free Tier Available)
1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings > Database
4. Use this as your DATABASE_URL

### Option 2: Railway (Free Tier Available)
1. Go to https://railway.app
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string

## Post-Deployment

After deployment is complete:
1. Visit your deployed app
2. Test the registration and login functionality
3. Verify that all features work correctly

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure your DATABASE_URL is correct and the database is accessible
2. **Environment Variables**: Make sure all required environment variables are set
3. **Build Errors**: Check the build logs in Vercel for any errors

### Need Help?
If you encounter any issues, check the Vercel logs or reach out for support.
