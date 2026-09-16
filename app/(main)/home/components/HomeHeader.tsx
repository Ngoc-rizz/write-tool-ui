import styles from './HomeHeader.module.css';

export default function HomeHeader({ user }: any) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTitles}>
        <h1 className={styles.title}>Không gian viết</h1>
        <p className={styles.subtitle}>Nơi những ý tưởng được viết thành lời</p>
      </div>
      <div className={styles.headerActions}>
        {user?.permissions?.includes('all') && (
          <button className={styles.primaryBtn}>
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
