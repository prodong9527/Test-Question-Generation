import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem('token');
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

export default function LeaderResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState(searchParams.get('examId') || '');
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examList, setExamList] = useState([]);

  useEffect(() => { fetchExamList(); }, []);

  useEffect(() => {
    if (selectedExam) fetchExamResults(selectedExam);
    else fetchAllResults();
  }, [selectedExam]);

  const fetchExamList = async () => {
    try {
      const res = await api.get('/exams');
      setExamList(res.data.filter(e => e.status === 'published'));
    } catch (err) { console.error('Failed to fetch exams:', err); }
  };

  const fetchExamResults = async (examId) => {
    setLoading(true);
    try {
      const res = await api.get(`/answers/leader/results/${examId}`);
      setResults(res.data.results);
      setExamDetails(res.data.exam);
    } catch (err) { console.error('Failed to fetch results:', err); }
    finally { setLoading(false); }
  };

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const res = await api.get('/answers/leader/results');
      setResults(res.data);
      setExamDetails(null);
    } catch (err) { console.error('Failed to fetch results:', err); }
    finally { setLoading(false); }
  };

  const getScoreClass = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return { bg: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)' };
    if (percent >= 60) return { bg: 'rgba(196, 167, 125, 0.1)', color: 'var(--secondary)' };
    return { bg: 'rgba(220, 53, 69, 0.1)', color: '#DC3545' };
  };

  if (loading) {
    return <div style={styles.loading}><div style={styles.spinner}></div></div>;
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
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader} className="animate-fade-in">
          <div>
            <h2 style={styles.pageTitle}>员工成绩</h2>
            <p style={styles.pageDesc}>查看员工的答题情况和得分</p>
          </div>
          <div style={styles.filter}>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} style={styles.select}>
              <option value="">全部试卷</option>
              {examList.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
            </select>
          </div>
        </div>

        {examDetails && (
          <div style={styles.examInfo} className="animate-fade-in">
            <div style={styles.examInfoItem}><span style={styles.examInfoLabel}>试卷名称</span><span style={styles.examInfoValue}>{examDetails.title}</span></div>
            <div style={styles.examInfoItem}><span style={styles.examInfoLabel}>题目数量</span><span style={styles.examInfoValue}>{examDetails.questions.length} 题</span></div>
            <div style={styles.examInfoItem}><span style={styles.examInfoLabel}>总分</span><span style={styles.examInfoValue}>{examDetails.questions.reduce((s, q) => s + q.score, 0)} 分</span></div>
            <div style={styles.examInfoItem}><span style={styles.examInfoLabel}>完成人数</span><span style={styles.examInfoValue}>{results.length} 人</span></div>
          </div>
        )}

        {results.length === 0 ? (
          <div style={styles.emptyState} className="animate-fade-in">
            <div style={styles.emptyIcon}>◎</div>
            <h3 style={styles.emptyTitle}>暂无答题记录</h3>
            <p style={styles.emptyText}>{selectedExam ? '该试卷暂无员工完成答题' : '暂无员工完成答题'}</p>
          </div>
        ) : (
          <div style={styles.resultsTable} className="animate-fade-in">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>员工</th>
                  <th style={styles.th}>试卷</th>
                  <th style={styles.th}>得分</th>
                  <th style={styles.th}>提交时间</th>
                </tr>
              </thead>
              <tbody>
                {results.map(record => {
                  const totalScore = examDetails ? examDetails.questions.reduce((s, q) => s + q.score, 0) : 100;
                  const scoreClass = getScoreClass(record.totalScore || 0, totalScore);
                  return (
                    <tr key={record.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userInfo}>
                          <span style={styles.userName}>{record.employeeName}</span>
                          <span style={styles.userName_small}>@{record.username}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{record.examTitle}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.scoreBadge, backgroundColor: scoreClass.bg, color: scoreClass.color }}>
                          {record.totalScore || 0} / {totalScore}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(record.submittedAt).toLocaleString('zh-CN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  pageTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  pageDesc: { fontSize: '18px', color: 'var(--text-secondary)' },
  filter: { marginTop: '12px' },
  select: { padding: '14px 20px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '18px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#FFFFFF', minWidth: '200px' },
  examInfo: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' },
  examInfoItem: { backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  examInfoLabel: { display: 'block', fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '12px' },
  examInfoValue: { fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '64px 44px', textAlign: 'center', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  emptyIcon: { fontSize: '52px', color: 'var(--primary)', marginBottom: '20px' },
  emptyTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  emptyText: { fontSize: '18px', color: 'var(--text-secondary)' },
  resultsTable: { backgroundColor: '#FFFFFF', borderRadius: '20px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '20px 24px', textAlign: 'left', fontSize: '17px', fontWeight: '600', color: 'var(--text-secondary)', backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '20px 24px', fontSize: '18px', color: 'var(--text-primary)' },
  userInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  userName: { fontWeight: '500' },
  userName_small: { fontSize: '16px', color: 'var(--text-light)' },
  scoreBadge: { display: 'inline-block', padding: '8px 16px', borderRadius: '24px', fontSize: '17px', fontWeight: '600' }
};
