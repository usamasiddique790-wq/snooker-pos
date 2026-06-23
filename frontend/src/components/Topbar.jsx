function Topbar({ user, onAdminPanel }) {
  return (
    <header className="topbar">
      <div>
        <h1>🎱 Snooker Tables</h1>
        <p>Manage all snooker tables</p>
      </div>

      <button className="add-table-btn">+ Add Table</button>

      <input className="search-box" placeholder="Search anything..." />

      <div className="admin-profile">
        🔔
        <div className="avatar">👤</div>
        <div>
          <strong>{user?.username}</strong>
          <p>Administrator</p>
        </div>
        <button onClick={onAdminPanel}>Admin Panel</button>
      </div>
    </header>
  );
}

export default Topbar;