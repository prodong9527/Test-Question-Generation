import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LeaderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>退出</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeSection} className="animate-fade-in">
          <div style={styles.welcomeBadge}>管理员</div>
          <h1 style={styles.welcomeTitle}>下午好，{user?.name}</h1>
          <p style={styles.welcomeText}>您可以通过以下功能管理培训考核</p>
        </div>

        <div style={styles.grid}>
          <Link to="/leader/exam/create" style={styles.card} className="animate-fade-in">
            <div style={styles.cardIconWrap}>
              <span style={styles.cardIcon}>◈</span>
            </div>
            <h3 style={styles.cardTitle}>创建试卷</h3>
            <p style={styles.cardDesc}>输入课程纲要，AI智能生成题目</p>
            <div style={styles.cardArrow}>→</div>
          </Link>

          <Link to="/leader/exam/list" style={styles.card} className="animate-fade-in">
            <div style={styles.cardIconWrap}>
              <span style={styles.cardIcon}>◉</span>
            </div>
            <h3 style={styles.cardTitle}>试卷管理</h3>
            <p style={styles.cardDesc}>查看、编辑和删除已创建的试卷</p>
            <div style={styles.cardArrow}>→</div>
          </Link>

          <Link to="/leader/results" style={styles.card} className="animate-fade-in">
            <div style={styles.cardIconWrap}>
              <span style={styles.cardIcon}>◎</span>
            </div>
            <h3 style={styles.cardTitle}>查看成绩</h3>
            <p style={styles.cardDesc}>查看员工的答题情况和得分统计</p>
            <div style={styles.cardArrow}>→</div>
          </Link>
        </div>

        <div style={styles.guideCard} className="animate-fade-in">
          <h3 style={styles.guideTitle}>使用指南</h3>
          <div style={styles.guideList}>
            <div style={styles.guideItem}>
              <span style={styles.guideNumber}>1</span>
              <span>点击「创建试卷」，输入课程名称和课程纲要</span>
            </div>
            <div style={styles.guideItem}>
              <span style={styles.guideNumber}>2</span>
              <span>选择题型数量，点击「AI生成」等待题目生成</span>
            </div>
            <div style={styles.guideItem}>
              <span style={styles.guideNumber}>3</span>
              <span>预览生成的试卷，可手动编辑调整</span>
            </div>
            <div style={styles.guideItem}>
              <span style={styles.guideNumber}>4</span>
              <span>确认无误后点击「发放」，系统将推送给所有员工</span>
            </div>
            <div style={styles.guideItem}>
              <span style={styles.guideNumber}>5</span>
              <span>或在试卷管理中生成链接/二维码分享给员工</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: 'var(--background)' },
  header: { backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '26px', color: 'var(--primary)' },
  logoText: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '1px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' },
  logoutBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' },
  welcomeSection: { marginBottom: '56px' },
  welcomeBadge: { display: 'inline-block', padding: '8px 16px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '24px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' },
  welcomeTitle: { fontSize: '38px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' },
  welcomeText: { fontSize: '18px', color: 'var(--text-secondary)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginBottom: '56px' },
  card: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', textDecoration: 'none', boxShadow: '0 4px 24px var(--shadow)', border: '1px solid var(--border)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' },
  cardIconWrap: { width: '64px', height: '64px', borderRadius: '14px', backgroundColor: 'rgba(107, 158, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  cardIcon: { fontSize: '28px', color: 'var(--primary)' },
  cardTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' },
  cardDesc: { fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' },
  cardArrow: { position: 'absolute', right: '28px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', color: 'var(--text-light)' },
  guideCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px var(--shadow)', border: '1px solid var(--border)' },
  guideTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '28px' },
  guideList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  guideItem: { display: 'flex', alignItems: 'flex-start', gap: '20px', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' },
  guideNumber: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
};
