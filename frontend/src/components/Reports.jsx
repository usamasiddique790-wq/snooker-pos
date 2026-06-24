import { useState } from "react";
import {
  getMonthlyReportApi,
  getYearlyReportApi,
} from "../api/reportApi";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Reports({
  reportFilters,
  setReportFilters,
  salesReport,
  fetchSalesReport,
  openInvoiceDetail,
}) {
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [dailyExpense, setDailyExpense] = useState("");
  const [reportMode, setReportMode] = useState("daily");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [yearlyReport, setYearlyReport] = useState(null);

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

  const fetchMonthlyReport = async () => {
    const res = await getMonthlyReportApi(month, year);
    setMonthlyReport(res.data);
  };

  const fetchYearlyReport = async () => {
    const res = await getYearlyReportApi(year);
    setYearlyReport(res.data);
  };

  const totalSale = Number(salesReport?.totalRevenue || 0);
  const totalCredit = Number(salesReport?.totalCredit || 0);
  const totalCreditPayments = Number(salesReport?.totalCreditPayments || 0);
  const expenseAmount = isSingleDayReport ? Number(dailyExpense || 0) : 0;

  const cashInHand =
    totalSale - totalCredit + totalCreditPayments - expenseAmount;

  return (
    <div className="reports-panel">
      <div className="admin-tabs">
        <button
          type="button"
          className={reportMode === "daily" ? "active-tab" : ""}
          onClick={() => setReportMode("daily")}
        >
          Daily / Date Range
        </button>

        <button
          type="button"
          className={reportMode === "monthly" ? "active-tab" : ""}
          onClick={() => setReportMode("monthly")}
        >
          Monthly
        </button>

        <button
          type="button"
          className={reportMode === "yearly" ? "active-tab" : ""}
          onClick={() => setReportMode("yearly")}
        >
          Yearly
        </button>
      </div>

      {reportMode === "daily" && (
        <>
          <form className="report-form" onSubmit={fetchSalesReport}>
            <input
              type="date"
              value={reportFilters.start}
              onChange={(e) =>
                setReportFilters({
                  ...reportFilters,
                  start: e.target.value,
                })
              }
              required
            />

            <input
              type="date"
              value={reportFilters.end}
              onChange={(e) =>
                setReportFilters({
                  ...reportFilters,
                  end: e.target.value,
                })
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
                  <span>New Udhar</span>
                  <strong>Rs {totalCredit}</strong>
                </div>

                <div className="invoice-row">
                  <span>Udhar Received</span>
                  <strong>Rs {totalCreditPayments}</strong>
                </div>

                <div className="invoice-row">
                  <span>Daily Expenditure</span>
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
                  <h3>New Udhar</h3>
                  <h2>Rs {totalCredit}</h2>
                </div>

                <div className="dashboard-card">
                  <h3>Udhar Received</h3>
                  <h2>Rs {totalCreditPayments}</h2>
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
        </>
      )}

      {reportMode === "monthly" && (
        <>
          <form className="report-form" onSubmit={(e) => e.preventDefault()}>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <button type="button" onClick={fetchMonthlyReport}>
              Search Monthly
            </button>
          </form>

          {monthlyReport && (
            
            <div className="dashboard-grid">
              <div className="sales-bill print-only monthly-print-bill">
  <div className="invoice-title">
    <h2>🎱 Snooker Club</h2>
    <p>Monthly Sales Receipt</p>
  </div>

  <div className="invoice-row">
    <span>Month</span>
    <strong>{monthNames[Number(monthlyReport.month) - 1]}</strong>
  </div>

  <div className="invoice-row">
    <span>Year</span>
    <strong>{monthlyReport.year}</strong>
  </div>

  <hr />

  <div className="invoice-row">
    <span>Total Sale</span>
    <strong>Rs {monthlyReport.totalRevenue}</strong>
  </div>

  <div className="invoice-row">
    <span>Credit Received</span>
    <strong>Rs {monthlyReport.creditReceived}</strong>
  </div>

  <div className="invoice-row">
    <span>Monthly Expenses</span>
    <strong>Rs {monthlyReport.totalExpenses}</strong>
  </div>

  <div className="invoice-total">
    <span>Net Cash</span>
    <span>Rs {monthlyReport.netCash}</span>
  </div>
</div>

<button
  className="print-btn sales-print-main-btn"
  type="button"
  onClick={() => window.print()}
>
  Print Monthly Bill
</button>
              <div className="dashboard-card">
                <h3>Total Sale</h3>
                <h2>Rs {monthlyReport.totalRevenue}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Credit Given</h3>
                <h2>Rs {monthlyReport.creditGiven}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Credit Received</h3>
                <h2>Rs {monthlyReport.creditReceived}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Monthly Expenses</h3>
                <h2>Rs {monthlyReport.totalExpenses}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Net Cash</h3>
                <h2>Rs {monthlyReport.netCash}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Sessions</h3>
                <h2>{monthlyReport.completedSessions}</h2>
              </div>
            </div>
          )}
        </>
      )}

      {reportMode === "yearly" && (
        <>
          <form className="report-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <button type="button" onClick={fetchYearlyReport}>
              Search Yearly
            </button>
          </form>

          {yearlyReport && (
            <>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>Year Sale</h3>
                  <h2>Rs {yearlyReport.totals.totalRevenue}</h2>
                </div>

                <div className="dashboard-card">
                  <h3>Credit Received</h3>
                  <h2>Rs {yearlyReport.totals.creditReceived}</h2>
                </div>

                <div className="dashboard-card">
                  <h3>Year Expenses</h3>
                  <h2>Rs {yearlyReport.totals.totalExpenses}</h2>
                </div>

                <div className="dashboard-card">
                  <h3>Net Cash</h3>
                  <h2>Rs {yearlyReport.totals.netCash}</h2>
                </div>
              </div>

              <div className="report-table">
                <div className="report-row report-head">
                  <span>Month</span>
                  <span>Sale</span>
                  <span>Credit Received</span>
                  <span>Expenses</span>
                  <span>Net Cash</span>
                  <span>Sessions</span>
                </div>

                {yearlyReport.months.map((item) => (
                  <div className="report-row" key={item.month}>
                    <span>{monthNames[item.month - 1]}</span>
                    <span>Rs {item.totalRevenue}</span>
                    <span>Rs {item.creditReceived}</span>
                    <span>Rs {item.totalExpenses}</span>
                    <span>Rs {item.netCash}</span>
                    <span>{item.completedSessions}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;