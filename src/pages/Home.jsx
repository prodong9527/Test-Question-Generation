import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoArea}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </div>
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
          <div style={styles.heroContent}>
            <div style={styles.badge}>企业培训解决方案</div>
            <h1 style={styles.heroTitle}>
              让培训考核
              <br />
              <span style={styles.heroHighlight}>更高效、更智能</span>
            </h1>
            <p style={styles.heroSubtitle}>
              专注于职场新人培训考核的智能平台，通过AI技术自动生成考核题目，
              帮助企业快速检验培训成果，精准发现优秀人才，提升培训质量。
            </p>
            <div style={styles.heroButtons}>
              <Link to="/login" style={styles.primaryButton}>
                立即开始
              </Link>
              <Link to="/features" style={styles.secondaryButton}>
                了解功能
              </Link>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.visualCard}>
              <div style={styles.visualHeader}>
                <div style={styles.visualDot}></div>
                <div style={styles.visualLine}></div>
              </div>
              <div style={styles.visualBody}>
                <div style={styles.visualItem}>
                  <div style={styles.visualItemIcon}>◈</div>
                  <div style={styles.visualItemText}>
                    <div style={styles.visualItemTitle}>智能出题</div>
                    <div style={styles.visualItemDesc}>AI自动分析课程内容</div>
                  </div>
                </div>
                <div style={styles.visualItem}>
                  <div style={styles.visualItemIcon}>◉</div>
                  <div style={styles.visualItemText}>
                    <div style={styles.visualItemTitle}>在线答题</div>
                    <div style={styles.visualItemDesc}>支持多种题型自动评分</div>
                  </div>
                </div>
                <div style={styles.visualItem}>
                  <div style={styles.visualItemIcon}>◎</div>
                  <div style={styles.visualItemText}>
                    <div style={styles.visualItemTitle}>数据分析</div>
                    <div style={styles.visualItemDesc}>多维度统计培训效果</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.features,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.2s'
        }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>核心能力</h2>
            <p style={styles.sectionSubtitle}>全方位满足企业培训考核需求</p>
          </div>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureNumber}>01</div>
              <h3 style={styles.featureTitle}>AI智能出题</h3>
              <p style={styles.featureDesc}>
                只需输入课程纲要，AI即可自动分析内容并生成单选题、多选题、填空题、简答题等多种题型，省时省力。
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNumber}>02</div>
              <h3 style={styles.featureTitle}>灵活分享</h3>
              <p style={styles.featureDesc}>
                支持生成考试链接和二维码，员工扫码即可参与答题，操作简单便捷，适配多种场景。
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNumber}>03</div>
              <h3 style={styles.featureTitle}>即时评分</h3>
              <p style={styles.featureDesc}>
                单选、多选题提交后立即显示得分，填空题和简答题由管理员评分后员工可查看。
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNumber}>04</div>
              <h3 style={styles.featureTitle}>数据洞察</h3>
              <p style={styles.featureDesc}>
                详细展示每位员工的答题情况，帮助管理者了解培训效果，优化培训方向。
              </p>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.workflow,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.4s'
        }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>工作流程</h2>
            <p style={styles.sectionSubtitle}>简单四步完成培训考核</p>
          </div>
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}>◈</div>
              <h4 style={styles.stepTitle}>创建试卷</h4>
              <p style={styles.stepDesc}>输入课程名称和纲要</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}>◉</div>
              <h4 style={styles.stepTitle}>AI生成</h4>
              <p style={styles.stepDesc}>选择题型自动出题</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}>◎</div>
              <h4 style={styles.stepTitle}>发放考核</h4>
              <p style={styles.stepDesc}>链接或二维码分发</p>
            </div>
            <div style={styles.stepArrow}>→</div>
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}>◇</div>
              <h4 style={styles.stepTitle}>查看结果</h4>
              <p style={styles.stepDesc}>分析成绩数据报表</p>
            </div>
          </div>
        </section>

        <section style={{
          ...styles.cta,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.6s'
        }}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>开始高效培训考核</h2>
            <p style={styles.ctaDesc}>注册账号即可开始使用，全程免费</p>
            <Link to="/register" style={styles.ctaButton}>立即注册</Link>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.logoIcon}>◇</span>
            <span style={styles.logoText}>培训考核平台</span>
          </div>
          <p style={styles.footerText}>让每一次培训都有价值</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  headerContent: { maxWidth: '1200px', margin: '0 auto', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '28px', color: 'var(--primary)' },
  logoText: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '1px' },
  nav: { display: 'flex', gap: '16px' },
  navButton: { padding: '14px 28px', backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'all 0.2s ease' },
  navButtonOutline: { padding: '14px 28px', backgroundColor: 'transparent', color: 'var(--primary)', borderRadius: '10px', textDecoration: 'none', fontWeight: '500', fontSize: '16px', border: '2px solid var(--primary)', transition: 'all 0.2s ease' },
  main: { flex: 1 },
  hero: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', padding: '120px 40px 100px', maxWidth: '1200px', margin: '0 auto', alignItems: 'center', transition: 'all 0.8s ease-out' },
  heroContent: { maxWidth: '560px' },
  badge: { display: 'inline-block', padding: '10px 20px', backgroundColor: 'rgba(107, 158, 140, 0.1)', color: 'var(--primary)', borderRadius: '24px', fontSize: '15px', fontWeight: '500', marginBottom: '28px', letterSpacing: '0.5px' },
  heroTitle: { fontSize: '56px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2', marginBottom: '28px', letterSpacing: '-1px' },
  heroHighlight: { color: 'var(--primary)' },
  heroSubtitle: { fontSize: '20px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' },
  heroButtons: { display: 'flex', gap: '20px' },
  primaryButton: { display: 'inline-block', padding: '18px 42px', backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '18px', transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(107, 158, 140, 0.3)' },
  secondaryButton: { display: 'inline-block', padding: '18px 42px', backgroundColor: 'transparent', color: 'var(--text-primary)', borderRadius: '12px', textDecoration: 'none', fontWeight: '500', fontSize: '18px', border: '1px solid var(--border)', transition: 'all 0.2s ease' },
  heroVisual: { display: 'flex', justifyContent: 'center' },
  visualCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 40px var(--shadow)', border: '1px solid var(--border)', width: '380px' },
  visualHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' },
  visualDot: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' },
  visualLine: { width: '70px', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px' },
  visualBody: { display: 'flex', flexDirection: 'column', gap: '24px' },
  visualItem: { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'var(--background)', borderRadius: '14px' },
  visualItemIcon: { fontSize: '32px', color: 'var(--primary)' },
  visualItemText: { flex: 1 },
  visualItemTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' },
  visualItemDesc: { fontSize: '15px', color: 'var(--text-secondary)' },
  features: { padding: '100px 40px', maxWidth: '1200px', margin: '0 auto', transition: 'all 0.8s ease-out' },
  sectionHeader: { textAlign: 'center', marginBottom: '56px' },
  sectionTitle: { fontSize: '38px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' },
  sectionSubtitle: { fontSize: '18px', color: 'var(--text-secondary)' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' },
  featureCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px 32px', border: '1px solid var(--border)', transition: 'all 0.3s ease' },
  featureNumber: { fontSize: '15px', fontWeight: '600', color: 'var(--primary)', marginBottom: '20px', letterSpacing: '1px' },
  featureTitle: { fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' },
  featureDesc: { fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7' },
  workflow: { padding: '100px 40px', maxWidth: '1200px', margin: '0 auto', transition: 'all 0.8s ease-out' },
  stepsGrid: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px 32px', textAlign: 'center', border: '1px solid var(--border)', width: '200px' },
  stepNumber: { fontSize: '14px', fontWeight: '600', color: 'var(--text-light)', marginBottom: '14px' },
  stepIcon: { fontSize: '38px', color: 'var(--primary)', marginBottom: '14px' },
  stepTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' },
  stepDesc: { fontSize: '15px', color: 'var(--text-secondary)' },
  stepArrow: { fontSize: '28px', color: 'var(--text-light)' },
  cta: { padding: '100px 40px', backgroundColor: 'var(--primary)', marginTop: '60px', transition: 'all 0.8s ease-out' },
  ctaContent: { maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
  ctaTitle: { fontSize: '38px', fontWeight: '600', color: '#FFFFFF', marginBottom: '14px' },
  ctaDesc: { fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '32px' },
  ctaButton: { display: 'inline-block', padding: '18px 46px', backgroundColor: '#FFFFFF', color: 'var(--primary)', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '18px', transition: 'all 0.2s ease' },
  footer: { backgroundColor: 'var(--text-primary)', padding: '48px 40px' },
  footerContent: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '14px' },
  footerText: { fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }
};