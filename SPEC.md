# 职场新人培训答题系统 - 技术规范

## 1. 项目概述

### 项目名称
职场新人培训答题系统 (Training Quiz System)

### 项目类型
前后端分离的 Web 应用

### 核心功能
用于检验职场新人员工培训情况的答题平台，支持领导创建试题、员工参与答题、结果统计与分析。

### 目标用户
- **领导/管理员**: 创建试题、管理试卷、查看员工答题情况
- **员工**: 登录后查看并完成发放的试题

---

## 2. 技术栈

### 前端
- React 18 + Vite
- React Router v6 (路由管理)
- Axios (HTTP 请求)
- CSS Modules / 内联样式 (自定义样式，无 UI 框架)

### 后端
- Node.js + Express
- SQLite (数据库，轻量化)
- 股票 minimax AI API (题目生成)

### API Key
```
sk-cp-sNy6EkGTdMG6uPxGzn4mPBMGFk_1t5P0CB8R1ZOGNRqT-pEeQgcTJK63wyERuqXaajeOLo_rRg0YGxrF_Be71wXs781-Z--_nNSwAER1I1QR_4nTZj0FuBY
```

---

## 3. 数据模型

### 用户 (User)
```javascript
{
  id: string,           // UUID
  username: string,     // 用户名
  password: string,     // 密码 (MD5 加密)
  role: 'leader' | 'employee',  // 角色
  name: string,         // 姓名
  createdAt: datetime  // 创建时间
}
```

### 试卷 (Exam)
```javascript
{
  id: string,           // UUID
  title: string,        // 试卷标题
  leaderId: string,     // 创建者ID
  courseOutline: string, // 课程纲要
  questionTypes: {
    single: number,     // 单选题数量
    multiple: number,    // 多选题数量
    fill: number,       // 填空题数量
    essay: number       // 简答题数量
  },
  status: 'draft' | 'published' | 'completed', // 状态
  questions: Question[], // 题目数组
  createdAt: datetime,
  publishedAt: datetime | null
}
```

### 题目 (Question)
```javascript
{
  id: string,
  type: 'single' | 'multiple' | 'fill' | 'essay',
  content: string,       // 题干
  options: string[] | null,  // 选项 (单选/多选)
  answer: string | string[] | null,  // 答案
  explanation: string | null,  // 解析
  score: number          // 分值
}
```

### 答题记录 (AnswerRecord)
```javascript
{
  id: string,
  examId: string,
  userId: string,
  answers: {
    questionId: string,
    answer: string | string[],
    score: number | null  // 得分
  }[],
  totalScore: number | null,
  submittedAt: datetime
}
```

---

## 4. 模拟账号

### 领导账号
- 用户名: `leader`
- 密码: `leader123`
- 姓名: `张领导`

### 员工账号
- 用户名: `employee`
- 密码: `employee123`
- 姓名: `李员工`

---

## 5. 页面结构

### 未登录页面
1. **首页** (`/`) - 系统介绍、登录入口
2. **登录页** (`/login`) - 登录表单
3. **注册页** (`/register`) - 注册表单 (员工可注册)

### 领导端页面
1. **领导首页** (`/leader/dashboard`) - 欢迎页、快捷操作
2. **创建试卷页** (`/leader/exam/create`) - 输入课程纲要、选择题型
3. **试卷预览页** (`/leader/exam/preview/:id`) - 预览生成的试卷
4. **试卷列表页** (`/leader/exam/list`) - 管理已有试卷
5. **员工成绩页** (`/leader/results`) - 查看员工答题情况
6. **链接管理页** (`/leader/exam/link/:id`) - 生成考试链接和二维码

### 员工端页面
1. **员工首页** (`/employee/dashboard`) - 欢迎页
2. **我的试题页** (`/employee/exams`) - 未完成试题列表
3. **答题页** (`/employee/exam/:id`) - 答题界面

---

## 6. 功能流程

