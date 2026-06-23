import { getTodayDashboardApi } from "./api/dashboardApi";
import AdminPanel from "./components/AdminPanel";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import "./App.css";
import { loginApi } from "./api/authApi";
import StartGamePopup from "./components/StartGamePopup";
import { getLiveTablesApi, updateTableApi } from "./api/tablesApi";

import {
  getSalesReportApi,
  getInvoiceDetailApi,
} from "./api/reportApi";
import {
  addCreditApi,
  getCreditsApi,
  addCreditPaymentApi,
  deleteCreditApi,
} from "./api/creditApi";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "./api/usersApi";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "./api/productsApi";

import {
  startSessionApi,
  endSessionApi,
  addProductToSessionApi,
} from "./api/sessionsApi";

import InvoicePopup from "./components/InvoicePopup";
import AddProductPopup from "./components/AddProductPopup";
import TableCard from "./components/TableCard";

const TOTAL_TABLES = 18;

const allTables = Array.from({ length: TOTAL_TABLES }, (_, index) => ({
  table_id: index + 1,
  table_name: `Table ${index + 1}`,
}));

function App() {
  const [tables, setTables] = useState([]);
  const [stageTables, setStageTables] = useState([]);
  const [draggingTable, setDraggingTable] = useState(null);
  const [selectedStartTable, setSelectedStartTable] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [credits, setCredits] = useState([]);
  const [activePage, setActivePage] = useState("tables");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [newTable, setNewTable] = useState({
  table_name: "",
  hourly_rate: 300,
  one_ball_rate: 50,
  six_ball_rate: 100,
  ten_ball_rate: 150,
  full_frame_rate: 200,
});
const [editingTable, setEditingTable] = useState(null);

const [editTableForm, setEditTableForm] = useState({
  table_name: "",
  hourly_rate: 300,
  one_ball_rate: 50,
  six_ball_rate: 100,
  ten_ball_rate: 150,
  full_frame_rate: 200,
});
  const [tick, setTick] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTick((v) => v + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);
  const [dashboard, setDashboard] = useState(null);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "cashier",
  });
  const [salesReport, setSalesReport] = useState(null);
const [reportFilters, setReportFilters] = useState({
  start: "",
  end: "",
});

  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    password: "",
    role: "cashier",
  });

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    price: "",
    stock: "",
    category: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    barcode: "",
    price: "",
    stock: "",
    category: "",
  });

  const [orderTable, setOrderTable] = useState(null);
  const [orderForm, setOrderForm] = useState({
    product_id: "",
    quantity: 1,
  });

  const tableStatusMap = tables.reduce((map, table) => {
    map[table.table_id] = table;
    return map;
  }, {});

  const availableTables = allTables.filter(
    (table) => !stageTables.includes(table.table_id)
  );

  const openAdminPanel = (tab) => {
  setShowAdminPanel(true);
  setAdminTab(tab);

  fetchUsers();
  fetchProducts();
  fetchDashboard();
};

const saveCredit = async (data) => {
  try {
    await addCreditApi(data);
    await fetchCredits();

    if (reportFilters.start && reportFilters.end) {
      const res = await getSalesReportApi(
        reportFilters.start,
        reportFilters.end
      );

      setSalesReport(res.data);
    }

    alert("Udhar saved successfully");
  } catch (err) {
    alert(err.response?.data?.error || "Udhar save failed");
  }
};
const addCreditPayment = async (creditId, amount) => {
  try {
    await addCreditPaymentApi({
      credit_id: creditId,
      amount: Number(amount),
      notes: "Partial payment",
    });

    await fetchCredits();
    alert("Payment updated successfully");
  } catch (err) {
    alert(err.response?.data?.error || "Payment failed");
  }
};

