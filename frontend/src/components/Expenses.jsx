function Expenses({
  expenses,
  newExpense,
  setNewExpense,
  createExpense,
  deleteExpense,
  fetchExpenses,
}) {
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="expenses-panel">
      <div className="section-title-row">
        <div>
          <h2>💸 Expenses</h2>
          <p>Daily expenditure management</p>
        </div>

        <button className="add-table-btn" onClick={fetchExpenses}>
          Refresh
        </button>
      </div>

      <form className="product-form-modern" onSubmit={createExpense}>
        <input
          type="text"
          placeholder="Expense Title"
          value={newExpense.title}
          onChange={(e) =>
            setNewExpense({ ...newExpense, title: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Notes"
          value={newExpense.notes}
          onChange={(e) =>
            setNewExpense({ ...newExpense, notes: e.target.value })
          }
        />

        <button type="submit">Save Expense</button>
      </form>

      <div className="dashboard-card">
        <h3>Total Expenses</h3>
        <h2>Rs {totalExpenses}</h2>
      </div>

      <div className="report-table">
        <div className="report-row report-head">
          <span>Title</span>
          <span>Amount</span>
          <span>Notes</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {expenses.map((item) => (
          <div className="report-row" key={item.id}>
            <span>{item.title}</span>
            <span>Rs {item.amount}</span>
            <span>{item.notes || "-"}</span>
            <span>{new Date(item.expense_date).toLocaleDateString()}</span>

            <button
              className="delete-user-btn"
              onClick={() => deleteExpense(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Expenses;