# Quick Start Guide 🚀

Get the Finance Tracker running in 5 minutes!

## Step 1: Clone & Install

```bash
git clone https://github.com/Testy123ll/finance-tracker.git
cd finance-tracker
npm install
```

## Step 2: Configure Environment

### Backend Setup

1. Copy the `.env.example` file:
   ```bash
   cp finance-tracker-backend/.env.example finance-tracker-backend/.env
   ```

2. Edit `finance-tracker-backend/.env` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker"
   JWT_SECRET="generate-a-random-secret-key-here"
   PORT=3001
   CORS_ORIGIN="http://localhost:3000"
   ```

### Frontend Setup

The frontend `.env.local` is already configured for local development:
- `NEXT_PUBLIC_API_URL=http://localhost:3001`

## Step 3: Setup Database

```bash
cd finance-tracker-backend
npx prisma migrate dev --name init
cd ..
```

## Step 4: Start Development

From the root directory:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## Step 5: Test It Out

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" and create an account
3. Log in with your credentials
4. Start adding transactions!

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `.env` file - ensure DATABASE_URL is valid |
| Can't connect to DB | Ensure PostgreSQL is running and DATABASE_URL is correct |
| Frontend shows 401 errors | Clear localStorage, logout, and log back in |
| Port already in use | Change PORT in backend `.env` or stop other services |

---

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- 🐛 See [Troubleshooting](#common-issues) above

---

## Project Commands

```bash
# Run both services
npm run dev

# Run only backend
npm run backend:dev

# Run only frontend
npm run frontend:dev

# Build for production
npm run build

# Start production server
npm start
```

---

**That's it! Happy tracking! 💰**
