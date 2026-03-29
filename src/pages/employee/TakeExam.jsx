import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { Authorization: `Bearer ${token}` }
});

export default function TakeExam() {
  const { id, code } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState({});

  const examId = code || id;

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/exams/${examId}`);
      setExam(res.data);
    } catch (err) {
      console.error('Failed to fetch exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleMultipleAnswer = (questionId, option) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter(a => a !== option) };
      } else {
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleFillAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const unanswered = exam.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!confirm(`还有 ${unanswered.length} 道题未作答，确定要提交吗？`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const res = await api.post(`/answers/${examId}/submit`, {
        answers: formattedAnswers
      });

      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}><div style={styles.spinner}></div></div>;
  }

  if (!exam) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <Link to="/" style={styles.logoArea}>
              <span style={styles.logoIcon}>◇</span>
              <span style={styles.logoText}>培训考核平台</span>
            </Link>
            <div style={styles.nav}>
              <Link to="/" style={styles.navLink}>返回首页</Link>
            </div>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.errorCard}>
            <h2>试卷不存在或已结束</h2>
            <p>请检查链接是否正确，或联系管理员</p>
          </div>
        </main>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.resultCard} className="animate-fade-in">
            <div style={styles.resultIcon}>◇</div>
            <h2 style={styles.resultTitle}>提交成功</h2>

            <div style={styles.resultScore}>
              <span style={styles.scoreLabel}>已评分题目得分</span>
              <span style={styles.scoreValue}>{result.totalScore} 分</span>
            </div>

            {result.hasPendingGrading && (
              <div style={styles.pendingNotice}>
                <span>{result.pendingMessage}</span>
              </div>
            )}

            <div style={styles.resultActions}>
              <button onClick={() => navigate('/employee/exams')} style={styles.backBtn}>
                返回试题列表
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/employee/exams" style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </Link>
          <div style={styles.headerRight}>
            <span style={styles.examTitle}>{exam.title}</span>
            <Link to="/employee/exams" style={styles.navLink}>返回列表</Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.examInfo} className="animate-fade-in">
          <div style={styles.infoItem}>
            <span>共 {exam.questions?.length || 0} 题</span>
          </div>
          <div style={styles.infoItem}>
            <span>满分 {exam.questions?.reduce((s, q) => s + (q.score || 0), 0) || 0} 分</span>
          </div>
        </div>

        <div style={styles.questionList}>
          {exam.questions?.map((q, index) => (
            <div key={q.id} style={styles.questionCard} className="animate-fade-in">
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

              <p style={styles.questionContent}>{q.content}</p>

              {q.type === 'single' && (
                <div style={styles.optionsList}>
                  {q.options?.map((opt, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    return (
                      <label
                        key={optIndex}
                        style={{ ...styles.optionLabel, ...(answers[q.id] === optionLetter ? styles.optionSelected : {}) }}
                        onClick={() => handleSingleAnswer(q.id, optionLetter)}
                      >
                        <span style={styles.optionLetter}>{optionLetter}</span>
                        <span style={styles.optionText}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === 'multiple' && (
                <div style={styles.optionsList}>
                  {q.options?.map((opt, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    const isSelected = (answers[q.id] || []).includes(optionLetter);
                    return (
                      <label
                        key={optIndex}
                        style={{ ...styles.optionLabel, ...(isSelected ? styles.optionSelected : {}) }}
                        onClick={() => handleMultipleAnswer(q.id, optionLetter)}
                      >
                        <span style={styles.optionLetter}>{isSelected ? '■' : '□'}</span>
                        <span style={styles.optionText}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {(q.type === 'fill' || q.type === 'essay') && (
                <div style={styles.textAnswer}>
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => handleFillAnswer(q.id, e.target.value)}
                    style={styles.textarea}
                    placeholder="请输入您的答案..."
                    rows={q.type === 'essay' ? 4 : 2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.submitSection}>
          <button onClick={handleSubmit} disabled={submitting} style={styles.submitBtn}>
            {submitting ? '提交中...' : '提交答案'}
          </button>
        </div>
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
  headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  examTitle: { fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' },
  nav: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '36px 36px' },
  errorCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '64px 44px', textAlign: 'center', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '64px 44px', textAlign: 'center', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  resultIcon: { fontSize: '68px', color: 'var(--primary)', marginBottom: '24px' },
  resultTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '28px' },
  resultScore: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '28px', backgroundColor: 'rgba(107, 158, 140, 0.1)', borderRadius: '16px', marginBottom: '24px' },
  scoreLabel: { fontSize: '18px', color: 'var(--text-secondary)' },
  scoreValue: { fontSize: '40px', fontWeight: '700', color: 'var(--primary)' },
  pendingNotice: { padding: '20px', backgroundColor: 'rgba(196, 167, 125, 0.1)', borderRadius: '12px', color: 'var(--secondary)', fontSize: '18px', marginBottom: '28px' },
  resultActions: { marginTop: '24px' },
  backBtn: { padding: '16px 32px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '19px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  examInfo: { display: 'flex', gap: '28px', marginBottom: '28px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 12px var(--shadow)', fontSize: '18px', color: 'var(--text-primary)', border: '1px solid var(--border)' },
  questionList: { display: 'flex', flexDirection: 'column', gap: '24px' },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  questionInfo: { display: 'flex', gap: '16px', alignItems: 'center' },
  questionNum: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' },
  questionType: { padding: '6px 14px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '16px', fontWeight: '500' },
  questionScore: { fontSize: '18px', fontWeight: '600', color: 'var(--secondary)' },
  questionContent: { fontSize: '19px', color: 'var(--text-primary)', lineHeight: '1.7', marginBottom: '24px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  optionLabel: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: 'var(--background)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease', border: '2px solid transparent' },
  optionSelected: { backgroundColor: 'rgba(107, 158, 140, 0.1)', borderColor: 'var(--primary)' },
  optionLetter: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', fontSize: '17px', fontWeight: '600', color: 'var(--primary)', border: '1px solid var(--border)' },
  optionText: { fontSize: '18px', color: 'var(--text-primary)', flex: 1 },
  textAnswer: { marginTop: '12px' },
  textarea: { width: '100%', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '18px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6' },
  submitSection: { marginTop: '36px', textAlign: 'center' },
  submitBtn: { padding: '18px 52px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }
};