### 领导创建试卷流程
1. 领导登录 → 进入创建试卷页
2. 输入课程名称、课程纲要
3. 选择题型及数量 (单选/多选/填空/简答)
4. 点击"AI 生成"按钮 → 调用 AI API 生成题目
5. 预览生成的试卷 → 可手动编辑个别题目
6. 满意后点击"发放" → 试题推送到所有员工

### 员工答题流程
1. 员工登录 → 查看未答试题
2. 点击试题进入答题页
3. 完成所有题目后提交
4. 单选/多选立即显示得分
5. 填空/简答由领导评分后查看

### 链接分享流程
1. 领导在试卷列表选择"生成链接"
2. 系统生成唯一链接和二维码
3. 员工扫码或点击链接 → 直接进入答题页

---

## 7. API 设计

### 认证相关
- `POST /api/auth/login` - 登录
- `POST /api/auth/register` - 注册
- `GET /api/auth/me` - 获取当前用户信息

### 试卷相关
- `GET /api/exams` - 获取试卷列表
- `GET /api/exams/:id` - 获取试卷详情
- `POST /api/exams` - 创建试卷
- `PUT /api/exams/:id` - 更新试卷
- `DELETE /api/exams/:id` - 删除试卷
- `POST /api/exams/:id/publish` - 发放试卷
- `POST /api/exams/generate` - AI 生成题目

### 答题相关
- `GET /api/employee/exams` - 获取员工待答试题
- `POST /api/exams/:id/submit` - 提交答案
- `GET /api/leader/results` - 获取所有员工成绩
- `GET /api/leader/results/:examId` - 获取某试卷的员工成绩

### 工具
- `POST /api/utils/qrcode` - 生成二维码

---

## 8. AI 题目生成

### Prompt 设计
根据课程纲要生成符合指定数量和题型的题目，返回 JSON 格式。

### 请求格式
```json
{
  "courseName": "课程名称",
  "outline": "课程纲要内容",
  "questionTypes": {
    "single": 5,
    "multiple": 3,
    "fill": 2,
    "essay": 2
  }
}
```

### 返回格式
```json
{
  "questions": [
    {
      "type": "single",
      "content": "题目内容",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": "A",
      "explanation": "答案解析",
      "score": 5
    }
  ]
}
```

---

## 9. 视觉设计

### 色彩方案
- 主色: `#4A90A4` (柔和蓝绿)
- 辅助色: `#7FB069` (清新绿)
- 强调色: `#E8A87C` (温暖橙)
- 背景色: `#FAFBFC` (浅灰白)
- 卡片背景: `#FFFFFF`
- 文字主色: `#2C3E50`
- 文字辅色: `#7F8C8D`
- 边框色: `#E8ECF0`

### 字体
- 主字体: `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
- 标题字重: 600
- 正文字重: 400

### 布局
- 容器最大宽度: 1200px
- 卡片圆角: 12px
- 卡片阴影: `0 2px 12px rgba(0,0,0,0.08)`
- 按钮圆角: 8px

### 动画
- 按钮点击: scale(0.95) + 轻微阴影变化
- 页面切换: opacity 渐入
- 卡片悬停: translateY(-2px) + 阴影增强
- 加载状态: 优雅的旋转加载圈

---

## 10. 项目结构

```
d:\桌面\考试系统\重置版/
├── server/
│   ├── index.js          # 后端入口
│   ├── database.js       # 数据库初始化
│   ├── routes/
│   │   ├── auth.js       # 认证路由
│   │   ├── exams.js      # 试卷路由
│   │   └── answers.js    # 答题路由
│   └── utils/
│       └── ai.js         # AI API 调用
├── public/
│   └── index.html
├── src/
│   ├── main.jsx          # 前端入口
│   ├── App.jsx           # 根组件
│   ├── pages/            # 页面组件
│   ├── components/       # 公共组件
│   ├── context/          # React Context
│   ├── styles/           # 样式文件
│   └── utils/            # 工具函数
├── package.json
└── vite.config.js
```
