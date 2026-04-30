import 'dotenv/config';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import maintenanceCheck from './middleware/maintenance.js';
import errorHandler from './middleware/errorHandler.js';

import healthRoutes from './routes/health.js';
import servicesRoutes from './routes/services.js';
import contactRoutes from './routes/contact.js';
import inquiriesRoutes from './routes/inquiries.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';
import adminContentRoutes from './routes/adminContent.js';
import uploadRoutes from './routes/upload.js';
import auth from './middleware/auth.js';

const isVercel = !!process.env.VERCEL;

// Ensure logs directory exists (skip on Vercel — read-only filesystem)
if (!isVercel) {
  try { mkdirSync(path.join(__dirname, 'logs'), { recursive: true }); } catch {}
}

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Core Middleware ─────────────────────────────────────────────────────────

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP logging
app.use(
  morgan('short', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// General rate limit
app.use(generalLimiter);

// ─── Database Connection (cached for serverless) ────────────────────────────

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(mongoURI);
    isConnected = true;
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

// On Vercel: connect lazily before any route handler
if (isVercel) {
  app.use(async (req, res, next) => {
    try { await connectDB(); } catch {}
    next();
  });
}

// ─── Routes (health + maintenance status bypass maintenance middleware) ──────


app.use('/api', healthRoutes);

// Maintenance middleware for all other public routes
app.use(maintenanceCheck);

// ─── Public API ──────────────────────────────────────────────────────────────

app.use('/api/services', servicesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);

// ─── Admin API ───────────────────────────────────────────────────────────────

app.use('/api/admin', adminRoutes);
app.use('/api/admin/content', auth, adminContentRoutes);
app.use('/api/admin/upload', uploadRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start (local dev only — Vercel uses the exported app) ──────────────────

if (!isVercel) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  }).catch((err) => {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  });
}

export default app;
