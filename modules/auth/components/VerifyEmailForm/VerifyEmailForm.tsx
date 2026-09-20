'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '../AuthCard/AuthCard';
import styles from '../AuthCard/AuthCard.module.css';
import { api } from '@/lib/api-client';

interface VerifyEmailFormProps {
  initialEmail?: string;
  onBackToRegister?: () => void;
}

export default function VerifyEmailForm({ initialEmail, onBackToRegister }: VerifyEmailFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  const email = initialEmail || emailFromUrl;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Resend countdown logic
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first box on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    // Auto move focus to next input if digit entered
    if (digit && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });
    setOtp(newOtp);
    setError(null);

    // Focus last pasted or next empty input
    const nextFocusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6) {
      setError('Please enter all six digits of the verification code');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.auth.verifyEmail({ email, token });
      setSuccess('Email verified successfully! Redirecting to the login page...');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'The verification code is invalid or has expired.');
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    if (!email) {
      setError('Please enter the email address to resend the verification code.');
      return;
    }
    setResendLoading(true);
    setError(null);
    try {
      const res = await api.auth.resendVerification({ email });
      setSuccess(res?.message || 'A new verification code has been sent to your email!');
      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || 'Unable to resend the verification code. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.join('').length === 6;

  return (
    <AuthCard activeTab={null}>
      <h1 className={styles.heading}>Confirm token</h1>
      <p className={styles.subtitle}>
        Enter the six-digit verification code sent to your email
      </p>

      {email && (
        <div className={styles.emailBadgeWrapper}>
          <span className={styles.emailBadge}>
            <svg className={styles.emailBadgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            {email}
          </span>
        </div>
      )}

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

      {success && (
        <div className={styles.alertBoxSuccess} role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className={`${styles.otpInput} ${digit ? styles.otpInputFilled : ''}`}
              aria-label={`Code digit ${idx + 1}`}
              id={`otp-input-${idx}`}
              autoComplete="off"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isOtpComplete || loading}
          className={styles.submitButton}
          id="verify-token-submit"
          style={{ opacity: (!isOtpComplete || loading) ? 0.7 : 1 }}
        >
          {loading ? 'Verifying...' : 'Confirm token'}
        </button>
      </form>

      <div className={styles.resendSection}>
        <div>Didn’t receive the code?</div>
        <button
          type="button"
          onClick={handleResendToken}
          disabled={resendCooldown > 0 || resendLoading}
          className={styles.resendBtn}
          id="resend-token-btn"
        >
          {resendLoading
            ? 'Resending...'
            : resendCooldown > 0
            ? `Resend verification code (${resendCooldown}s)`
            : 'Resend verification code'}
        </button>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        {onBackToRegister ? (
          <button
            type="button"
            onClick={onBackToRegister}
            className={styles.bottomLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            ← Back to sign-up
          </button>
        ) : (
          <Link href="/login" className={styles.bottomLink} id="verify-back-to-login">
            Go back Log in
          </Link>
        )}
      </div>
    </AuthCard>
  );
}
