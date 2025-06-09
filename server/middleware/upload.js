import multer from 'multer';
import { mkdir, access } from 'node:fs/promises';
import path from 'path';

const targetDir = './uploads';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await access(targetDir);
    } catch {
      await mkdir(targetDir);
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
export default upload;