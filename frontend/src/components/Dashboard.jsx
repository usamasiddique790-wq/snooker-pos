function Dashboard({ dashboard }) {
  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Total Revenue</h3>
        <h2>Rs {dashboard.totalRevenue}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Game Revenue</h3>
        <h2>Rs {dashboard.gameRevenue}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Products Revenue</h3>
        <h2>Rs {dashboard.productsRevenue}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Completed Sessions</h3>
        <h2>{dashboard.completedSessions}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Active Tables</h3>
        <h2>{dashboard.activeTables}</h2>
      </div>

      <div className="dashboard-card full-width">
        <h3>Top Products</h3>
        {dashboard.topProducts?.length ? (
          dashboard.topProducts.map((item, index) => (
            <p key={index}>
              {item.name} — Sold: {item.sold} — Rs {item.revenue}
            </p>
          ))
        ) : (
          <p>No products sold today</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;