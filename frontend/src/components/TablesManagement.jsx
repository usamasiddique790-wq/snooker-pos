function TablesManagement({
  tables,
  editingTable,
  setEditingTable,
  editTableForm,
  setEditTableForm,
  updateTableRates,
}) {
  const startEditTable = (table) => {
    setEditingTable(table);

    setEditTableForm({
      table_name: table.table_name || "",
      hourly_rate: table.hourly_rate || 300,
      one_ball_rate: table.one_ball_rate || 50,
      six_ball_rate: table.six_ball_rate || 100,
      ten_ball_rate: table.ten_ball_rate || 150,
      full_frame_rate: table.full_frame_rate || 200,
    });
  };

  return (
    <div className="tables-admin-panel">
      {editingTable && (
        <form className="product-form-modern" onSubmit={updateTableRates}>
          <input
            type="text"
            placeholder="Table Name"
            value={editTableForm.table_name}
            onChange={(e) =>
              setEditTableForm({ ...editTableForm, table_name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Century Rate"
            value={editTableForm.hourly_rate}
            onChange={(e) =>
              setEditTableForm({ ...editTableForm, hourly_rate: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="1 Ball Rate"
            value={editTableForm.one_ball_rate}
            onChange={(e) =>
              setEditTableForm({
                ...editTableForm,
                one_ball_rate: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="6 Ball Rate"
            value={editTableForm.six_ball_rate}
            onChange={(e) =>
              setEditTableForm({
                ...editTableForm,
                six_ball_rate: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="10 Ball Rate"
            value={editTableForm.ten_ball_rate}
            onChange={(e) =>
              setEditTableForm({
                ...editTableForm,
                ten_ball_rate: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Full Frame Rate"
            value={editTableForm.full_frame_rate}
            onChange={(e) =>
              setEditTableForm({
                ...editTableForm,
                full_frame_rate: e.target.value,
              })
            }
          />

          <button type="submit">Save Rates</button>

          <button type="button" onClick={() => setEditingTable(null)}>
            Cancel
          </button>
        </form>
      )}

      <div className="report-table">
        <div className="report-row report-head">
          <span>Table</span>
          <span>Century</span>
          <span>1 Ball</span>
          <span>6 Ball</span>
          <span>10 Ball</span>
          <span>Full Frame</span>
          <span>Action</span>
        </div>

        {tables.map((table) => (
          <div className="report-row" key={table.table_id || table.id}>
            <span>{table.table_name}</span>
            <span>Rs {table.hourly_rate}</span>
            <span>Rs {table.one_ball_rate}</span>
            <span>Rs {table.six_ball_rate}</span>
            <span>Rs {table.ten_ball_rate}</span>
            <span>Rs {table.full_frame_rate}</span>

            <button
              className="edit-user-btn"
              onClick={() => startEditTable(table)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TablesManagement;