import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { Authorization: `Bearer ${token}` }
});

export default function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error('Failed to fetch exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('确定要删除这份试卷吗？')) return;
    try {
      await api.delete(`/exams/${id}`);
      setExams(exams.filter(exam => exam.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || '删除失败');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return { bg: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', text: '已发放' };
    }
    return { bg: 'rgba(196, 167, 125, 0.1)', color: 'var(--secondary)', text: '草稿' };
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
      </div>
    );
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
            <Link to="/leader/exam/create" style={styles.createLink}>+ 创建试卷</Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader} className="animate-fade-in">
          <h2 style={styles.pageTitle}>试卷管理</h2>
          <p style={styles.pageDesc}>管理您创建的所有试卷</p>
        </div>

        {exams.length === 0 ? (
          <div style={styles.emptyState} className="animate-fade-in">
            <div style={styles.emptyIcon}>◇</div>
            <h3 style={styles.emptyTitle}>暂无试卷</h3>
            <p style={styles.emptyText}>点击下方按钮创建您的第一份培训试卷</p>
            <Link to="/leader/exam/create" style={styles.createBtn}>创建试卷</Link>
          </div>
        ) : (
          <div style={styles.examGrid} className="animate-fade-in">
            {exams.map(exam => {
              const statusBadge = getStatusBadge(exam.status);
              const totalScore = (exam.questions || []).reduce((sum, q) => sum + q.score, 0);
              return (
                <div
                  key={exam.id}
                  style={styles.examCard}
                  onClick={() => navigate(`/leader/exam/preview/${exam.id}`)}
                >
                  <div style={styles.examHeader}>
                    <span style={{ ...styles.statusBadge, backgroundColor: statusBadge.bg, color: statusBadge.color }}>
                      {statusBadge.text}
                    </span>
                    <div style={styles.examActions}>
                      {exam.status === 'published' && (
                        <Link to={`/leader/exam/link/${exam.id}`} onClick={(e) => e.stopPropagation()} style={styles.linkBtn}>
                          链接
                        </Link>
                      )}
                      <button onClick={(e) => handleDelete(exam.id, e)} style={styles.deleteBtn}>删除</button>
                    </div>
                  </div>
                  <h3 style={styles.examTitle}>{exam.title}</h3>
                  <div style={styles.examInfo}>
                    <span>{(exam.questions || []).length} 题</span>
                    <span style={styles.scoreText}>{totalScore} 分</span>
                  </div>
                  <div style={styles.examMeta}>
                    <span>创建于 {new Date(exam.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.examFooter}>
                    <button style={styles.previewBtn} onClick={(e) => { e.stopPropagation(); navigate(`/leader/exam/preview/${exam.id}`); }}>
                      查看详情
                    </button>
                    {exam.status === 'published' && (
                      <button style={styles.resultsBtn} onClick={(e) => { e.stopPropagation(); navigate(`/leader/results?examId=${exam.id}`); }}>
                        查看成绩
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '20px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  logoIcon: { fontSize: '26px', color: 'var(--primary)' },
  logoText: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)' },
  nav: { display: 'flex', gap: '28px', alignItems: 'center' },
  navLink: { fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' },
  createLink: { padding: '12px 20px', backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '18px', fontWeight: '500' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '44px 36px' },
  pageHeader: { marginBottom: '36px' },
  pageTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  pageDesc: { fontSize: '18px', color: 'var(--text-secondary)' },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '64px 44px', textAlign: 'center', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  emptyIcon: { fontSize: '52px', color: 'var(--primary)', marginBottom: '20px' },
  emptyTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  emptyText: { fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '28px' },
  createBtn: { display: 'inline-block', padding: '16px 28px', backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '18px' },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '28px' },
  examCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s ease' },
  examHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  statusBadge: { padding: '6px 14px', borderRadius: '24px', fontSize: '16px', fontWeight: '600' },
  examActions: { display: 'flex', gap: '12px' },
  linkBtn: { padding: '8px 16px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: '500' },
  deleteBtn: { padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontSize: '16px', fontFamily: 'inherit' },
  examTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' },
  examInfo: { display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '18px', color: 'var(--text-secondary)' },
  scoreText: { fontWeight: '600', color: 'var(--secondary)' },
  examMeta: { fontSize: '17px', color: 'var(--text-light)', marginBottom: '20px' },
  examFooter: { display: 'flex', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--border)' },
  previewBtn: { flex: 1, padding: '14px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  resultsBtn: { flex: 1, padding: '14px', backgroundColor: 'var(--secondary)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }
};
