function Sidebar({ user, onLogout }) {
  return (
    <aside className="app-sidebar">
      <div className="brand">
        <div className="brand-icon">8</div>
        <div>
          <h2>SNOOKER</h2>
          <p>POS SYSTEM</p>
        </div>
      </div>

      <nav className="side-nav">
        <p>MAIN</p>
        <button>⌂ Dashboard</button>
        <button>◴ Sessions</button>
        <button>▣ Invoice History</button>

        <p>MANAGEMENT</p>
        <button className="active">▰ Snooker Tables</button>
        <button>□ Products</button>
        <button>♙ Users</button>

        <p>REPORTS</p>
        <button>▥ Sales Reports</button>

        <p>SYSTEM</p>
        <button>⚙ Settings</button>
        <button onClick={onLogout}>⇱ Logout</button>
      </nav>

      <div className="sidebar-user">
        <strong>🏆 Snooker Club</strong>
        <span>Welcome back, {user?.username}</span>
        <small>● Online</small>
      </div>
    </aside>
  );
}

export default Sidebar;