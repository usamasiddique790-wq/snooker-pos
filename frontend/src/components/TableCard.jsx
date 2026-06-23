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
  const liveMinutes = status?.duration_minutes ?? 0;
  const liveAmount = status?.live_amount ?? "0";

  return (
    <section className="modern-table-card">
      <div className="table-image">
        <span className={`table-badge ${isRunning ? "orange" : "green"}`}>
          {isRunning ? "In Session" : "Available"}
        </span>

        <span className="table-number">{tableId}</span>
      </div>

      <div className="table-card-body">
        <div className="table-title-row">
          <h3>{table.table_name}</h3>

          <span className={isRunning ? "dot orange-dot" : "dot green-dot"}>
            {isRunning ? "Running" : "Available"}
          </span>
        </div>

        <div className="table-meta">
          <p>📦 Rate: <strong>Rs {status?.hourly_rate ?? "--"} / hour</strong></p>
          <p>⏱ {liveMinutes} min running</p>
          <p>💰 Live Bill: <strong>Rs {liveAmount}</strong></p>
          <p>🎫 Session: {status?.session_id ?? "none"}</p>
        </div>

        <div className="table-card-actions">
          <button className="action-btn neutral" onClick={() => onReturn(tableId)}>
            ↩ Return
          </button>

          {isRunning ? (
            <>
              <button className="action-btn blue" onClick={() => onAddProduct(status)}>
                + Product
              </button>

              <button className="action-btn red" onClick={() => onEnd(status.session_id)}>
                End
              </button>
            </>
          ) : (
            <button className="action-btn green" onClick={() => onStart(tableId)}>
              Start
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default TableCard;