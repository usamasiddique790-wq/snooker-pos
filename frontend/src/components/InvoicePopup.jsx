function InvoicePopup({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="invoice-overlay">
      <div className="invoice-box">
        <div className="invoice-title">
          <h2>🎱 Snooker Club</h2>
          <p>Game Invoice / Receipt</p>
        </div>

        <div className="invoice-row">
          <span>Invoice No</span>
          <strong>#{invoice.session.id}</strong>
        </div>

        <div className="invoice-row">
          <span>Table</span>
          <strong>Table {invoice.session.table_id}</strong>
        </div>

        <div className="invoice-row">
          <span>Duration</span>
          <strong>{invoice.session.duration_minutes} min</strong>
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