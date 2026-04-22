import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Inquiry from '../models/Inquiry.js';
import { sendInquiryNotification } from '../utils/email.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('serviceId').optional().trim(),
    body('serviceName').optional().trim().isLength({ max: 120 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
    body('budget').optional().trim().isLength({ max: 100 }),
    body('timeline').optional().trim().isLength({ max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
      }

      const { name, email, phone, serviceId, serviceName, message, budget, timeline } = req.body;

      const inquiry = await Inquiry.create({
        name,
        email,
        phone: phone || '',
        serviceId: serviceId || undefined,
        serviceName: serviceName || '',
        message,
        budget: budget || '',
        timeline: timeline || '',
      });

      // Fire-and-forget notification
      sendInquiryNotification(inquiry).catch(() => {});

      res.status(201).json({
        data: { id: inquiry._id },
        message: 'Inquiry submitted successfully!',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
