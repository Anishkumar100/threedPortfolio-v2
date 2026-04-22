import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import Service from '../models/Service.js';
import Inquiry from '../models/Inquiry.js';
import ContactMessage from '../models/ContactMessage.js';
import Analytics from '../models/Analytics.js';
import MaintenanceMode from '../models/MaintenanceMode.js';
import { sendMaintenanceAlert } from '../utils/email.js';

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return false;
  }
  return true;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const { email, password } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      if (email !== adminEmail) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, adminPasswordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(
        { email: adminEmail, role: 'admin' },
        process.env.JWT_EXPIRES_IN || '7d'
      );

      const refreshToken = generateToken(
        { email: adminEmail, role: 'admin', type: 'refresh' },
        process.env.JWT_REFRESH_EXPIRES_IN || '30d'
      );

      res.json({ token, refreshToken, expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const { refreshToken } = req.body;
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      if (decoded.type !== 'refresh') {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const token = generateToken(
        { email: decoded.email, role: 'admin' },
        process.env.JWT_EXPIRES_IN || '7d'
      );

      res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Refresh token expired. Please login again.' });
      }
      next(err);
    }
  }
);

// ─── All routes below require auth ──────────────────────────────────────────
router.use(auth);

// ─── Dashboard ───────────────────────────────────────────────────────────────

router.get('/dashboard', async (req, res, next) => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalServices, totalInquiries, unreadMessages, monthlyViews, weeklyViews] =
      await Promise.all([
        Service.countDocuments({ isActive: true }),
        Inquiry.countDocuments(),
        ContactMessage.countDocuments({ status: 'unread' }),
        Analytics.countDocuments({ event: 'pageview', timestamp: { $gte: oneMonthAgo } }),
        Analytics.countDocuments({ event: 'pageview', timestamp: { $gte: oneWeekAgo } }),
      ]);

    res.json({
      data: { totalServices, totalInquiries, unreadMessages, monthlyViews, weeklyViews },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Services CRUD ───────────────────────────────────────────────────────────

router.get('/services', async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ data: services, count: services.length });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/services',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number'),
  ],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;
      const service = await Service.create(req.body);
      res.status(201).json({ data: service });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/services/:id',
  [param('id').isMongoId().withMessage('Invalid service ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ data: service });
    } catch (err) {
      next(err);
    }
  }
);

// Soft delete (sets isActive: false)
router.delete(
  '/services/:id',
  [param('id').isMongoId().withMessage('Invalid service ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ data: service, message: 'Service soft-deleted' });
    } catch (err) {
      next(err);
    }
  }
);

// Restore soft-deleted
router.put(
  '/services/:id/restore',
  [param('id').isMongoId().withMessage('Invalid service ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ data: service, message: 'Service restored' });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Inquiries CRUD ──────────────────────────────────────────────────────────

router.get('/inquiries', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json({ data: inquiries, count: inquiries.length });
  } catch (err) {
    next(err);
  }
});

router.get(
  '/inquiries/:id',
  [param('id').isMongoId().withMessage('Invalid inquiry ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
      res.json({ data: inquiry });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/inquiries/:id',
  [param('id').isMongoId().withMessage('Invalid inquiry ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
      res.json({ data: inquiry });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/inquiries/:id',
  [param('id').isMongoId().withMessage('Invalid inquiry ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;
      const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
      if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
      res.json({ message: 'Inquiry deleted' });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Messages CRUD ───────────────────────────────────────────────────────────

router.get('/messages', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json({ data: messages, count: messages.length });
  } catch (err) {
    next(err);
  }
});

router.get(
  '/messages/:id',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;
      const msg = await ContactMessage.findById(req.params.id);
      if (!msg) return res.status(404).json({ error: 'Message not found' });
      res.json({ data: msg });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/messages/:id',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!msg) return res.status(404).json({ error: 'Message not found' });
      res.json({ data: msg });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/messages/:id',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;
      const msg = await ContactMessage.findByIdAndDelete(req.params.id);
      if (!msg) return res.status(404).json({ error: 'Message not found' });
      res.json({ message: 'Message deleted' });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Analytics ───────────────────────────────────────────────────────────────

router.get('/analytics', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [pageViews, topPages, eventBreakdown, dailyTrend] = await Promise.all([
      Analytics.countDocuments({ event: 'pageview', timestamp: { $gte: since } }),
      Analytics.aggregate([
        { $match: { event: 'pageview', timestamp: { $gte: since } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Analytics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Analytics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      data: {
        pageViews,
        topPages: topPages.map((p) => ({ page: p._id, count: p.count })),
        eventBreakdown: eventBreakdown.map((e) => ({ event: e._id, count: e.count })),
        dailyTrend: dailyTrend.map((d) => ({ date: d._id, count: d.count })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// CSV export
router.get('/analytics/export', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await Analytics.find({ timestamp: { $gte: since } })
      .sort({ timestamp: -1 })
      .lean();

    const header = 'timestamp,page,event,ip,userAgent,referrer,sessionId\n';
    const rows = events
      .map(
        (e) =>
          `"${e.timestamp.toISOString()}","${e.page}","${e.event}","${e.ip}","${(e.userAgent || '').replace(/"/g, '""')}","${e.referrer || ''}","${e.sessionId || ''}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${days}d.csv`);
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
});

// ─── Maintenance ─────────────────────────────────────────────────────────────

router.get('/maintenance', async (req, res, next) => {
  try {
    const maintenance = await MaintenanceMode.getInstance();
    res.json({ data: maintenance });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/maintenance',
  [
    body('isEnabled').optional().isBoolean().withMessage('isEnabled must be a boolean'),
    body('message').optional().trim().isLength({ max: 500 }),
    body('estimatedEnd').optional({ nullable: true }),
    body('allowedIPs').optional().isArray(),
  ],
  async (req, res, next) => {
    try {
      if (!validateRequest(req, res)) return;

      const maintenance = await MaintenanceMode.getInstance();
      const { isEnabled, message, estimatedEnd, allowedIPs } = req.body;

      if (typeof isEnabled === 'boolean') maintenance.isEnabled = isEnabled;
      if (message !== undefined) maintenance.message = message;
      if (estimatedEnd !== undefined) maintenance.estimatedEnd = estimatedEnd;
      if (Array.isArray(allowedIPs)) maintenance.allowedIPs = allowedIPs;

      maintenance.updatedAt = new Date();
      maintenance.updatedBy = req.admin?.email || 'admin';

      await maintenance.save();

      // Fire-and-forget alert
      sendMaintenanceAlert({
        isEnabled: maintenance.isEnabled,
        message: maintenance.message,
        estimatedEnd: maintenance.estimatedEnd,
      }).catch(() => {});

      res.json({ data: maintenance });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
