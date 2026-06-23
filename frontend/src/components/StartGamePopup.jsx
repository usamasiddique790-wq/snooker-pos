const billingOptions = [
  { type: "century", label: "Century", price: "Hourly" },
  { type: "one_ball", label: "1 Ball", price: "Fixed" },
  { type: "six_ball", label: "6 Ball", price: "Fixed" },
  { type: "ten_ball", label: "10 Ball", price: "Fixed" },
  { type: "full_frame", label: "Full Frame", price: "Fixed" },
];

function StartGamePopup({ selectedTable, onStart, onClose }) {
  if (!selectedTable) return null;

  return (
    <div className="invoice-overlay">
      <div className="invoice-box start-game-box">
        <div className="invoice-title">
          <h2>Start Game</h2>
          <p>{selectedTable.table_name}</p>
        </div>

        <div className="billing-options">
          {billingOptions.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => onStart(selectedTable.table_id, option.type)}
            >
              <strong>{option.label}</strong>
              <span>{option.price}</span>
            </button>
          ))}
        </div>

        <div className="invoice-actions">
          <button className="close-btn" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartGamePopup;