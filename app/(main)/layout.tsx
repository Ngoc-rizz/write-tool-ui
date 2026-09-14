export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      {/* Sidebar + Navbar layout for authenticated pages */}
      <aside className="main-sidebar">{/* Sidebar component */}</aside>
      <div className="main-content">
        <header className="main-navbar">{/* Navbar component */}</header>
        <main className="main-body">{children}</main>
      </div>
    </div>
  );
}
