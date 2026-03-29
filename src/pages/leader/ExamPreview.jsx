import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('token');
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

export default function ExamPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/exams/${id}`);
      setExam(res.data);
    } catch (err) {
      console.error('Failed to fetch exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.post(`/exams/${id}/publish`);
      setPublishSuccess(true);
      setTimeout(() => {
        navigate('/leader/exam/list');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.error || '发放失败');
    } finally {
      setPublishing(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...exam.questions];
    updated[index][field] = value;
    setExam({ ...exam, questions: updated });
  };

  const handleSave = async () => {
    try {
      await api.put(`/exams/${id}`, {
        title: exam.title,
        courseOutline: exam.courseOutline,
        questionTypes: exam.questionTypes,
        questions: exam.questions
      });
      alert('保存成功');
    } catch (err) {
      alert(err.response?.data?.error || '保存失败');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!exam) {
    return <div style={styles.container}>试卷不存在</div>;
  }

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
          <div>
            <h2 style={styles.pageTitle}>{exam.title}</h2>
            <p style={styles.pageInfo}>
              共 {exam.questions.length} 题 · 满分 {exam.questions.reduce((sum, q) => sum + q.score, 0)} 分
            </p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={handleSave} style={styles.saveBtn}>保存修改</button>
            {exam.status === 'draft' && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={styles.publishBtn}
              >
                {publishing ? '发放中...' : '发放试卷'}
              </button>
            )}
            {exam.status === 'published' && (
              <span style={styles.publishedBadge}>已发放</span>
            )}
          </div>
        </div>

        {publishSuccess && (
          <div style={styles.successToast}>试卷发放成功！</div>
        )}

        <div style={styles.examContent} className="animate-fade-in">
          {exam.questions.map((q, index) => (
            <div key={q.id || index} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <div style={styles.questionInfo}>
                  <span style={styles.questionNum}>第 {index + 1} 题</span>
                  <span style={styles.questionType}>
                    {q.type === 'single' && '单选题'}
                    {q.type === 'multiple' && '多选题'}
                    {q.type === 'fill' && '填空题'}
                    {q.type === 'essay' && '简答题'}
                  </span>
                </div>
                <span style={styles.questionScore}>{q.score} 分</span>
              </div>

              <input
                type="text"
                value={q.content}
                onChange={(e) => handleQuestionChange(index, 'content', e.target.value)}
                style={styles.contentInput}
              />

              {(q.type === 'single' || q.type === 'multiple') && q.options && (
                <div style={styles.optionsList}>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} style={styles.optionItem}>
                      <span style={styles.optionLabel}>
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[optIndex] = e.target.value;
                          handleQuestionChange(index, 'options', newOpts);
                        }}
                        style={styles.optionInput}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.answerSection}>
                <label style={styles.answerLabel}>正确答案：</label>
                {q.type === 'single' && (
                  <input
                    type="text"
                    value={q.answer || ''}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value.toUpperCase())}
                    style={styles.answerInput}
                    placeholder="如: A"
                  />
                )}
                {q.type === 'multiple' && (
                  <input
                    type="text"
                    value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer || ''}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value.split(',').map(s => s.trim().toUpperCase()))}
                    style={styles.answerInput}
                    placeholder="如: A, C"
                  />
                )}
                {(q.type === 'fill' || q.type === 'essay') && (
                  <input
                    type="text"
                    value={q.answer || ''}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    style={styles.answerInput}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {exam.status === 'draft' && (
          <div style={styles.bottomActions}>
            <button onClick={handlePublish} disabled={publishing} style={styles.publishBtnLarge}>
              {publishing ? '发放中...' : '确认并发放试卷'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: 'var(--background)' },
  loading: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  spinner: { width: '44px', height: '44px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  header: { backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  headerContent: { maxWidth: '900px', margin: '0 auto', padding: '20px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  logoIcon: { fontSize: '26px', color: 'var(--primary)' },
  logoText: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)' },
  nav: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '44px 36px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' },
  pageTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  pageInfo: { fontSize: '18px', color: 'var(--text-secondary)' },
  headerActions: { display: 'flex', gap: '16px', alignItems: 'center' },
  saveBtn: { padding: '14px 24px', backgroundColor: '#FFFFFF', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: '12px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  publishBtn: { padding: '14px 24px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  publishedBadge: { padding: '14px 24px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '18px', fontWeight: '600' },
  successToast: { padding: '20px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '12px', textAlign: 'center', marginBottom: '28px', fontWeight: '500' },
  examContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  questionInfo: { display: 'flex', gap: '16px', alignItems: 'center' },
  questionNum: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
  questionType: { padding: '6px 14px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '16px', fontWeight: '500' },
  questionScore: { fontSize: '18px', fontWeight: '600', color: 'var(--secondary)' },
  contentInput: { width: '100%', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '19px', outline: 'none', fontFamily: 'inherit', marginBottom: '20px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' },
  optionItem: { display: 'flex', alignItems: 'center', gap: '16px' },
  optionLabel: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', width: '28px' },
  optionInput: { flex: 1, padding: '14px 18px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '18px', outline: 'none', fontFamily: 'inherit' },
  answerSection: { display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--border)' },
  answerLabel: { fontSize: '18px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' },
  answerInput: { flex: 1, padding: '14px 18px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '18px', outline: 'none', fontFamily: 'inherit' },
  bottomActions: { marginTop: '44px', textAlign: 'center' },
  publishBtnLarge: { padding: '18px 44px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }
};
