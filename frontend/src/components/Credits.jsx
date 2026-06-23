import { useState } from "react";

function Credits({ credits, fetchCredits, addCreditPayment, deleteCredit }) {
  const [search, setSearch] = useState("");
  const [paymentMap, setPaymentMap] = useState({});

  const filteredCredits = credits.filter((item) =>
    item.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="credits-panel">
      <div className="section-title-row">
        <div>
          <h2>💳 Udhar / Credits</h2>
          <p>All customers with pending credit</p>
        </div>

        <button className="add-table-btn" onClick={fetchCredits}>
          Refresh
        </button>
      </div>

      <div className="report-form">
        <input
          type="text"
          placeholder="Search customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="report-table">
        <div className="report-row report-head">
          <span>Name</span>
          <span>Total Udhar</span>
          <span>Payment</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        {filteredCredits.map((item) => (
          <div className="report-row credit-row" key={item.id}>
            <span>{item.customer_name}</span>
            <span>Rs {item.total_amount}</span>

            <input
              type="number"
              placeholder="Amount paid"
              value={paymentMap[item.id] || ""}
              onChange={(e) =>
                setPaymentMap({
                  ...paymentMap,
                  [item.id]: e.target.value,
                })
              }
            />

            <span>{new Date(item.updated_at).toLocaleDateString()}</span>

            <div className="credit-actions">
              <button
                className="edit-user-btn"
                onClick={() => {
                  const amount = paymentMap[item.id];

                  if (!amount) {
                    alert("Payment amount enter karo");
                    return;
                  }

                  addCreditPayment(item.id, amount);

                  setPaymentMap({
                    ...paymentMap,
                    [item.id]: "",
                  });
                }}
              >
                Partial Pay
              </button>

              <button
                className="delete-user-btn"
                onClick={() => deleteCredit(item.id)}
              >
                Complete Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;