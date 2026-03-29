import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    try {
      await register(username, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade-in">
        <div style={styles.header}>
          <Link to="/" style={styles.backHome}>
            <span style={styles.backIcon}>←</span>
            <span>返回首页</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h1 style={styles.title}>注册</h1>

          {error && <div style={styles.error}>{error}</div>}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="用户名"
            required
          />

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
              placeholder="密码"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? '隐藏' : '显示'}
            </button>
          </div>

          <div style={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.passwordInput}
              placeholder="确认密码"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              {showConfirmPassword ? '隐藏' : '显示'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>已有账号？</span>
          <Link to="/login" style={styles.footerLink}>立即登录</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #F8F9FA 0%, #E8ECEF 100%)',
    padding: '24px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 48px rgba(107, 126, 140, 0.12)'
  },
  header: {
    marginBottom: '32px'
  },
  backHome: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none'
  },
  backIcon: {
    fontSize: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    color: '#DC2626',
    fontSize: '0.95rem'
  },
  input: {
    padding: '14px 16px',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit'
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  passwordInput: {
    width: '100%',
    padding: '14px 80px 14px 16px',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit'
  },
  passwordToggle: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: '6px 10px'
  },
  button: {
    padding: '14px',
    backgroundColor: 'var(--primary)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    marginTop: '8px'
  },
  buttonDisabled: {
    backgroundColor: 'var(--primary-light)',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  footerText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)'
  },
  footerLink: {
    fontSize: '0.95rem',
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '500'
  }
};