import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotification, sendContactAutoReply } from '../utils/email.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
      }

      const { name, email, subject, message } = req.body;

      const contact = await ContactMessage.create({
        name,
        email,
        subject: subject || '',
        message,
        ipAddress: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
        userAgent: req.headers['user-agent'] || '',
      });

      // Fire-and-forget emails
      sendContactNotification(contact).catch(() => {});
      sendContactAutoReply(contact).catch(() => {});

      res.status(201).json({
        data: { id: contact._id },
        message: 'Message sent successfully!',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
