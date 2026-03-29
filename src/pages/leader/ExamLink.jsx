import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';

const token = localStorage.getItem('token');
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

export default function ExamLink() {
  const { id } = useParams();
  const [linkData, setLinkData] = useState(null);
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateLink();
  }, [id]);

  const generateLink = async () => {
    setGenerating(true);
    try {
      const res = await api.get(`/exams/${id}/link`);
      setLinkData(res.data);
      const url = res.data.link;
      const qr = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: { dark: '#3D4852', light: '#FFFFFF' }
      });
      setQrcodeUrl(qr);
    } catch (err) {
      console.error('Failed to generate link:', err);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (linkData?.link) {
      navigator.clipboard.writeText(linkData.link);
      alert('链接已复制到剪贴板');
    }
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
            <Link to="/leader/exam/list" style={styles.navLink}>试卷列表</Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card} className="animate-fade-in">
          <h2 style={styles.cardTitle}>分享试卷</h2>
          <p style={styles.cardDesc}>通过链接或二维码分享给员工</p>

          <div style={styles.content}>
            <div style={styles.qrcodeSection}>
              {qrcodeUrl ? (
                <img src={qrcodeUrl} alt="二维码" style={styles.qrcode} />
              ) : (
                <div style={styles.qrcodePlaceholder}>
                  {generating ? '生成中...' : '点击按钮重新生成'}
                </div>
              )}
              <button onClick={generateLink} disabled={generating} style={styles.regenerateBtn}>
                {generating ? '生成中...' : '重新生成'}
              </button>
            </div>

            <div style={styles.linkSection}>
              <label style={styles.label}>考试链接</label>
              <div style={styles.linkBox}>
                <input type="text" value={linkData?.link || ''} readOnly style={styles.linkInput} />
                <button onClick={copyLink} style={styles.copyBtn}>复制</button>
              </div>

              <div style={styles.tip}>
                <span style={styles.tipIcon}>i</span>
                <span>员工扫码或点击链接后，需登录账号才能答题</span>
              </div>
            </div>
          </div>
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
  nav: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '44px 36px' },
  card: { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '44px', boxShadow: '0 4px 20px var(--shadow)', border: '1px solid var(--border)' },
  cardTitle: { fontSize: '26px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' },
  cardDesc: { fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '36px' },
  content: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '44px', alignItems: 'start' },
  qrcodeSection: { textAlign: 'center' },
  qrcode: { width: '200px', height: '200px', marginBottom: '24px', borderRadius: '16px', boxShadow: '0 4px 20px var(--shadow)' },
  qrcodePlaceholder: { width: '200px', height: '200px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', borderRadius: '16px', fontSize: '18px', color: 'var(--text-secondary)' },
  regenerateBtn: { padding: '14px 24px', backgroundColor: '#FFFFFF', color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  linkSection: { paddingTop: '14px' },
  label: { display: 'block', fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '16px' },
  linkBox: { display: 'flex', gap: '12px', marginBottom: '24px' },
  linkInput: { flex: 1, padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '18px', outline: 'none', fontFamily: 'inherit', backgroundColor: 'var(--background)' },
  copyBtn: { padding: '16px 24px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
  tip: { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', backgroundColor: 'rgba(107, 158, 140, 0.1)', borderRadius: '12px', fontSize: '18px', color: 'var(--primary)' },
  tipIcon: { fontSize: '18px', fontStyle: 'italic' }
};
