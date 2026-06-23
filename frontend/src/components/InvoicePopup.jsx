import { useState } from "react";

function InvoicePopup({ invoice, onClose, onSaveCredit }) {
  const [creditForm, setCreditForm] = useState({
    customer_name: "",
    amount: "",
  });

  if (!invoice) return null;

  const invoiceNo = `SNK-${String(invoice.session.id).padStart(5, "0")}`;

  const saveCredit = async () => {
    if (!creditForm.customer_name || !creditForm.amount) {
      alert("Customer name aur udhar amount required hai");
      return;
    }

    await onSaveCredit({
      customer_name: creditForm.customer_name,
      amount: Number(creditForm.amount),
      invoice_id: invoice.session.id,
      notes: `Udhar from ${invoiceNo}`,
    });

    setCreditForm({
      customer_name: "",
      amount: "",
    });
  };

  return (
    <div className="invoice-overlay">
      <div className="invoice-box">
        <div className="invoice-title">
          <h2>🎱 Snooker Club</h2>
          <p>Game Invoice / Receipt</p>
        </div>

        <div className="invoice-row">
          <span>Invoice No</span>
          <strong>{invoiceNo}</strong>
        </div>

        <div className="invoice-row">
          <span>Table</span>
          <strong>Table {invoice.session.table_id}</strong>
        </div>

        <div className="invoice-row">
          <span>Game Type</span>
          <strong>{invoice.session.billing_type || "century"}</strong>
        </div>

        <div className="invoice-row">
          <span>Duration</span>
          <strong>{invoice.session.duration_minutes ?? 0} min</strong>
        </div>

        <div className="invoice-row">
          <span>Game Charges</span>
          <strong>Rs {invoice.game_total}</strong>
        </div>

        {invoice.products?.length > 0 && (
          <>
            <hr />
            <h3 style={{ textAlign: "center" }}>Products</h3>

            {invoice.products.map((item, index) => (
              <div className="invoice-row" key={index}>
                <span>{item.name} x {item.quantity}</span>
                <strong>Rs {item.total}</strong>
              </div>
            ))}

            <div className="invoice-row">
              <span>Products Total</span>
              <strong>Rs {invoice.products_total}</strong>
            </div>
          </>
        )}

        <hr />

        <div className="invoice-total">
          <span>Grand Total</span>
          <span>Rs {invoice.grand_total}</span>
        </div>

        <div className="credit-box">
          <h3>Udhar / Credit</h3>

          <input
            type="text"
            placeholder="Customer Name"
            value={creditForm.customer_name}
            onChange={(e) =>
              setCreditForm({
                ...creditForm,
                customer_name: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Udhar Amount"
            value={creditForm.amount}
            onChange={(e) =>
              setCreditForm({
                ...creditForm,
                amount: e.target.value,
              })
            }
          />

          <button type="button" className="credit-save-btn" onClick={saveCredit}>
            Save Udhar
          </button>
        </div>

        <div className="invoice-actions">
          <button className="print-btn" onClick={() => window.print()}>
            Print
          </button>

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePopup;