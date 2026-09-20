'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar/Navbar';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

export default function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="main-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="main-body" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="w-full max-w-[95%] md:max-w-[80%]" style={{ padding: '0 var(--space-xl)' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
