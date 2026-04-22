import { Router } from 'express';
import Service from '../models/Service.js';

const router = Router();

// GET /api/services — list active services, optional ?category, ?featured
router.get('/', async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ data: services, count: services.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/categories — distinct active categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ data: service });
  } catch (err) {
    next(err);
  }
});

export default router;
