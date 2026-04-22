import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Analytics from '../models/Analytics.js';
import { analyticsLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/track',
  analyticsLimiter,
  [
    body('page').trim().notEmpty().withMessage('Page is required'),
    body('event')
      .trim()
      .isIn(['pageview', 'service_view', 'inquiry_start', 'contact_submit', 'project_view', 'cta_click'])
      .withMessage('Invalid event type'),
    body('metadata').optional().isObject(),
    body('sessionId').optional().trim(),
    body('referrer').optional().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
      }

      const { page, event, metadata, sessionId, referrer } = req.body;

      await Analytics.create({
        page,
        event,
        metadata: metadata || {},
        ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
        userAgent: req.headers['user-agent'] || '',
        referrer: referrer || req.headers.referer || '',
        sessionId: sessionId || '',
      });

      res.status(201).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
