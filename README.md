# Finance Tracker 💰

A full-stack finance tracking application built with **Next.js** (frontend) and **Express** (backend) with **Prisma** ORM and PostgreSQL database.

## 📋 Project Structure

```
finance-tracker/
├── finance-tracker-backend/     # Express.js backend API
│   ├── routes/                  # API routes for transactions, categories, budgets
│   ├── middleware/              # Authentication middleware
│   ├── prisma/                  # Database schema and migrations
│   ├── index.js                 # Express server entry point
│   ├── package.json
│   └── .env                     # Backend environment variables
├── finance-tracker-frontend/    # Next.js frontend
│   ├── app/                     # Next.js app directory (dashboard, transactions, etc.)
│   ├── components/              # Reusable React components
│   ├── context/                 # React context (AuthContext)
│   ├── package.json
│   └── .env.local               # Frontend environment variables
├── package.json                 # Root package.json with workspace scripts
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- PostgreSQL database (configured in backend .env)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs dependencies for both backend and frontend (if using npm workspaces).

### Environment Setup

#### Backend Configuration (.env)

Create or update `finance-tracker-backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-for-jwt-tokens"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend Configuration (.env.local)

Create `finance-tracker-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database Setup

1. **Navigate to backend:**
   ```bash
   cd finance-tracker-backend
   ```

2. **Generate Prisma client and run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the database (optional):**
   ```bash
   npx prisma db seed
   ```

## 📝 Running the Application

### Development Mode (Both Services)

From the root directory:

```bash
npm run dev
```

This starts both the backend (http://localhost:3001) and frontend (http://localhost:3000) concurrently.

### Individual Services

**Backend only:**
```bash
npm run backend:dev
```
Backend runs on: http://localhost:3001

**Frontend only:**
```bash
npm run frontend:dev
```
Frontend runs on: http://localhost:3000

### Production Build

```bash
npm run build
```

Builds both backend and frontend for production.

## 🔗 API Integration

The frontend communicates with the backend using **Axios**. The API base URL is configured in `finance-tracker-frontend/context/AuthContext.js`:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### Main API Endpoints

- **POST** `/register` - Register a new user
- **POST** `/login` - Authenticate user and get JWT token
- **GET** `/api/categories` - Fetch user's categories (requires auth)
- **POST** `/api/categories` - Create a new category (requires auth)
- **GET** `/api/transactions` - Fetch user's transactions (requires auth)
- **POST** `/api/transactions` - Create a new transaction (requires auth)

### Authentication Flow

1. User registers or logs in via frontend
2. Backend returns JWT token
3. Frontend stores token in `localStorage`
4. Token is sent in `Authorization` header for protected routes
5. Backend middleware (`protect`) verifies token before processing requests

## 🗄️ Database Schema

The database includes the following models:

- **User** - Stores user account information and credentials
- **Category** - Tracks expense/income categories (type: EXPENSE or INCOME)
- **Transaction** - Individual transactions linked to users and categories
- **Budget** (optional) - Budget limits per category

## 📦 Dependencies

### Backend
- `express` - Web framework
- `@prisma/client` - ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin request handling
- `dotenv` - Environment variable management

### Frontend
- `next` - React framework
- `react` - UI library
- `axios` - HTTP client
- `chart.js` & `react-chartjs-2` - Data visualization
- `tailwindcss` - Styling

## 🛠️ Troubleshooting

### Backend won't start
- Ensure `.env` file has valid `DATABASE_URL`
- Run database migrations: `npx prisma migrate dev`
- Check if port 3001 is available

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Database connection issues
- Verify PostgreSQL is running
- Test connection string in `.env`
- Check network connectivity to database host

## 🌐 Deployment

### Deploy to Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with one click

### Deploy to Heroku/Railway (Backend)

1. Set up your deployment platform
2. Add environment variables
3. Deploy using Git or platform-specific CLI

## 📝 License

ISC

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy tracking! 💼📊**
