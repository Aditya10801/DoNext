const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CORS ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-flux-key'],
}));

app.use(express.json());

// --- DB ---
const connectDB = require('./config/db');
connectDB();

// --- ROUTES ---
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// --- HEALTH CHECK (to keep Render awake & verify deploy) ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Flux server is running.' });
});

// --- START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});