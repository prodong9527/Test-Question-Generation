import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('token');
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

export default function EmployeeExams() {
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

  if (loading) {
    return <div style={styles.loading}><div style={styles.spinner}></div></div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/employee/dashboard" style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </Link>
          <div style={styles.nav}>
            <Link to="/employee/dashboard" style={styles.navLink}>返回首页</Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader} className="animate-fade-in">
          <h2 style={styles.pageTitle}>我的试题</h2>
          <p style={styles.pageDesc}>以下是你需要完成的培训考核</p>
        </div>

        {exams.length === 0 ? (
          <div style={styles.emptyState} className="animate-fade-in">
            <div style={styles.emptyIcon}>◇</div>
            <h3 style={styles.emptyTitle}>暂无待答试题</h3>
            <p style={styles.emptyText}>当前没有需要完成的培训考核，继续加油！</p>
          </div>
        ) : (
          <div style={styles.examGrid} className="animate-fade-in">
            {exams.map(exam => (
              <div key={exam.id} style={styles.examCard}>
                <div style={styles.examBadge}>
                  <span style={styles.badgeText}>待完成</span>
                </div>
                <h3 style={styles.examTitle}>{exam.title}</h3>
                <div style={styles.examInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>题目数量</span>
                    <span style={styles.infoValue}>{exam.questions?.length || 0} 题</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>总分</span>
                    <span style={styles.infoValue}>{exam.questions?.reduce((sum, q) => sum + (q.score || 0), 0) || 0} 分</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>发放时间</span>
                    <span style={styles.infoValue}>{exam.publishedAt ? new Date(exam.publishedAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                <button style={styles.startBtn} onClick={() => navigate(`/employee/exam/${exam.id}`)}>
                  开始答题
                </button>
              </div>
            ))}
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
  nav: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '44px 36px' },
  pageHeader: { marginBottom: '36px' },
  pageTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  pageDesc: { fontSize: '18px', color: 'var(--text-secondary)' },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '64px 44px', textAlign: 'center', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  emptyIcon: { fontSize: '52px', color: 'var(--primary)', marginBottom: '20px' },
  emptyTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  emptyText: { fontSize: '18px', color: 'var(--text-secondary)' },
  examGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '28px' },
  examCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  examBadge: { marginBottom: '20px' },
  badgeText: { display: 'inline-block', padding: '8px 16px', backgroundColor: 'rgba(196, 167, 125, 0.1)', color: 'var(--secondary)', borderRadius: '24px', fontSize: '17px', fontWeight: '600' },
  examTitle: { fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px' },
  examInfo: { marginBottom: '28px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' },
  infoLabel: { fontSize: '18px', color: 'var(--text-secondary)' },
  infoValue: { fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' },
  startBtn: { width: '100%', padding: '16px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '19px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }
};
