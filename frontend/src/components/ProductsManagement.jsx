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
  return (
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

          <button type="button" onClick={() => setEditingProduct(null)}>
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
  );
}

export default ProductsManagement;