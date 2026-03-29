import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeDashboard() {
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
          <div style={styles.welcomeBadge}>员工</div>
          <h1 style={styles.welcomeTitle}>下午好，{user?.name}</h1>
          <p style={styles.welcomeText}>您可以在此查看和完成培训考核</p>
        </div>

        <div style={styles.grid}>
          <Link to="/employee/exams" style={styles.card} className="animate-fade-in">
            <div style={styles.cardIconWrap}>
              <span style={styles.cardIcon}>◈</span>
            </div>
            <h3 style={styles.cardTitle}>我的试题</h3>
            <p style={styles.cardDesc}>查看并完成待答的培训试题</p>
            <div style={styles.cardArrow}>→</div>
          </Link>
        </div>

        <div style={styles.infoCard} className="animate-fade-in">
          <h3 style={styles.infoTitle}>答题须知</h3>
          <ul style={styles.infoList}>
            <li>点击「我的试题」查看您收到的培训考核</li>
            <li>单选题和多选题提交后立即显示得分</li>
            <li>填空题和简答题由领导评分后可查看</li>
            <li>如有疑问，请联系您的领导</li>
          </ul>
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
  logoText: { fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '1px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' },
  logoutBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' },
  welcomeSection: { marginBottom: '56px' },
  welcomeBadge: { display: 'inline-block', padding: '8px 16px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '24px', fontSize: '0.9rem', fontWeight: '500', marginBottom: '20px' },
  welcomeTitle: { fontSize: '2.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' },
  welcomeText: { fontSize: '1.1rem', color: 'var(--text-secondary)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginBottom: '56px' },
  card: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', textDecoration: 'none', boxShadow: '0 4px 24px var(--shadow)', border: '1px solid var(--border)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' },
  cardIconWrap: { width: '64px', height: '64px', borderRadius: '14px', backgroundColor: 'rgba(107, 158, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  cardIcon: { fontSize: '28px', color: 'var(--primary)' },
  cardTitle: { fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' },
  cardDesc: { fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' },
  cardArrow: { position: 'absolute', right: '28px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', color: 'var(--text-light)' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px var(--shadow)', border: '1px solid var(--border)' },
  infoTitle: { fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' },
  infoList: { fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '24px', listStyleType: 'none' }
};
