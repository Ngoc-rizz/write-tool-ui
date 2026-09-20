import styles from './HomeHeader.module.css';
import Link from 'next/link';
import type { CurrentUser } from '@/stores/auth.types';

interface HomeHeaderProps {
  user: CurrentUser | null;
  onCreateDocument?: () => void;
}

export default function HomeHeader({ user, onCreateDocument }: HomeHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTitles}>
        <h1 className={styles.title}>Không gian viết</h1>
        <p className={styles.subtitle}>Nơi những ý tưởng được viết thành lời</p>
      </div>
      <div className={styles.headerActions}>
        <Link href="/chapter" className={styles.secondaryBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Viết nhanh
        </Link>
        {user?.permissions?.includes('all') && (
          <button className={styles.primaryBtn} onClick={onCreateDocument}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tạo bản thảo mới
          </button>
        )}
      </div>
    </header>
  );
}
