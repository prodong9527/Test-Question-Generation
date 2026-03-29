import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Features() {
  const [visible, setVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </Link>
          <nav style={styles.nav}>
            <Link to="/login" style={styles.navButton}>登录</Link>
            <Link to="/register" style={styles.navButtonOutline}>注册</Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <section style={{
          ...styles.hero,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)'
        }}>
          <h1 style={styles.heroTitle}>让培训考核</h1>
          <h1 style={styles.heroTitleAccent}>更高效、更智能</h1>
          <p style={styles.heroSubtitle}>AI驱动的新一代培训考核平台</p>
        </section>

        <section style={{
          ...styles.features,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.2s'
        }}>
          <div style={styles.featureCards}>
            <div style={{
              ...styles.featureCard,
              ...(activeFeature === 0 ? styles.featureCardActive : {})
            }}
              onMouseEnter={() => setActiveFeature(0)}
            >
              <div style={styles.featureIcon}>◈</div>
              <h3 style={styles.featureTitle}>AI出题</h3>
              <p style={styles.featureDesc}>输入课程名称和纲要，选择题型数量，AI自动生成单选题、多选题、填空题、简答题等多种题型</p>
              <div style={styles.featureTags}>
                <span style={styles.featureTag}>智能分析</span>
                <span style={styles.featureTag}>多种题型</span>
              </div>
            </div>

            <div style={{
              ...styles.featureCard,
              ...(activeFeature === 1 ? styles.featureCardActive : {})
            }}
              onMouseEnter={() => setActiveFeature(1)}
            >
              <div style={styles.featureIcon}>◉</div>
              <h3 style={styles.featureTitle}>便捷分享</h3>
              <p style={styles.featureDesc}>支持生成考试链接和二维码，员工扫码即可参与答题，适配多种场景</p>
              <div style={styles.featureTags}>
                <span style={styles.featureTag}>链接分发</span>
                <span style={styles.featureTag}>二维码</span>
              </div>
            </div>

            <div style={{
              ...styles.featureCard,
              ...(activeFeature === 2 ? styles.featureCardActive : {})
            }}
              onMouseEnter={() => setActiveFeature(2)}
            >
              <div style={styles.featureIcon}>◎</div>
              <h3 style={styles.featureTitle}>即时反馈</h3>
              <p style={styles.featureDesc}>单选、多选题提交后立即显示得分，填空题和简答题由管理员评分后查看</p>
              <div style={styles.featureTags}>
                <span style={styles.featureTag}>自动评分</span>
                <span style={styles.featureTag}>实时更新</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.roles,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.4s'
        }}>
          <h2 style={styles.rolesTitle}>角色功能</h2>
          <div style={styles.roleGrid}>
            <div style={styles.roleCard}>
              <div style={styles.roleHeader}>
                <div style={styles.roleIcon}>◈</div>
                <h3 style={styles.roleName}>领导端</h3>
              </div>
              <ul style={styles.roleList}>
                <li>创建试卷 - 输入课程信息，AI生成题目</li>
                <li>预览编辑 - 调整题目内容和答案</li>
                <li>发放考核 - 一键分发试卷给员工</li>
                <li>链接分享 - 生成链接和二维码</li>
                <li>成绩查看 - 分析员工答题数据</li>
              </ul>
            </div>
            <div style={styles.roleCard}>
              <div style={styles.roleHeader}>
                <div style={styles.roleIcon}>◉</div>
                <h3 style={styles.roleName}>员工端</h3>
              </div>
              <ul style={styles.roleList}>
                <li>查看试题 - 查看待完成的考核内容</li>
                <li>扫码答题 - 扫描二维码进入答题</li>
                <li>即时得分 - 单选多选立即显示</li>
                <li>成绩查看 - 查看完整评分结果</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.flow,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.6s'
        }}>
          <h2 style={styles.flowTitle}>工作流程</h2>
          <div style={styles.flowSteps}>
            <div style={styles.flowItem}>
              <div style={styles.flowNum}>1</div>
              <div style={styles.flowText}>注册账号</div>
            </div>
            <div style={styles.flowLine}></div>
            <div style={styles.flowItem}>
              <div style={styles.flowNum}>2</div>
              <div style={styles.flowText}>创建试卷</div>
            </div>
            <div style={styles.flowLine}></div>
            <div style={styles.flowItem}>
              <div style={styles.flowNum}>3</div>
              <div style={styles.flowText}>分发考核</div>
            </div>
            <div style={styles.flowLine}></div>
            <div style={styles.flowItem}>
              <div style={styles.flowNum}>4</div>
              <div style={styles.flowText}>查看结果</div>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.cta,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.8s'
        }}>
          <h2 style={styles.ctaTitle}>开始使用</h2>
          <p style={styles.ctaDesc}>注册账号，立即体验智能培训考核</p>
          <Link to="/register" style={styles.ctaButton}>立即注册</Link>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>让每一次培训都有价值</p>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' },
  header: { backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  logoIcon: { fontSize: '28px', color: 'var(--primary)' },
  logoText: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)' },
  nav: { display: 'flex', gap: '16px' },
  navButton: { padding: '14px 28px', backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'all 0.2s ease' },
  navButtonOutline: { padding: '14px 28px', backgroundColor: 'transparent', color: 'var(--primary)', borderRadius: '10px', textDecoration: 'none', fontWeight: '500', fontSize: '16px', border: '2px solid var(--primary)', transition: 'all 0.2s ease' },
  main: { flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 40px' },
  hero: {
    textAlign: 'center',
    padding: '100px 0 80px',
    transition: 'all 0.8s ease-out'
  },
  heroTitle: { fontSize: '52px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2', marginBottom: '8px' },
  heroTitleAccent: { fontSize: '52px', fontWeight: '700', color: 'var(--primary)', lineHeight: '1.2', marginBottom: '20px' },
  heroSubtitle: { fontSize: '20px', color: 'var(--text-secondary)', letterSpacing: '2px' },
  features: { padding: '40px 0 60px', transition: 'all 0.8s ease-out' },
  featureCards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px 32px',
    border: '1px solid var(--border)',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    opacity: 0.7,
    transform: 'scale(0.98)'
  },
  featureCardActive: {
    opacity: 1,
    transform: 'scale(1)',
    borderColor: 'var(--primary)',
    boxShadow: '0 8px 32px rgba(107, 158, 140, 0.2)'
  },
  featureIcon: { fontSize: '40px', color: 'var(--primary)', marginBottom: '20px' },
  featureTitle: { fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  featureDesc: { fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' },
  featureTags: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  featureTag: { padding: '6px 14px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '14px', fontWeight: '500' },
  roles: { padding: '60px 0', transition: 'all 0.8s ease-out' },
  rolesTitle: { fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '40px' },
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' },
  roleCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid var(--border)' },
  roleHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  roleIcon: { fontSize: '32px', color: 'var(--primary)' },
  roleName: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)' },
  roleList: { listStyle: 'none', padding: 0, margin: 0 },
  roleList_li: { fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '2.2', paddingLeft: '20px', position: 'relative' },
  flow: { padding: '60px 0 80px', textAlign: 'center', transition: 'all 0.8s ease-out' },
  flowTitle: { fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '48px' },
  flowSteps: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  flowItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  flowNum: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  flowText: { fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' },
  flowLine: { width: '80px', height: '2px', backgroundColor: 'var(--border)', margin: '0 20px', marginBottom: '30px' },
  cta: { textAlign: 'center', padding: '80px 0', backgroundColor: 'var(--primary)', borderRadius: '24px', marginBottom: '60px', transition: 'all 0.8s ease-out' },
  ctaTitle: { fontSize: '32px', fontWeight: '600', color: '#FFFFFF', marginBottom: '12px' },
  ctaDesc: { fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '28px' },
  ctaButton: { display: 'inline-block', padding: '16px 40px', backgroundColor: '#FFFFFF', color: 'var(--primary)', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '17px', transition: 'all 0.2s ease' },
  footer: { padding: '40px', textAlign: 'center' },
  footerText: { fontSize: '15px', color: 'var(--text-secondary)' }
};