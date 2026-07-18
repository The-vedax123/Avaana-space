import { Router } from 'express';
import multer from 'multer';
import { customAlphabet } from 'nanoid';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { authenticate } from '../../middleware/auth.js';
import { ApiError } from '../../utils/apiError.js';
import { ok } from '../../utils/http.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'avaanaspace-uploads')
  : path.resolve(__dirname, '../../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const genName = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 20);
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.bin';
    cb(null, `${genName()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(ApiError.badRequest('Only image uploads are allowed (jpeg, png, webp, gif, svg)'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', authenticate, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return next(ApiError.badRequest('File exceeds 5MB limit'));
      return next(err instanceof ApiError ? err : ApiError.badRequest(err.message));
    }
    if (!req.file) return next(ApiError.badRequest('No file provided (field name: "file")'));
    return ok(res, {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

export const uploadDirPath = uploadDir;
export default router;
