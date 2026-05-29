import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import roomRoutes from './routes/rooms.js';
import tenantRoutes from './routes/tenants.js';
import { testConnection } from './config/db.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
}));
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
  try {
    await testConnection();
    return res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((error, req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || 'Server error',
    detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
  });
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