const deleteCredit = async (creditId) => {
  if (!window.confirm("Complete udhar delete karna hai?")) return;

  try {
    await deleteCreditApi(creditId);
    await fetchCredits();
    alert("Credit deleted successfully");
  } catch (err) {
    alert(err.response?.data?.error || "Delete failed");
  }
};
const fetchCredits = async () => {
  try {
    const res = await getCreditsApi();
    setCredits(res.data);
  } catch (err) {
    alert(err.response?.data?.error || "Credits fetch failed");
  }
};
  const fetchTables = async () => {
    try {
      const res = await getLiveTablesApi();
      setTables(res.data);
    } catch (err) {
      console.error("TABLES ERROR:", err.response?.data || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsersApi();
      setUsers(res.data);
    } catch (err) {
      console.log("USERS ERROR:", err.response?.data || err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProductsApi();
      setProducts(res.data);
    } catch (err) {
      console.log("PRODUCTS ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchTables();
    fetchProducts();

    const interval = setInterval(fetchTables, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await loginApi(loginForm);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };
  const updateTableRates = async (e) => {
  e.preventDefault();

  try {
    await updateTableApi(editingTable.table_id || editingTable.id, editTableForm);

    setEditingTable(null);

    await fetchTables();

    alert("Table rates updated successfully");
  } catch (err) {
    alert(err.response?.data?.error || "Table update failed");
  }
};
  const openInvoiceDetail = async (id) => {
  try {
    const res = await getInvoiceDetailApi(id);
    setInvoice(res.data);
  } catch (err) {
    alert(err.response?.data?.error || "Invoice detail failed");
  }
};
const fetchDashboard = async () => {
  try {
    const res = await getTodayDashboardApi();
    setDashboard(res.data);
  } catch (err) {
    console.log("DASHBOARD ERROR:", err.response?.data || err.message);
  }
};
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await createUserApi(newUser);

      setNewUser({
        username: "",
        password: "",
        role: "cashier",
      });

      fetchUsers();
      alert("User created successfully");
    } catch (err) {
      alert(err.response?.data?.error || "User create error");
    }
  };
const fetchSalesReport = async (e) => {
  if (e) e.preventDefault();

  try {
    const res = await getSalesReportApi(
      reportFilters.start,
      reportFilters.end
    );

    setSalesReport(res.data);
  } catch (err) {
    alert(err.response?.data?.error || "Report fetch failed");
  }
};
  const startEditUser = (item) => {
    setEditingUser(item);
    setEditUserForm({
      username: item.username,
      password: "",
      role: item.role,
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      await updateUserApi(editingUser.id, editUserForm);

      setEditingUser(null);
      setEditUserForm({
        username: "",
        password: "",
        role: "cashier",
      });

      fetchUsers();
      alert("User updated successfully");
    } catch (err) {
      alert(err.response?.data?.error || "User update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUserApi(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    try {
      await createProductApi(newProduct);

      setNewProduct({
        name: "",
        barcode: "",
        price: "",
        stock: "",
        category: "",
      });

      fetchProducts();
      alert("Product added successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Product add failed");
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name || "",
      barcode: product.barcode || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      await updateProductApi(editingProduct.id, editProductForm);

      setEditingProduct(null);
      fetchProducts();
      alert("Product updated successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Product update failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProductApi(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Product delete failed");
    }
  };

  const startGame = async (tableId, billingType = "century") => {
  try {
    await startSessionApi(tableId, billingType);
    setSelectedStartTable(null);
    await fetchTables();
  } catch (err) {
    alert(err.response?.data?.error || err.message || "Start game error");
  }
};
  const endGame = async (sessionId) => {
    try {
      if (!sessionId) {
        alert("Session ID missing");
        return;
      }

      const res = await endSessionApi(sessionId);

      setInvoice(res.data);
      await fetchTables();
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.error || err.message || "End game error");
    }
  };

  const addProductToSession = async (e) => {
    e.preventDefault();

    try {
      await addProductToSessionApi(orderTable.session_id, {
        product_id: Number(orderForm.product_id),
        quantity: Number(orderForm.quantity),
      });

      alert("Product added to table bill");

      setOrderTable(null);
      setOrderForm({ product_id: "", quantity: 1 });

      await fetchTables();
      await fetchProducts();
      await fetchDashboard(); 
    } catch (err) {
      alert(err.response?.data?.error || "Product add failed");
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
  <div className="modern-shell">
    <Sidebar
  user={user}
  onLogout={logout}
  activePage={activePage}
  setActivePage={setActivePage}
  openAdminPanel={openAdminPanel}
/>

    <main className="modern-main">
      <Topbar
        user={user}
        onAdminPanel={() => {
          setShowAdminPanel(!showAdminPanel);
          fetchUsers();
          fetchProducts();
          fetchDashboard();
        }}
      />

      {showAdminPanel && user?.role === "admin" && (
        <AdminPanel
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          setShowAdminPanel={setShowAdminPanel}
          fetchProducts={fetchProducts}
          users={users}
          newUser={newUser}
          setNewUser={setNewUser}
          createUser={createUser}
          editingUser={editingUser}
          editUserForm={editUserForm}
          setEditUserForm={setEditUserForm}
          updateUser={updateUser}
          setEditingUser={setEditingUser}
          startEditUser={startEditUser}
          deleteUser={deleteUser}
          products={products}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          createProduct={createProduct}
          editingProduct={editingProduct}
          editProductForm={editProductForm}
          setEditProductForm={setEditProductForm}
          updateProduct={updateProduct}
          setEditingProduct={setEditingProduct}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
          dashboard={dashboard}
          fetchDashboard={fetchDashboard}
          reportFilters={reportFilters}
          setReportFilters={setReportFilters}
          salesReport={salesReport}
          fetchSalesReport={fetchSalesReport}
          openInvoiceDetail={openInvoiceDetail}
          tables={tables}
          editingTable={editingTable}
          setEditingTable={setEditingTable}
          editTableForm={editTableForm}
          setEditTableForm={setEditTableForm}
          updateTableRates={updateTableRates}
          credits={credits}
          fetchCredits={fetchCredits}
          addCreditPayment={addCreditPayment}
deleteCredit={deleteCredit}
        />
      )}

      <section className="image-style-section">
        <div className="section-title-row">
          <div>
            <h2>🎱 Snooker Tables</h2>
            <p>Manage all snooker tables</p>
          </div>
        </div>

        <div className="stage-grid">
          {allTables.map((table) => {
            const status = tableStatusMap[table.table_id];
            const isRunning = status?.table_status?.trim() === "running";

            return (
              <TableCard
                key={table.table_id}
                tableId={table.table_id}
                table={table}
                status={status}
                isRunning={isRunning}
                onReturn={() => {}}
                onStart={(tableId) => {
  const selected = allTables.find((t) => t.table_id === tableId);
  setSelectedStartTable(selected);
}}
                onEnd={endGame}
                onAddProduct={(status) => {
                  setOrderTable(status);
                  fetchProducts();
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="image-style-section compact-products-section">
        <div className="section-title-row">
          <div>
            <h2>🛒 Products</h2>
            <p>Manage products and inventory</p>
          </div>

          <button
            className="add-table-btn"
            onClick={() => {
              setShowAdminPanel(true);
              setAdminTab("products");
              fetchProducts();
            }}
          >
            + Add Product
          </button>
        </div>

        <div className="modern-product-grid">
          {products.slice(0, 5).map((product) => (
            <div className="modern-product-card" key={product.id}>
              <div className="product-emoji">
                {product.name?.toLowerCase().includes("water")
                  ? "💧"
                  : product.name?.toLowerCase().includes("tea")
                  ? "☕"
                  : product.name?.toLowerCase().includes("coffee")
                  ? "☕"
                  : product.name?.toLowerCase().includes("chips")
                  ? "🍟"
                  : product.name?.toLowerCase().includes("milk")
                  ? "🥛"
                  : "🥤"}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>📦 Stock: {product.stock}</p>
                <strong>Rs {product.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-grid summary-row">
        <div className="dashboard-card">
          <h3>Total Tables</h3>
          <h2>{TOTAL_TABLES}</h2>
          <p>All Snooker Tables</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Sessions</h3>
          <h2>{tables.filter((t) => t.session_status === "running").length}</h2>
          <p>Currently Running</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
          <p>In Inventory</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Users</h3>
          <h2>{users.length || 0}</h2>
          <p>System Users</p>
        </div>
      </section>

      <InvoicePopup
  invoice={invoice}
  onClose={() => setInvoice(null)}
  onSaveCredit={saveCredit}
/>

      <AddProductPopup
        orderTable={orderTable}
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        products={products}
        onSubmit={addProductToSession}
        onClose={() => {
          setOrderTable(null);
          setOrderForm({ product_id: "", quantity: 1 });
        }}
      />
      <StartGamePopup
  selectedTable={selectedStartTable}
  onStart={startGame}
  onClose={() => setSelectedStartTable(null)}
/>
    </main>
  </div>
);
}

export default App;