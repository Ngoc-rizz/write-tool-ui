'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '../AuthCard/AuthCard';
import styles from '../AuthCard/AuthCard.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call forgot password API
    console.log('Forgot password:', { email });
  };

  return (
    <AuthCard activeTab={null} >
      <h1 className={styles.heading}>Forgot password</h1>
      <p className={styles.subtitle}>
        Receive an OTP by email to restore access
      </p>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <div className={styles.infoBoxTitle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          Restore access
        </div>
        <p className={styles.infoBoxDescription}>
          The system will send a six-digit verification code to your email
          to set a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="forgot-email">
            Enter your registered email
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </span>
            <input
              id="forgot-email"
              type="email"
              className={styles.inputField}
              placeholder="minh.nguyen@vanban.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton} id="forgot-submit">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send OTP
          </span>
        </button>
      </form>

      <Link href="/login" className={styles.bottomLink} id="forgot-back-to-login">
        Go back to the login screen
      </Link>
    </AuthCard>
  );
}
