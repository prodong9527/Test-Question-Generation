import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data.json');

const defaultData = {
  users: [],
  exams: [],
  answerRecords: [],
  examLinks: []
};

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(defaultData);
      return defaultData;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Read DB error:', error);
    return defaultData;
  }
}

function writeDB(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Write DB error:', error);
  }
}

function initUsers() {
  const db = readDB();

  const existingLeader = db.users.find(u => u.username === 'admin');
  if (!existingLeader) {
    const leaderId = uuidv4();
    const hashedLeaderPassword = bcrypt.hashSync('admin123', 10);
    db.users.push({
      id: leaderId,
      username: 'admin',
      password: hashedLeaderPassword,
      role: 'leader',
      name: '管理员',
      createdAt: new Date().toISOString()
    });
    console.log('领导账号已创建: admin / admin123');
  }

  const existingEmployee = db.users.find(u => u.username === 'user');
  if (!existingEmployee) {
    const employeeId = uuidv4();
    const hashedEmployeePassword = bcrypt.hashSync('user123', 10);
    db.users.push({
      id: employeeId,
      username: 'user',
      password: hashedEmployeePassword,
      role: 'employee',
      name: '用户',
      createdAt: new Date().toISOString()
    });
    console.log('员工账号已创建: user / user123');
  }

  writeDB(db);
}

initUsers();

export default { readDB, writeDB };
