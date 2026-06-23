function ProductsManagement({
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
}) {
  const getProductEmoji = (name = "") => {
    const lower = name.toLowerCase();

    if (lower.includes("water")) return "💧";
    if (lower.includes("tea")) return "☕";
    if (lower.includes("coffee")) return "☕";
    if (lower.includes("chips")) return "🍟";
    if (lower.includes("pepsi") || lower.includes("drink")) return "🥤";
    if (lower.includes("milk")) return "🥛";

    return "📦";
  };

  return (
    <div className="products-panel modern-products-panel">
      <div className="products-header">
        <div>
          <h2>🛒 Products</h2>
          <p>Manage products and inventory</p>
        </div>
      </div>

      <form className="product-form-modern" onSubmit={createProduct}>
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

        <button type="submit">+ Add Product</button>
      </form>

      {editingProduct && (
        <form className="product-form-modern edit-product-card" onSubmit={updateProduct}>
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

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditingProduct(null)}>
            Cancel
          </button>
        </form>
      )}

      <div className="modern-product-grid">
        {products.map((product) => (
          <div className="modern-product-card" key={product.id}>
            <div className="product-emoji">
              {getProductEmoji(product.name)}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p>📦 Stock: {product.stock}</p>
              <strong>Rs {product.price}</strong>
              <small>{product.category || "No Category"}</small>
            </div>

            <div className="product-actions">
              <button
                className="mini-btn blue"
                onClick={() => startEditProduct(product)}
              >
                ✎
              </button>

              <button
                className="mini-btn red"
                onClick={() => deleteProduct(product.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsManagement;