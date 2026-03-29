import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { generateQuestions } from '../utils/ai.js';

const router = express.Router();
const JWT_SECRET = 'training_quiz_secret_key_2024';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: '无效的token' });
  }
};

router.get('/', authenticate, (req, res) => {
  try {
    const data = db.readDB();

    if (req.user.role === 'leader') {
      const exams = data.exams.filter(e => e.leaderId === req.user.id);
      return res.json(exams.map(e => ({ ...e, questions: e.questions || [], questionTypes: e.questionTypes || {} })));
    } else {
      const completedExamIds = data.answerRecords
        .filter(r => r.userId === req.user.id)
        .map(r => r.examId);

      const exams = data.exams.filter(e =>
        e.status === 'published' && !completedExamIds.includes(e.id)
      );

      return res.json(exams.map(e => ({ ...e, questions: e.questions || [], questionTypes: e.questionTypes || {} })));
    }
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const data = db.readDB();
    const exam = data.exams.find(e => e.id === req.params.id);

    if (!exam) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    const result = {
      ...exam,
      questions: exam.questions || [],
      questionTypes: exam.questionTypes || {}
    };

    if (req.user.role === 'employee') {
      result.questions = result.questions.map(q => ({
        ...q,
        answer: undefined
      }));
    }

    res.json(result);
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以创建试卷' });
    }

    const { title, courseOutline, questionTypes } = req.body;
    const id = uuidv4();

    const data = db.readDB();

    data.exams.push({
      id,
      title,
      leaderId: req.user.id,
      courseOutline,
      questionTypes,
      status: 'draft',
      questions: [],
      createdAt: new Date().toISOString(),
      publishedAt: null
    });

    db.writeDB(data);

    res.json({ id, title, questionTypes, questions: [] });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以修改试卷' });
    }

    const data = db.readDB();
    const examIndex = data.exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    if (data.exams[examIndex].leaderId !== req.user.id) {
      return res.status(403).json({ error: '无权修改此试卷' });
    }

    const { title, courseOutline, questionTypes, questions } = req.body;

    data.exams[examIndex] = {
      ...data.exams[examIndex],
      title,
      courseOutline,
      questionTypes,
      questions: questions || []
    };

    db.writeDB(data);

    res.json(data.exams[examIndex]);
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以删除试卷' });
    }

    const data = db.readDB();
    const examIndex = data.exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    if (data.exams[examIndex].leaderId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此试卷' });
    }

    data.exams = data.exams.filter(e => e.id !== req.params.id);
    data.answerRecords = data.answerRecords.filter(r => r.examId !== req.params.id);
    data.examLinks = data.examLinks.filter(l => l.examId !== req.params.id);

    db.writeDB(data);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/generate', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以生成题目' });
    }

    const { courseName, outline, questionTypes } = req.body;
    const questions = await generateQuestions(courseName, outline, questionTypes);

    res.json({ questions });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: '生成题目失败: ' + error.message });
  }
});

router.post('/:id/publish', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以发放试卷' });
    }

    const data = db.readDB();
    const examIndex = data.exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    if (data.exams[examIndex].leaderId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此试卷' });
    }

    const questions = data.exams[examIndex].questions || [];
    if (questions.length === 0) {
      return res.status(400).json({ error: '试卷暂无题目，请先生成题目' });
    }

    data.exams[examIndex].status = 'published';
    data.exams[examIndex].publishedAt = new Date().toISOString();

    db.writeDB(data);

    res.json({ message: '发放成功' });
  } catch (error) {
    console.error('Publish exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/:id/regenerate', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以重新生成题目' });
    }

    const data = db.readDB();
    const examIndex = data.exams.findIndex(e => e.id === req.params.id);

    if (examIndex === -1) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    const { courseName, questionTypes } = req.body;
    const questions = await generateQuestions(courseName, data.exams[examIndex].courseOutline, questionTypes);

    data.exams[examIndex].questions = questions;
    db.writeDB(data);

    res.json({ questions });
  } catch (error) {
    console.error('Regenerate questions error:', error);
    res.status(500).json({ error: '重新生成失败: ' + error.message });
  }
});

router.get('/:id/link', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '只有领导可以生成链接' });
    }

    const data = db.readDB();
    const exam = data.exams.find(e => e.id === req.params.id);

    if (!exam) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    const code = uuidv4().substring(0, 8);
    const linkId = uuidv4();

    data.examLinks.push({
      id: linkId,
      examId: req.params.id,
      code,
      createdAt: new Date().toISOString()
    });

    db.writeDB(data);

    res.json({
      link: `${req.protocol}://${req.get('host')}/#/exam/${code}`,
      code
    });
  } catch (error) {
    console.error('Generate link error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/link/:code', (req, res) => {
  try {
    const data = db.readDB();
    const link = data.examLinks.find(l => l.code === req.params.code);

    if (!link) {
      return res.status(404).json({ error: '链接不存在或已失效' });
    }

    const exam = data.exams.find(e => e.id === link.examId);
    if (!exam) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    res.json({ examId: link.examId });
  } catch (error) {
    console.error('Get link exam error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
