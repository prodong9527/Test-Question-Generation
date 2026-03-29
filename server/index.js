import express from 'express';
import cors from 'cors';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import answerRoutes from './routes/answers.js';
import { parseFile } from './utils/fileParser.js';

const app = express();
const PORT = 3001;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/answers', answerRoutes);

app.post('/api/exams/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    const content = await parseFile(req.file.buffer, req.file.mimetype);
    res.json({ content });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({ error: '文件处理失败' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '培训答题系统 API 运行中' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});