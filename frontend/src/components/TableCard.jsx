function TableCard({ tableId, table, status, isRunning, onStart, onEnd, onAddProduct }) {
  console.log("TABLE STATUS:", status);
  const getModeLabel = (type) => {
    switch (type) {
      case "one_ball":
        return "1 Ball";
      case "six_ball":
        return "6 Ball";
      case "ten_ball":
        return "10 Ball";
      case "full_frame":
        return "Full Frame";
      default:
        return "Century";
    }
  };

  const getRunningTime = (start) => {
    if (!start) return "00:00:00";

    const diff = Math.floor((new Date() - new Date(start)) / 1000);

    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const getLiveBill = () => {
    if (!status?.start_time) return "0";

    const minutes = (new Date() - new Date(status.start_time)) / (1000 * 60);
    const amount = (minutes / 60) * Number(status?.billing_rate || status?.hourly_rate || 300);

    return amount.toFixed(0);
  };

  return (
    <section className="snooker-table-card">
      <div className="snooker-visual">
        <span className={`table-status-badge ${isRunning ? "session" : "available"}`}>
          {isRunning ? getModeLabel(status?.billing_type) : "Available"}
        </span>

        <div className="real-snooker-table">
          <span className="pocket p1"></span>
          <span className="pocket p2"></span>
          <span className="pocket p3"></span>
          <span className="pocket p4"></span>
          <span className="pocket p5"></span>
          <span className="pocket p6"></span>

          <span className="ball white"></span>
          <span className="ball red b1"></span>
          <span className="ball red b2"></span>
          <span className="ball red b3"></span>
          <span className="ball yellow"></span>
          <span className="ball blue"></span>
          <span className="ball black"></span>
        </div>

        <span className="table-circle">{tableId}</span>
      </div>

      <div className="snooker-table-info">
        <h3>{table.table_name}</h3>

        <p>
          📦 Mode:{" "}
          <strong>
            {isRunning ? getModeLabel(status?.billing_type) : "Ready"}
          </strong>
        </p>

        <p>
          💵 Rate:{" "}
          <strong>
            Rs {isRunning ? status?.billing_rate ?? status?.hourly_rate ?? "300" : status?.hourly_rate ?? "300"}
            {status?.billing_type === "century" || !isRunning ? " / hour" : ""}
          </strong>
        </p>

        <p className={isRunning ? "status-text session" : "status-text available"}>
          ● {isRunning ? getModeLabel(status?.billing_type) : "Available"}
        </p>

        {isRunning && (
          <>
            <p>
              ⏱ Time: <strong>{getRunningTime(status?.start_time)}</strong>
            </p>

            {status?.billing_type === "century" && (
              <p>
                💰 Live Bill: <strong>Rs {getLiveBill()}</strong>
              </p>
            )}
          </>
        )}

        {isRunning ? (
          <div className="compact-actions">
            <button onClick={() => onAddProduct(status)}>+ Product</button>
            <button className="danger" onClick={() => onEnd(status.session_id)}>
              End
            </button>
          </div>
        ) : (
          <button className="start-table-btn" onClick={() => onStart(tableId)}>
            Start Game
          </button>
        )}
      </div>
    </section>
  );
}

export default TableCard;