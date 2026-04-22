import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import SkillCategory from '../models/SkillCategory.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Leadership from '../models/Leadership.js';
import Testimonial from '../models/Testimonial.js';
import Profile from '../models/Profile.js';
import SiteConfig from '../models/SiteConfig.js';

const router = Router();

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array().map((e) => ({ field: e.path, message: e.msg })) });
    return false;
  }
  return true;
};

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC CRUD FACTORY — DRY helpers for repetitive model CRUD
// ═══════════════════════════════════════════════════════════════════════════════

function crudRoutes(model, { idField = '_id', sortBy = { order: 1, createdAt: -1 } } = {}) {
  const r = Router();

  // LIST all (including inactive for admin)
  r.get('/', async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.active === 'true') filter.isActive = true;
      if (req.query.active === 'false') filter.isActive = false;
      const items = await model.find(filter).sort(sortBy);
      res.json({ data: items, count: items.length });
    } catch (err) { next(err); }
  });

  // GET single by MongoDB _id
  r.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const item = await model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: item });
    } catch (err) { next(err); }
  });

  // CREATE
  r.post('/', async (req, res, next) => {
    try {
      const item = await model.create(req.body);
      res.status(201).json({ data: item });
    } catch (err) { next(err); }
  });

  // REORDER — must be BEFORE /:id to prevent Express matching 'batch' as an id
  r.put('/batch/reorder', async (req, res, next) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
      const ops = items.map(({ id, order }) => ({
        updateOne: { filter: { _id: id }, update: { order } },
      }));
      await model.bulkWrite(ops);
      res.json({ message: `Reordered ${items.length} items` });
    } catch (err) { next(err); }
  });

  // UPDATE
  r.put('/:id', [param('id').isMongoId().withMessage('Invalid ID')], async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: item });
    } catch (err) { next(err); }
  });

  // SOFT DELETE (set isActive: false)
  r.delete('/:id', [param('id').isMongoId().withMessage('Invalid ID')], async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const item = await model.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: item, message: 'Soft-deleted' });
    } catch (err) { next(err); }
  });

  // RESTORE
  r.put('/:id/restore', [param('id').isMongoId().withMessage('Invalid ID')], async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const item = await model.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: item, message: 'Restored' });
    } catch (err) { next(err); }
  });

  // HARD DELETE (permanent)
  r.delete('/:id/permanent', [param('id').isMongoId().withMessage('Invalid ID')], async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const item = await model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Permanently deleted' });
    } catch (err) { next(err); }
  });

  return r;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOUNT CRUD ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

router.use('/projects', crudRoutes(Project));
router.use('/skills', crudRoutes(SkillCategory));
router.use('/experience', crudRoutes(Experience));
router.use('/education', crudRoutes(Education));
router.use('/leadership', crudRoutes(Leadership));
router.use('/testimonials', crudRoutes(Testimonial));

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE SINGLETON — GET + PUT (no create/delete)
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.getInstance();
    res.json({ data: profile });
  } catch (err) { next(err); }
});

router.put('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.getInstance();
    Object.assign(profile, req.body);
    await profile.save();
    res.json({ data: profile });
  } catch (err) { next(err); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SITE CONFIG SINGLETON — GET + PUT (no create/delete)
// Admin can modify any of: aboutStats, heroStats, quickFacts, values, hobbies,
// achievements, currentlyLearning, words, counterItems, abilities, socialLinks,
// logoIcons — individually or together in one call.
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/config', async (req, res, next) => {
  try {
    const config = await SiteConfig.getInstance();
    res.json({ data: config });
  } catch (err) { next(err); }
});

router.put('/config', async (req, res, next) => {
  try {
    const config = await SiteConfig.getInstance();
    const allowedFields = [
      'aboutStats', 'heroStats', 'quickFacts', 'values', 'hobbies',
      'achievements', 'currentlyLearning', 'words', 'counterItems',
      'abilities', 'socialLinks', 'logoIcons',
    ];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
      }
    }
    await config.save();
    res.json({ data: config });
  } catch (err) { next(err); }
});

// Convenience: update a single config section (e.g., PUT /config/hobbies)
router.put('/config/:section', async (req, res, next) => {
  try {
    const { section } = req.params;
    const allowedSections = [
      'aboutStats', 'heroStats', 'quickFacts', 'values', 'hobbies',
      'achievements', 'currentlyLearning', 'words', 'counterItems',
      'abilities', 'socialLinks', 'logoIcons',
    ];
    if (!allowedSections.includes(section)) {
      return res.status(400).json({ error: `Invalid section: ${section}. Allowed: ${allowedSections.join(', ')}` });
    }
    const config = await SiteConfig.getInstance();
    config[section] = req.body.data || req.body;
    await config.save();
    res.json({ data: config[section], section });
  } catch (err) { next(err); }
});

export default router;
