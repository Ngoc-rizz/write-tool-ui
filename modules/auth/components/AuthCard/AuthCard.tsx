'use client';

import { useRouter } from 'next/navigation';
import styles from './AuthCard.module.css';

interface AuthCardProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register' | null;
}

export default function AuthCard({
  children,
  activeTab = null,
}: AuthCardProps) {
  const router = useRouter();

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        {activeTab !== null && (
          <div className={styles.tabSwitcher} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => router.push('/login')}
              id="auth-tab-login"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
              onClick={() => router.push('/register')}
              id="auth-tab-register"
            >
              Đăng ký mới
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
