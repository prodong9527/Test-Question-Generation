import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

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

router.post('/:examId/submit', authenticate, (req, res) => {
  try {
    const { answers } = req.body;
    const examId = req.params.examId;

    const data = db.readDB();
    const exam = data.exams.find(e => e.id === examId);

    if (!exam) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    if (exam.status !== 'published') {
      return res.status(400).json({ error: '试卷未发放或已结束' });
    }

    const existing = data.answerRecords.find(r => r.examId === examId && r.userId === req.user.id);
    if (existing) {
      return res.status(400).json({ error: '您已提交过此试卷' });
    }

    const questions = exam.questions || [];
    let totalScore = 0;
    const scoredAnswers = [];

    for (const ans of answers) {
      const question = questions.find(q => q.id === ans.questionId);
      if (!question) continue;

      let score = null;
      let isCorrect = false;

      if (question.type === 'single') {
        const userAnswer = (ans.answer || '').toString().trim().toUpperCase();
        const correctAnswer = (question.answer || '').toString().trim().toUpperCase();
        isCorrect = userAnswer === correctAnswer;
        score = isCorrect ? question.score : 0;
      } else if (question.type === 'multiple') {
        const userAnswers = Array.isArray(ans.answer)
          ? ans.answer.map(a => a.toString().trim().toUpperCase()).sort()
          : [];
        const correctAnswers = Array.isArray(question.answer)
          ? question.answer.map(a => a.toString().trim().toUpperCase()).sort()
          : [];
        isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
        score = isCorrect ? question.score : 0;
      } else {
        score = null;
      }

      if (score !== null) {
        totalScore += score;
      }

      scoredAnswers.push({
        questionId: ans.questionId,
        answer: ans.answer,
        score,
        isCorrect
      });
    }

    const recordId = uuidv4();

    data.answerRecords.push({
      id: recordId,
      examId,
      userId: req.user.id,
      answers: scoredAnswers,
      totalScore,
      submittedAt: new Date().toISOString()
    });

    db.writeDB(data);

    const fillAndEssayCount = questions.filter(q => q.type === 'fill' || q.type === 'essay').length;
    const hasPendingGrading = fillAndEssayCount > 0;

    res.json({
      message: '提交成功',
      totalScore,
      hasPendingGrading,
      pendingMessage: hasPendingGrading ? '简答题和填空题待领导评分' : null
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/my', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ error: '权限不足' });
    }

    const data = db.readDB();

    const records = data.answerRecords
      .filter(r => r.userId === req.user.id)
      .map(r => {
        const exam = data.exams.find(e => e.id === r.examId);
        return {
          ...r,
          examTitle: exam?.title || '未知试卷'
        };
      });

    res.json(records);
  } catch (error) {
    console.error('Get my answers error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/leader/results', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '权限不足' });
    }

    const data = db.readDB();

    const leaderExamIds = data.exams
      .filter(e => e.leaderId === req.user.id)
      .map(e => e.id);

    const results = data.answerRecords
      .filter(r => leaderExamIds.includes(r.examId))
      .map(r => {
        const exam = data.exams.find(e => e.id === r.examId);
        const user = data.users.find(u => u.id === r.userId);
        return {
          ...r,
          examTitle: exam?.title || '未知试卷',
          employeeName: user?.name || '未知',
          username: user?.username || ''
        };
      });

    res.json(results);
  } catch (error) {
    console.error('Get leader results error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/leader/results/:examId', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '权限不足' });
    }

    const data = db.readDB();
    const exam = data.exams.find(e => e.id === req.params.examId);

    if (!exam) {
      return res.status(404).json({ error: '试卷不存在' });
    }

    if (exam.leaderId !== req.user.id) {
      return res.status(403).json({ error: '无权查看此试卷成绩' });
    }

    const results = data.answerRecords
      .filter(r => r.examId === req.params.examId)
      .map(r => {
        const user = data.users.find(u => u.id === r.userId);
        return {
          ...r,
          employeeName: user?.name || '未知',
          username: user?.username || ''
        };
      })
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

    res.json({
      exam: {
        ...exam,
        questions: exam.questions || [],
        questionTypes: exam.questionTypes || {}
      },
      results
    });
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.put('/:recordId/score', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ error: '权限不足' });
    }

    const { scores } = req.body;
    const data = db.readDB();

    const recordIndex = data.answerRecords.findIndex(r => r.id === req.params.recordId);

    if (recordIndex === -1) {
      return res.status(404).json({ error: '答题记录不存在' });
    }

    const record = data.answerRecords[recordIndex];
    const exam = data.exams.find(e => e.id === record.examId);

    if (!exam || exam.leaderId !== req.user.id) {
      return res.status(403).json({ error: '无权评分' });
    }

    let totalScore = 0;

    for (const ans of record.answers) {
      if (scores[ans.questionId] !== undefined) {
        ans.score = scores[ans.questionId];
        totalScore += ans.score;
      }
    }

    data.answerRecords[recordIndex].answers = record.answers;
    data.answerRecords[recordIndex].totalScore = totalScore;

    db.writeDB(data);

    res.json({ message: '评分成功', totalScore });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
