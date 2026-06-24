import Dashboard from "./Dashboard";
import UsersManagement from "./UsersManagement";
import ProductsManagement from "./ProductsManagement";
import Credits from "./Credits";
import Reports from "./Reports";
import TablesManagement from "./TablesManagement";
import Expenses from "./Expenses";

function AdminPanel({
  adminTab,
  setAdminTab,
  setShowAdminPanel,
  fetchProducts,
  dashboard,
  fetchDashboard,
  users,
  newUser,
  setNewUser,
  createUser,
  editingUser,
  editUserForm,
  setEditUserForm,
  updateUser,
  setEditingUser,
  startEditUser,
  deleteUser,
  reportFilters,
  setReportFilters,
  salesReport,
  fetchSalesReport,
  products,
  newProduct,
  setNewProduct,
  createProduct,
  editingProduct,
  editProductForm,
  setEditProductForm,
  updateProduct,
  setEditingProduct,
  startEditProduct,
  deleteProduct,
  openInvoiceDetail,
  tables,
editingTable,
setEditingTable,
editTableForm,
setEditTableForm,
updateTableRates,
credits,
fetchCredits,
addCreditPayment,
deleteCredit,
expenses,
newExpense,
setNewExpense,
createExpense,
deleteExpense,
fetchExpenses,
}) {
  return (
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
  className={adminTab === "credits" ? "active-tab" : ""}
  onClick={() => {
    setAdminTab("credits");
    fetchCredits();
  }}
>
  Udhar
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
      
      
        <button    
  className={adminTab === "dashboard" ? "active-tab" : ""}
  onClick={() => {
    setAdminTab("dashboard");
    fetchDashboard();
  }}
>
  Dashboard
</button>
<button
  className={adminTab === "reports" ? "active-tab" : ""}
  onClick={() => setAdminTab("reports")}
>
  Reports
</button>
<button
  className={adminTab === "tables" ? "active-tab" : ""}
  onClick={() => setAdminTab("tables")}
>
  Tables
</button>
<button
  className={adminTab === "expenses" ? "active-tab" : ""}
  onClick={() => {
    setAdminTab("expenses");
    fetchExpenses();
  }}
>
  Expenses
</button>

      </div>

      {adminTab === "users" && (
        <UsersManagement
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
        />
      )}

      {adminTab === "products" && (
        <ProductsManagement
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
        />
      )}
      {adminTab === "dashboard" && (
  <Dashboard dashboard={dashboard} />
)}
{adminTab === "reports" && (
  <Reports
    reportFilters={reportFilters}
    setReportFilters={setReportFilters}
    salesReport={salesReport}
    fetchSalesReport={fetchSalesReport}
    openInvoiceDetail={openInvoiceDetail}
  />
)}
{adminTab === "tables" && (
  <TablesManagement
    tables={tables}
    editingTable={editingTable}
    setEditingTable={setEditingTable}
    editTableForm={editTableForm}
    setEditTableForm={setEditTableForm}
    updateTableRates={updateTableRates}
  />
)}
{adminTab === "credits" && (
  <Credits
    credits={credits}
    fetchCredits={fetchCredits}
    addCreditPayment={addCreditPayment}
    deleteCredit={deleteCredit}
  />
)}
{adminTab === "expenses" && (
  <Expenses
    expenses={expenses}
    newExpense={newExpense}
    setNewExpense={setNewExpense}
    createExpense={createExpense}
    deleteExpense={deleteExpense}
    fetchExpenses={fetchExpenses}
  />
)}
    </div>
  );
}

export default AdminPanel;