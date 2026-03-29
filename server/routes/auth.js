import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();
const JWT_SECRET = 'training_quiz_secret_key_2024';

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const data = db.readDB();
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/register', (req, res) => {
  try {
    const { username, password, name } = req.body;
    const data = db.readDB();

    const existingUser = data.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    data.users.push({
      id,
      username,
      password: hashedPassword,
      role: 'employee',
      name,
      createdAt: new Date().toISOString()
    });

    db.writeDB(data);

    res.json({ message: '注册成功' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未登录' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const data = db.readDB();
    const user = data.users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(401).json({ error: '无效的token' });
  }
});

export default router;
