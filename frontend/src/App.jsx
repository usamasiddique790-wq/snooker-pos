import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";
const TOTAL_TABLES = 18;
const allTables = Array.from({ length: TOTAL_TABLES }, (_, index) => ({
  table_id: index + 1,
  table_name: `Table ${index + 1}`,
}));


function App() {
  const [tables, setTables] = useState([]);
  const [stageTables, setStageTables] = useState([]);
  const [draggingTable, setDraggingTable] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
const [loginForm, setLoginForm] = useState({
  username: "",
  password: "",
});
  const tableStatusMap = tables.reduce((map, table) => {
    map[table.table_id] = table;
    return map;
  }, {});

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${API}/tables/live`);
      setTables(res.data);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 3000);
    return () => clearInterval(interval);
  }, []);
// LOGIN API(ADMIN)
  const login = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API}/login`, loginForm);
    setUser(res.data.user);
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};
//start game API
  const startGame = async (tableId) => {
  try {
    const res = await axios.post(`${API}/sessions/start`, {
      table_id: tableId,
    });

    console.log("START RESPONSE:", res.data);
    await fetchTables();
  } catch (err) {
    console.log("START ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.error || err.message || "Start game error");
  }
};
  const endGame = async (sessionId) => {
  try {
    const res = await axios.post(`${API}/sessions/end`, {
      session_id: sessionId,
    });

    setInvoice(res.data.session);
    await fetchTables();
  } catch (err) {
    alert(err.response?.data?.error || err.message || "End game error");
  }
};

  const handleDragStart = (tableId) => (event) => {
    event.dataTransfer.setData("text/plain", String(tableId));
    event.dataTransfer.effectAllowed = "move";
    setDraggingTable(tableId);
  };

  const handleDragEnd = () => {
    setDraggingTable(null);
  };

  const handleDropOnStage = (event) => {
    event.preventDefault();
    const tableId = Number(event.dataTransfer.getData("text/plain"));
    if (!tableId) return;
    setStageTables((current) => {
      if (current.includes(tableId)) return current;
      return [...current, tableId];
    });
    setDraggingTable(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleReturnToSidebar = (tableId) => {
    setStageTables((current) => current.filter((id) => id !== tableId));
  };

  const availableTables = allTables.filter(
    (table) => !stageTables.includes(table.table_id),
  );
if (!user) {
  return (
    <div className="login-page">
      <form className="login-box" onSubmit={login}>
        <h1>🎱 Snooker POS</h1>
        <h2>Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
  return (
    <div className="pos-shell">
      <header className="pos-header">
        <div>
          <h1>🎱 Snooker POS</h1>
          <p>Drag a table from the sidebar into the main play area.</p>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="section-header">
            <div>
              <h2>Tables</h2>
              <p>{availableTables.length} available</p>
            </div>
            <span className="badge">18</span>
          </div>

          <div className="table-list">
            {availableTables.map((table) => {
              const status = tableStatusMap[table.table_id];
              const isRunning = status?.table_status?.trim() === "running";
              return (
                <button
                  key={table.table_id}
                  className={`table-button ${isRunning ? "running" : "ready"}`}
                  draggable
                  onDragStart={handleDragStart(table.table_id)}
                  onDragEnd={handleDragEnd}
                  type="button"
                >
                  <div>
                    <strong>{table.table_name}</strong>
                    <p>{isRunning ? "Occupied" : "Available"}</p>
                  </div>
                  <span className="status-pill">
                    {isRunning ? "Live" : "Ready"}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="stage">
          <div className="stage-header">
            <div>
              <h2>Table Layout</h2>
              <p>Drop tables here to arrange them on the main board.</p>
            </div>
          </div>

          <div
            className={`stage-dropzone ${draggingTable ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDropOnStage}
          >
            <div className="drop-label">
              {stageTables.length
                ? "Release to place table in the play area"
                : "Drag a table here from the left sidebar"}
            </div>

            {stageTables.length === 0 ? (
              <div className="empty-stage">
                <span>Empty play area</span>
              </div>
            ) : (
              <div className="stage-grid">
                {stageTables.map((tableId) => {
                  const table = allTables.find((item) => item.table_id === tableId);
                  const status = tableStatusMap[tableId];
                  const isRunning = status?.table_status?.trim() === "running";

                  return (
                    <section key={tableId} className="stage-card">
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
                          <span>
                            Rs {status?.hourly_rate ?? "--"}/hr
                          </span>
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
                        <button
                          className="small-button secondary"
                          type="button"
                          onClick={() => handleReturnToSidebar(tableId)}
                        >
                          Return
                        </button>
                        {isRunning ? (
                          <button
                            className="small-button danger"
                            type="button"
                            onClick={() => endGame(status.session_id)}
                          >
                            End Game
                          </button>
                        ) : (
                          <button
                            className="small-button"
                            type="button"
                            onClick={() => startGame(tableId)}
                          >
                            Start Game
                          </button>
                          
                        )}
{invoice && (
  <div className="invoice-overlay">
    <div className="invoice-box">
      <div className="invoice-title">
        <h2>🎱 Snooker Club</h2>
        <p>Game Invoice / Receipt</p>
      </div>

      <div className="invoice-row">
        <span>Invoice No</span>
        <strong>#{invoice.id}</strong>
      </div>

      <div className="invoice-row">
        <span>Table</span>
        <strong>Table {invoice.table_id}</strong>
      </div>

      <div className="invoice-row">
        <span>Start Time</span>
        <strong>{new Date(invoice.start_time).toLocaleTimeString()}</strong>
      </div>

      <div className="invoice-row">
        <span>End Time</span>
        <strong>{new Date(invoice.end_time).toLocaleTimeString()}</strong>
      </div>

      <div className="invoice-row">
        <span>Duration</span>
        <strong>{invoice.duration_minutes} min</strong>
      </div>

      <div className="invoice-row">
        <span>Status</span>
        <strong>{invoice.status}</strong>
      </div>

      <div className="invoice-total">
        <span>Total</span>
        <span>Rs {invoice.amount}</span>
      </div>

      <div className="invoice-actions">
        <button className="print-btn" onClick={() => window.print()}>
          Print
        </button>

        <button className="close-btn" onClick={() => setInvoice(null)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
