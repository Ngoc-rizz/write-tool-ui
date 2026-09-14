'use client';

import { useState, useEffect } from 'react';
import AuthCard from '../AuthCard/AuthCard';
import VerifyEmailForm from '../VerifyEmailForm/VerifyEmailForm';
import styles from '../AuthCard/AuthCard.module.css';
import { api } from '@/lib/api-client';

export default function RegisterForm() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClear = () => {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setStep('register');
    };
    window.addEventListener('clear-auth-forms', handleClear);
    return () => window.removeEventListener('clear-auth-forms', handleClear);
  }, []);

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      await api.auth.register({ name, email, password });
      setStep('verify');
    } catch (err: any) {
      setError(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <VerifyEmailForm
        initialEmail={email}
        onBackToRegister={() => setStep('register')}
      />
    );
  }

  return (
    <AuthCard activeTab="register">
      <h1 className={styles.heading}>Đăng ký tài khoản tác giả</h1>
      <p className={styles.subtitle}>
        Tạo không gian viết tinh gọn, đồng bộ và yên tĩnh
      </p>

      {error && (
        <div className={styles.alertBoxError} role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
        {/* Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="register-name">
            Họ và tên tác giả
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="register-name"
              type="text"
              className={styles.inputField}
              placeholder="Nguyễn Minh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoSave="off"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="register-email">
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
              id="register-email"
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

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="register-password">
            Mật khẩu (tối thiểu 6 ký tự)
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className={styles.inputField}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="off"
              autoSave="off"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              id="register-toggle-password"
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

        {/* Confirm Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="register-confirm-password">
            Nhập lại mật khẩu
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="register-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              className={styles.inputField}
              placeholder="Xác nhận lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="off"
              autoSave="off"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              id="register-toggle-confirm"
            >
              {showConfirm ? (
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
          disabled={loading}
          className={styles.submitButton}
          id="register-submit"
        >
          {loading ? 'Đang xử lý đăng ký...' : 'Đăng ký tài khoản'}
        </button>
      </div>
    </AuthCard>
  );
}
