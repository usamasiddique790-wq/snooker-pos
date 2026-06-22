import { useEffect, useState } from "react";
import "./App.css";

import { loginApi } from "./api/authApi";
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
import { getLiveTablesApi } from "./api/tablesApi";
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
  const [invoice, setInvoice] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

  const startGame = async (tableId) => {
    try {
      await startSessionApi(tableId);
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
    <div className="pos-shell">
      <header className="pos-header">
        <div>
          <h1>🎱 Snooker POS</h1>
          <p>Drag a table from the sidebar into the main play area.</p>
        </div>

        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, {user?.username}
          </span>

          <button onClick={logout}>Logout</button>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => {
              setShowAdminPanel(!showAdminPanel);
              fetchUsers();
              fetchProducts();
            }}
          >
            Admin Panel
          </button>
        )}
      </header>

      {showAdminPanel && user?.role === "admin" && (
        <div className="admin-panel">
          <div className="admin-header">
            <h2>Admin Panel</h2>

            <button
              className="close-admin"
              onClick={() => setShowAdminPanel(false)}
            >
              ✕
            </button>
          </div>

          <div className="admin-tabs">
            <button
              className={adminTab === "users" ? "active-tab" : ""}
              onClick={() => setAdminTab("users")}
            >
              Users
            </button>

            <button
              className={adminTab === "products" ? "active-tab" : ""}
              onClick={() => {
                setAdminTab("products");
                fetchProducts();
              }}
            >
              Products
            </button>
          </div>

          {adminTab === "users" && (
            <>
              <form className="user-form" onSubmit={createUser}>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />

                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="cashier">Cashier</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>

                <button type="submit">Create User</button>
              </form>

              {editingUser && (
                <form className="user-form edit-form" onSubmit={updateUser}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={editUserForm.username}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        username: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="password"
                    placeholder="New password"
                    value={editUserForm.password}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        password: e.target.value,
                      })
                    }
                  />

                  <select
                    value={editUserForm.role}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="cashier">Cashier</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button type="submit">Save Changes</button>

                  <button type="button" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                </form>
              )}

              <div className="users-table">
                {users.map((item) => (
                  <div className="user-row" key={item.id}>
                    <span>{item.username}</span>
                    <strong>{item.role}</strong>

                    <button
                      className="edit-user-btn"
                      onClick={() => startEditUser(item)}
                    >
                      Edit
                    </button>

                    {item.role !== "admin" && (
                      <button
                        className="delete-user-btn"
                        onClick={() => deleteUser(item.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {adminTab === "products" && (
            <div className="products-panel">
              <form className="user-form" onSubmit={createProduct}>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Barcode"
                  value={newProduct.barcode}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, barcode: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />

                <button type="submit">Add Product</button>
              </form>

              {editingProduct && (
                <form className="user-form edit-form" onSubmit={updateProduct}>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editProductForm.name}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Barcode"
                    value={editProductForm.barcode}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        barcode: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={editProductForm.price}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        price: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={editProductForm.stock}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        stock: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={editProductForm.category}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        category: e.target.value,
                      })
                    }
                  />

                  <button type="submit">Save Product</button>

                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className="products-table">
                {products.map((product) => (
                  <div className="product-row" key={product.id}>
                    <span>{product.name}</span>
                    <span>Rs {product.price}</span>
                    <span>Stock: {product.stock}</span>
                    <span>{product.category || "No Category"}</span>

                    <button
                      className="edit-user-btn"
                      onClick={() => startEditProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-user-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
                  const table = allTables.find(
                    (item) => item.table_id === tableId
                  );

                  const status = tableStatusMap[tableId];
                  const isRunning = status?.table_status?.trim() === "running";

                  return (
                    <TableCard
                      key={tableId}
                      tableId={tableId}
                      table={table}
                      status={status}
                      isRunning={isRunning}
                      onReturn={handleReturnToSidebar}
                      onStart={startGame}
                      onEnd={endGame}
                      onAddProduct={(status) => {
                        setOrderTable(status);
                        fetchProducts();
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <InvoicePopup invoice={invoice} onClose={() => setInvoice(null)} />

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
    </div>
  );
}

export default App;