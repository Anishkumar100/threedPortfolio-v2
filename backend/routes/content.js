import { Router } from 'express';
import Project from '../models/Project.js';
import SkillCategory from '../models/SkillCategory.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Leadership from '../models/Leadership.js';
import Testimonial from '../models/Testimonial.js';
import Profile from '../models/Profile.js';
import SiteConfig from '../models/SiteConfig.js';

const router = Router();

// ─── Projects ────────────────────────────────────────────────────────────────

router.get('/projects', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ data: projects, count: projects.length });
  } catch (err) { next(err); }
});

router.get('/projects/categories', async (req, res, next) => {
  try {
    const categories = await Project.distinct('category', { isActive: true });
    res.json({ data: categories });
  } catch (err) { next(err); }
});

router.get('/projects/:projectId', async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId, isActive: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ data: project });
  } catch (err) { next(err); }
});

// ─── Skills ──────────────────────────────────────────────────────────────────

router.get('/skills', async (req, res, next) => {
  try {
    const categories = await SkillCategory.find({ isActive: true }).sort({ order: 1 });
    res.json({ data: categories });
  } catch (err) { next(err); }
});

// ─── Experience ──────────────────────────────────────────────────────────────

router.get('/experience', async (req, res, next) => {
  try {
    const items = await Experience.find({ isActive: true }).sort({ order: 1 });
    res.json({ data: items });
  } catch (err) { next(err); }
});

// ─── Education ───────────────────────────────────────────────────────────────

router.get('/education', async (req, res, next) => {
  try {
    const items = await Education.find({ isActive: true }).sort({ order: 1 });
    res.json({ data: items });
  } catch (err) { next(err); }
});

// ─── Leadership ──────────────────────────────────────────────────────────────

router.get('/leadership', async (req, res, next) => {
  try {
    const items = await Leadership.find({ isActive: true }).sort({ order: 1 });
    res.json({ data: items });
  } catch (err) { next(err); }
});

// ─── Testimonials ────────────────────────────────────────────────────────────

router.get('/testimonials', async (req, res, next) => {
  try {
    const items = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    res.json({ data: items });
  } catch (err) { next(err); }
});

// ─── Profile (singleton) ────────────────────────────────────────────────────

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.getInstance();
    res.json({ data: profile });
  } catch (err) { next(err); }
});

// ─── Site Config (singleton) ────────────────────────────────────────────────

router.get('/config', async (req, res, next) => {
  try {
    const config = await SiteConfig.getInstance();
    res.json({ data: config });
  } catch (err) { next(err); }
});

export default router;
