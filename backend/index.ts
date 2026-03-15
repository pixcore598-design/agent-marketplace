import express from 'express';
import cors from 'cors';

const app = express();

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be handled by Vercel Functions in /api directory
// This file is just to satisfy Vercel's Express detection

export default app;