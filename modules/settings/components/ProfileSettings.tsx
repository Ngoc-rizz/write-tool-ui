'use client'
import React, { useState, useEffect } from 'react';
import styles from './ProfileSettings.module.css';
import { useAuth } from '@/stores/AuthProvider';

export default function ProfileSettings() {
  const { user, isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to update profile API
    alert('Profile changes saved!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className={styles.title}>Author profile</h2>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Display name</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled // Often emails are disabled from direct edit
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
