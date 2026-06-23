import { useState } from "react";

function Reports({
  reportFilters,
  setReportFilters,
  salesReport,
  fetchSalesReport,
  openInvoiceDetail,
}) {
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [dailyExpense, setDailyExpense] = useState("");

   const isSingleDayReport =
    salesReport?.start &&
    salesReport?.end &&
    salesReport.start === salesReport.end;

  const searchInvoice = () => {
    if (!invoiceSearch.trim()) return;

    const cleanInvoiceId = invoiceSearch
      .trim()
      .toUpperCase()
      .replace("SNK-", "")
      .replace(/^0+/, "");

    openInvoiceDetail(cleanInvoiceId);
  };

  const totalSale = Number(salesReport?.totalRevenue || 0);
  const totalCredit = Number(salesReport?.totalCredit || 0);
  const expenseAmount = isSingleDayReport ? Number(dailyExpense || 0) : 0;
  const cashInHand = totalSale - totalCredit - expenseAmount;

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

        <button type="submit">Search Report</button>

        <input
          type="text"
          placeholder="Search Bill SNK-00049"
          value={invoiceSearch}
          onChange={(e) => setInvoiceSearch(e.target.value)}
        />

        <button type="button" onClick={searchInvoice}>
          Search Bill
        </button>

        {salesReport && isSingleDayReport && (
  <input
    type="number"
    placeholder="Daily Expenditure"
    value={dailyExpense}
    onChange={(e) => setDailyExpense(e.target.value)}
  />
)}
        {salesReport && (
          <button
            className="print-btn sales-print-main-btn"
            type="button"
            onClick={() => window.print()}
          >
            Print Sales Bill
          </button>
        )}
      </form>

      {!salesReport ? (
        <p>Select date range and search report.</p>
      ) : (
        <>
          <div className="sales-bill print-only">
            <div className="invoice-title">
              <h2>🎱 Snooker Club</h2>
              <p>Daily Sales Receipt</p>
            </div>

            <div className="invoice-row">
              <span>From</span>
              <strong>{salesReport.start}</strong>
            </div>

            <div className="invoice-row">
              <span>To</span>
              <strong>{salesReport.end}</strong>
            </div>

            <hr />

            <div className="invoice-row">
              <span>Total Sale</span>
              <strong>Rs {totalSale}</strong>
            </div>

            <div className="invoice-row">
              <span>Total Credit / Udhar</span>
              <strong>Rs {totalCredit}</strong>
            </div>

            <div className="invoice-row">
              <span>Total Expenditure</span>
              <strong>Rs {expenseAmount}</strong>
            </div>

            <div className="invoice-total">
              <span>Cash In Hand</span>
              <span>Rs {cashInHand}</span>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Revenue</h3>
              <h2>Rs {salesReport.totalRevenue}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Total Credit / Udhar</h3>
              <h2>Rs {totalCredit}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Daily Expenditure</h3>
              <h2>Rs {expenseAmount}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Cash In Hand</h3>
              <h2>Rs {cashInHand}</h2>
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
              <span>Action</span>
            </div>

            {salesReport.invoices?.map((invoice) => (
              <div className="report-row" key={invoice.id}>
                <span>SNK-{String(invoice.id).padStart(5, "0")}</span>
                <span>Table {invoice.table_id}</span>
                <span>{invoice.duration_minutes ?? 0} min</span>
                <span>Rs {invoice.game_amount}</span>
                <span>Rs {invoice.products_amount}</span>
                <span>Rs {invoice.grand_total}</span>

                <button
                  className="edit-user-btn"
                  onClick={() => openInvoiceDetail(invoice.id)}
                >
                  View / Print
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;