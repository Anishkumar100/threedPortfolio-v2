import { Router } from 'express';
import mongoose from 'mongoose';
import MaintenanceMode from '../models/MaintenanceMode.js';

const router = Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: dbState === 1 ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus[dbState] || 'unknown',
  });
});

// GET /api/maintenance/status
router.get('/maintenance/status', async (req, res, next) => {
  try {
    const maintenance = await MaintenanceMode.getInstance();
    res.json({
      isEnabled: maintenance.isEnabled,
      message: maintenance.message,
      estimatedEnd: maintenance.estimatedEnd,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
