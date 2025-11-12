// index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataRoutes = require('./routes/dataRoutes'); 
const cors = require('cors'); // We need this to allow the frontend to talk to the backend

// --- Setup ---
const app = express();
const prisma = new PrismaClient();
app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the Next.js frontend to connect
})); 
const PORT = process.env.PORT || 3001;
const JWT_SECRET = "your-very-secret-key-for-auth"; 

// --- Authentication Endpoints ---

// POST /register - Creates a new user
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true }, 
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});


// POST /login - Authenticates user and returns a JWT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.json({ accessToken: token });

  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});


// --- Data Routes ---
app.use('/api', dataRoutes); 


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Backend Server running on http://localhost:${PORT}`);
});