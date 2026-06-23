function Reports({
  reportFilters,
  setReportFilters,
  salesReport,
  fetchSalesReport,
}) {
  return (
    <div className="reports-panel">
      <form className="report-form" onSubmit={fetchSalesReport}>
        <input
          type="date"
          value={reportFilters.start}
          onChange={(e) =>
            setReportFilters({ ...reportFilters, start: e.target.value })
          }
          required
        />

        <input
          type="date"
          value={reportFilters.end}
          onChange={(e) =>
            setReportFilters({ ...reportFilters, end: e.target.value })
          }
          required
        />

        <button type="submit">Search</button>
      </form>

      {!salesReport ? (
        <p>Select date range and search report.</p>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Revenue</h3>
              <h2>Rs {salesReport.totalRevenue}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Game Revenue</h3>
              <h2>Rs {salesReport.gameRevenue}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Products Revenue</h3>
              <h2>Rs {salesReport.productsRevenue}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Completed Sessions</h3>
              <h2>{salesReport.completedSessions}</h2>
            </div>
          </div>

          <h3>Invoices</h3>

          <div className="report-table">
            <div className="report-row report-head">
              <span>Invoice</span>
              <span>Table</span>
              <span>Duration</span>
              <span>Game</span>
              <span>Products</span>
              <span>Total</span>
            </div>

            {salesReport.invoices?.map((invoice) => (
              <div className="report-row" key={invoice.id}>
                <span>#{invoice.id}</span>
                <span>Table {invoice.table_id}</span>
                <span>{invoice.duration_minutes ?? 0} min</span>
                <span>Rs {invoice.game_amount}</span>
                <span>Rs {invoice.products_amount}</span>
                <span>Rs {invoice.grand_total}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;