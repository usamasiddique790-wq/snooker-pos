function Sidebar({ user, onLogout, activePage, setActivePage, openAdminPanel }) {
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

        <button
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          ⌂ Dashboard
        </button>

        <button
          className={activePage === "sessions" ? "active" : ""}
          onClick={() => setActivePage("sessions")}
        >
          ◴ Sessions
        </button>

        <button
          className={activePage === "reports" ? "active" : ""}
          onClick={() => {
            setActivePage("reports");
            openAdminPanel("reports");
          }}
        >
          ▣ Invoice History
        </button>

        <p>MANAGEMENT</p>

        <button
          className={activePage === "tables" ? "active" : ""}
          onClick={() => setActivePage("tables")}
        >
          ▰ Snooker Tables
        </button>

        <button
          className={activePage === "products" ? "active" : ""}
          onClick={() => {
            setActivePage("products");
            openAdminPanel("products");
          }}
        >
          □ Products
        </button>

        <button
          className={activePage === "users" ? "active" : ""}
          onClick={() => {
            setActivePage("users");
            openAdminPanel("users");
          }}
        >
          ♙ Users
        </button>

        <p>REPORTS</p>

        <button
          className={activePage === "sales" ? "active" : ""}
          onClick={() => {
            setActivePage("sales");
            openAdminPanel("reports");
          }}
        >
          ▥ Sales Reports
        </button>

        <p>SYSTEM</p>

        <button onClick={() => alert("Profile feature coming soon")}>
          ♙ Profile
        </button>

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