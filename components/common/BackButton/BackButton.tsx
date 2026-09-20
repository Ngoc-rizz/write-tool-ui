'use client';

import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export default function BackButton({
  fallbackHref = '/home',
  label = 'Go back',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    const referrer = document.referrer
    const isSameOrigin = referrer && new URL(referrer).origin === window.location.origin

    if (isSameOrigin && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button onClick={handleBack} className={styles.button}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>{label}</span>
    </button>
  );
}