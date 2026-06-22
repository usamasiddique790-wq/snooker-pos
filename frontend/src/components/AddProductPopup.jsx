function AddProductPopup({
  orderTable,
  orderForm,
  setOrderForm,
  products,
  onSubmit,
  onClose,
}) {
  if (!orderTable) return null;

  return (
    <div className="invoice-overlay">
      <form className="invoice-box" onSubmit={onSubmit}>
        <div className="invoice-title">
          <h2>Add Product</h2>
          <p>{orderTable.table_name}</p>
        </div>

        <select
          value={orderForm.product_id}
          onChange={(e) =>
            setOrderForm({ ...orderForm, product_id: e.target.value })
          }
          required
        >
          <option value="">Select Product</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - Rs {product.price} - Stock {product.stock}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={orderForm.quantity}
          onChange={(e) =>
            setOrderForm({ ...orderForm, quantity: e.target.value })
          }
          required
        />

        <div className="invoice-actions">
          <button className="print-btn" type="submit">
            Add Product
          </button>

          <button className="close-btn" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductPopup;