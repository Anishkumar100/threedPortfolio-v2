import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import auth from '../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  },
});

// POST /api/admin/upload — single file upload to Cloudinary
router.post('/', auth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'portfolio';

    const result = await uploadToCloudinary(req.file.buffer, { folder });

    res.json({
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        originalName: req.file.originalname,
      },
    });
  } catch (err) {
    if (err.message?.includes('not allowed')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
