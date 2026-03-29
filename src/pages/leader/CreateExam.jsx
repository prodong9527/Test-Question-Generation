import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE
});

export default function CreateExam() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [courseName, setCourseName] = useState('');
  const [courseOutline, setCourseOutline] = useState('');
  const [questionTypes, setQuestionTypes] = useState({
    single: { count: 5, score: 5 },
    multiple: { count: 3, score: 10 },
    fill: { count: 2, score: 5 },
    essay: { count: 2, score: 15 }
  });
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState(null);
  const [examId, setExamId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedContent, setExtractedContent] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      setError('请上传 PPT、PDF 或 Word 文档');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/exams/upload', formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
      });

      setUploadedFile(file.name);
      setExtractedContent(res.data.content);

      if (res.data.content) {
        setCourseOutline(prev => prev ? prev + '\n\n--- 文件内容 ---\n' + res.data.content : res.data.content);
      }
    } catch (err) {
      setError(err.response?.data?.error || '文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!courseName.trim()) {
      setError('请输入课程名称');
      return;
    }
    if (!courseOutline.trim() && !extractedContent) {
      setError('请输入课程纲要或上传培训文件');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      const res = await api.post('/exams', {
        title: courseName,
        courseOutline: courseOutline || extractedContent,
        questionTypes
      }, { headers: getAuthHeader() });
      setExamId(res.data.id);

      const genRes = await api.post('/exams/generate', {
        courseName,
        outline: courseOutline || extractedContent,
        questionTypes
      }, { headers: getAuthHeader() });

      setQuestions(genRes.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setError('');
    setGenerating(true);

    try {
      const res = await api.post(`/exams/${examId}/regenerate`, {
        courseName,
        outline: courseOutline || extractedContent,
        questionTypes
      }, { headers: getAuthHeader() });
      setQuestions(res.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || '重新生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/exams/${examId}`, {
        title: courseName,
        courseOutline,
        questionTypes,
        questions
      }, { headers: getAuthHeader() });
      navigate(`/leader/exam/preview/${examId}`);
    } catch (err) {
      setError(err.response?.data?.error || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/leader/dashboard" style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </Link>
          <div style={styles.nav}>
            <Link to="/leader/dashboard" style={styles.navLink}>返回首页</Link>
            <Link to="/leader/exam/list" style={styles.navLink}>试卷列表</Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader} className="animate-fade-in">
          <h2>创建试卷</h2>
          <p>输入课程信息，AI将自动生成考核题目</p>
        </div>

        <div style={styles.content}>
          <div style={styles.formSection} className="animate-fade-in">
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>课程信息</h3>

              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.field}>
                <label style={styles.label}>课程名称</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  style={styles.input}
                  placeholder="例如：职场沟通技巧培训"
                  disabled={!!examId}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>上传培训文件（可选）</label>
                <div style={styles.uploadArea}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".ppt,.pptx,.pdf,.doc,.docx"
                    style={styles.fileInput}
                    disabled={!!examId || uploading}
                  />
                  <div style={styles.uploadContent}>
                    {uploading ? (
                      <span style={styles.uploadText}>正在提取文件内容...</span>
                    ) : uploadedFile ? (
                      <>
                        <span style={styles.uploadIcon}>◈</span>
                        <span style={styles.uploadText}>{uploadedFile}</span>
                        <span style={styles.uploadHint}>点击或拖拽重新上传</span>
                      </>
                    ) : (
                      <>
                        <span style={styles.uploadIcon}>◈</span>
                        <span style={styles.uploadText}>点击上传或拖拽文件到此处</span>
                        <span style={styles.uploadHint}>支持 PPT、PDF、Word 文档</span>
                      </>
                    )}
                  </div>
                </div>
                {extractedContent && (
                  <div style={styles.extractedInfo}>
                    <span>文件内容已提取，共 {extractedContent.length} 字</span>
                  </div>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>课程纲要（可手动编辑或补充）</label>
                <textarea
                  value={courseOutline}
                  onChange={(e) => setCourseOutline(e.target.value)}
                  style={styles.textarea}
                  placeholder="请输入课程的主要内容和要点，AI将根据这些信息生成合适的考核题目..."
                  rows={6}
                  disabled={!!examId}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>题目设置</label>
                <div style={styles.typeGrid}>
                  <div style={styles.typeItem}>
                    <span style={styles.typeLabel}>单选题</span>
                    <div style={styles.typeControl}>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, single: {...questionTypes.single, count: Math.max(0, questionTypes.single.count - 1)}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >-</button>
                      <span style={styles.typeValue}>{questionTypes.single.count}</span>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, single: {...questionTypes.single, count: questionTypes.single.count + 1}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >+</button>
                    </div>
                    <div style={styles.scoreControl}>
                      <span style={styles.scoreLabel}>分值</span>
                      <input
                        type="number"
                        value={questionTypes.single.score}
                        onChange={(e) => setQuestionTypes({...questionTypes, single: {...questionTypes.single, score: Math.max(1, parseInt(e.target.value) || 1)}})}
                        style={styles.scoreInput}
                        disabled={!!examId}
                      />
                    </div>
                  </div>

                  <div style={styles.typeItem}>
                    <span style={styles.typeLabel}>多选题</span>
                    <div style={styles.typeControl}>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, multiple: {...questionTypes.multiple, count: Math.max(0, questionTypes.multiple.count - 1)}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >-</button>
                      <span style={styles.typeValue}>{questionTypes.multiple.count}</span>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, multiple: {...questionTypes.multiple, count: questionTypes.multiple.count + 1}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >+</button>
                    </div>
                    <div style={styles.scoreControl}>
                      <span style={styles.scoreLabel}>分值</span>
                      <input
                        type="number"
                        value={questionTypes.multiple.score}
                        onChange={(e) => setQuestionTypes({...questionTypes, multiple: {...questionTypes.multiple, score: Math.max(1, parseInt(e.target.value) || 1)}})}
                        style={styles.scoreInput}
                        disabled={!!examId}
                      />
                    </div>
                  </div>

                  <div style={styles.typeItem}>
                    <span style={styles.typeLabel}>填空题</span>
                    <div style={styles.typeControl}>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, fill: {...questionTypes.fill, count: Math.max(0, questionTypes.fill.count - 1)}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >-</button>
                      <span style={styles.typeValue}>{questionTypes.fill.count}</span>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, fill: {...questionTypes.fill, count: questionTypes.fill.count + 1}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >+</button>
                    </div>
                    <div style={styles.scoreControl}>
                      <span style={styles.scoreLabel}>分值</span>
                      <input
                        type="number"
                        value={questionTypes.fill.score}
                        onChange={(e) => setQuestionTypes({...questionTypes, fill: {...questionTypes.fill, score: Math.max(1, parseInt(e.target.value) || 1)}})}
                        style={styles.scoreInput}
                        disabled={!!examId}
                      />
                    </div>
                  </div>

                  <div style={styles.typeItem}>
                    <span style={styles.typeLabel}>简答题</span>
                    <div style={styles.typeControl}>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, essay: {...questionTypes.essay, count: Math.max(0, questionTypes.essay.count - 1)}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >-</button>
                      <span style={styles.typeValue}>{questionTypes.essay.count}</span>
                      <button
                        onClick={() => setQuestionTypes({...questionTypes, essay: {...questionTypes.essay, count: questionTypes.essay.count + 1}})}
                        style={styles.typeBtn}
                        disabled={!!examId}
                      >+</button>
                    </div>
                    <div style={styles.scoreControl}>
                      <span style={styles.scoreLabel}>分值</span>
                      <input
                        type="number"
                        value={questionTypes.essay.score}
                        onChange={(e) => setQuestionTypes({...questionTypes, essay: {...questionTypes.essay, score: Math.max(1, parseInt(e.target.value) || 1)}})}
                        style={styles.scoreInput}
                        disabled={!!examId}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                {!examId ? (
                  <button
                    onClick={handleGenerate}
                    disabled={generating || uploading}
                    style={styles.primaryBtn}
                  >
                    {generating ? '生成中...' : 'AI 生成题目'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegenerate}
                    disabled={generating}
                    style={styles.secondaryBtn}
                  >
                    {generating ? '重新生成中...' : '重新生成'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {questions && (
            <div style={styles.previewSection} className="animate-fade-in">
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>题目预览</h3>

                <div style={styles.questionList}>
                  {questions.map((q, index) => (
                    <div key={index} style={styles.questionItem}>
                      <div style={styles.questionHeader}>
                        <span style={styles.questionType}>
                          {q.type === 'single' && '单选'}
                          {q.type === 'multiple' && '多选'}
                          {q.type === 'fill' && '填空'}
                          {q.type === 'essay' && '简答'}
                        </span>
                        <span style={styles.questionScore}>本题 {q.score} 分</span>
                      </div>

                      <input
                        type="text"
                        value={q.content}
                        onChange={(e) => handleUpdateQuestion(index, 'content', e.target.value)}
                        style={styles.questionInput}
                      />

                      {(q.type === 'single' || q.type === 'multiple') && q.options && (
                        <div style={styles.optionsList}>
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} style={styles.optionItem}>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...q.options];
                                  newOpts[optIndex] = e.target.value;
                                  handleUpdateQuestion(index, 'options', newOpts);
                                }}
                                style={styles.optionInput}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {(q.type === 'fill' || q.type === 'essay') && (
                        <div style={styles.answerPreview}>
                          <label style={styles.answerLabel}>参考答案：</label>
                          <input
                            type="text"
                            value={q.answer || ''}
                            onChange={(e) => handleUpdateQuestion(index, 'answer', e.target.value)}
                            style={styles.answerInput}
                          />
                        </div>
                      )}

                      {q.type === 'multiple' && (
                        <div style={styles.answerPreview}>
                          <label style={styles.answerLabel}>正确答案（多选）：</label>
                          <input
                            type="text"
                            value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                            onChange={(e) => handleUpdateQuestion(index, 'answer', e.target.value.split(',').map(s => s.trim().toUpperCase()))}
                            style={styles.answerInput}
                            placeholder="如: A, C"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={styles.previewActions}>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    style={styles.primaryBtn}
                  >
                    {loading ? '保存中...' : '保存并预览'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background)'
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 36px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  logoIcon: {
    fontSize: '26px',
    color: 'var(--primary)'
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  nav: {
    display: 'flex',
    gap: '28px'
  },
  navLink: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: '500'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '44px 36px'
  },
  pageHeader: {
    marginBottom: '36px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: questions => questions ? '1fr' : '1fr',
    gap: '28px'
  },
  formSection: {
    width: '100%'
  },
  previewSection: {
    width: '100%'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px var(--shadow)',
    border: '1px solid var(--border)'
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '28px'
  },
  error: {
    padding: '16px 20px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    color: '#DC2626',
    fontSize: '18px',
    marginBottom: '20px'
  },
  field: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    fontSize: '18px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  uploadArea: {
    position: 'relative',
    border: '2px dashed var(--border)',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  uploadIcon: {
    fontSize: '32px',
    color: 'var(--primary)'
  },
  uploadText: {
    fontSize: '16px',
    color: 'var(--text-primary)'
  },
  uploadHint: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  extractedInfo: {
    marginTop: '12px',
    padding: '10px 16px',
    backgroundColor: 'rgba(107, 158, 140, 0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--primary)'
  },
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    fontSize: '18px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  typeItem: {
    backgroundColor: 'var(--background)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center'
  },
  typeLabel: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    marginBottom: '16px'
  },
  typeControl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px'
  },
  typeBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  typeValue: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--primary)',
    minWidth: '28px'
  },
  scoreControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px'
  },
  scoreLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  scoreInput: {
    width: '50px',
    padding: '4px 8px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    outline: 'none',
    fontFamily: 'inherit'
  },
  actions: {
    marginTop: '28px'
  },
  primaryBtn: {
    padding: '16px 32px',
    backgroundColor: 'var(--primary)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '19px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  secondaryBtn: {
    padding: '16px 32px',
    backgroundColor: '#FFFFFF',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
    borderRadius: '12px',
    fontSize: '19px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  questionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  questionItem: {
    padding: '24px',
    backgroundColor: 'var(--background)',
    borderRadius: '16px',
    border: '1px solid var(--border)'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  questionType: {
    padding: '6px 14px',
    backgroundColor: 'var(--primary)',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500'
  },
  questionScore: {
    fontSize: '17px',
    color: 'var(--text-secondary)'
  },
  questionInput: {
    width: '100%',
    padding: '14px 18px',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '18px',
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: '16px'
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center'
  },
  optionInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '18px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  answerPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  answerLabel: {
    fontSize: '17px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap'
  },
  answerInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '18px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  previewActions: {
    marginTop: '28px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
};