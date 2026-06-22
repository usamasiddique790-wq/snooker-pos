function TableCard({
  tableId,
  table,
  status,
  isRunning,
  onReturn,
  onStart,
  onEnd,
  onAddProduct,
}) {
  return (
    <section className="stage-card">
      <div className="stage-card-top">
        <div>
          <h3>{table.table_name}</h3>
          <p>{isRunning ? "Occupied" : "Ready"}</p>
        </div>

        <span className="pill">{isRunning ? "Live" : "Idle"}</span>
      </div>

      <div className="stage-details">
        <div>
          <strong>Rate</strong>
          <span>Rs {status?.hourly_rate ?? "--"}/hr</span>
        </div>

        <div>
          <strong>Bill</strong>
          <span>Rs {status?.live_amount ?? "0"}</span>
        </div>

        <div>
          <strong>Session</strong>
          <span>{status?.session_id ?? "none"}</span>
        </div>
      </div>

      <div className="stage-actions">
        <button className="small-button secondary" onClick={() => onReturn(tableId)}>
          Return
        </button>

        {isRunning ? (
          <>
            <button className="small-button" onClick={() => onAddProduct(status)}>
              Add Product
            </button>

            <button
              className="small-button danger"
              onClick={() => onEnd(status.session_id)}
            >
              End Game
            </button>
          </>
        ) : (
          <button className="small-button" onClick={() => onStart(tableId)}>
            Start Game
          </button>
        )}
      </div>
    </section>
  );
}

export default TableCard;