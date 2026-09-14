'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '../AuthCard/AuthCard';
import styles from '../AuthCard/AuthCard.module.css';
import { login } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClear = () => {
      setEmail('');
      setPassword('');
      setError('');
      setIsUnverified(false);
    };
    window.addEventListener('clear-auth-forms', handleClear);
    return () => window.removeEventListener('clear-auth-forms', handleClear);
  }, []);

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;

    setError('');
    setIsUnverified(false);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/home');
    } catch (err: any) {
      const msg = err.message || 'Đăng nhập thất bại';
      if (msg.includes('EMAIL_NOT_VERIFIED') || msg.toLowerCase().includes('chưa được xác thực')) {
        setIsUnverified(true);
        setError('Tài khoản của bạn chưa được xác thực email.');
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <AuthCard activeTab="login">
      <h1 className={styles.heading}>Đăng nhập tài khoản</h1>

      {error && (
        <div className={styles.alertBoxError} role="alert" style={{ marginBottom: '16px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <div>{error}</div>
            {isUnverified && (
              <div style={{ marginTop: '8px' }}>
                <Link
                  href={`/verify-email?email=${encodeURIComponent(email)}`}
                  className={styles.resendBtn}
                  style={{ fontSize: '13px', textDecoration: 'underline' }}
                >
                  Nhập mã xác nhận / Gửi lại mã →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-email">
            Địa chỉ Email
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </span>
            <input
              id="login-email"
              type="email"
              className={styles.inputField}
              placeholder="minh.nguyen@vanban.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-password">
            <span>Mật khẩu</span>
            <Link href="/forgot-password" className={styles.fieldLabelLink}>
              Quên mật khẩu?
            </Link>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={styles.inputField}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="off"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              id="login-toggle-password"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className={styles.submitButton}
          id="login-submit"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </div>
    </AuthCard>
  );
}