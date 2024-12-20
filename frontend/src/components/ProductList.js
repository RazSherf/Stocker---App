import React, { useState, useEffect } from "react"
import styles from "./ProductList.module.css"

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
  })
  // TODO fix the API calls, fix add product form
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const transformedProducts = data.products.map((product) => ({
        ...product,
        id: product._id?.$oid || product._id,
      }))
      setProducts(transformedProducts)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to fetch products. Please try again later.")
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateFormData = () => {
    if (!formData.name.trim()) {
      throw new Error("Product name is required")
    }
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) < 0
    ) {
      throw new Error("Please enter a valid quantity")
    }
    if (!formData.category.trim()) {
      throw new Error("Category is required")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      category: "",
    })
    setShowAddForm(false)
    setShowUpdateForm(false)
    setSelectedProduct(null)
    setError(null)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      validateFormData()

      const productData = {
        ...formData,
        quantity: parseInt(formData.quantity),
      }

      console.log("Sending product data:", productData)

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add product")
      }

      console.log("Product added successfully:", responseData)
      await fetchProducts()
      resetForm()
    } catch (err) {
      console.error("Error adding product:", err)
      setError(err.message || "Failed to add product. Please try again.")
    }
  }

  const handleUpdateClick = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      quantity: product.quantity.toString(),
      category: product.category,
    })
    setShowUpdateForm(true)
    setShowAddForm(false)
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return

    try {
      validateFormData()

      const response = await fetch(
        `http://localhost:5000/api/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            quantity: parseInt(formData.quantity),
          }),
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update product")
      }

      await fetchProducts()
      resetForm()
    } catch (err) {
      console.error("Error updating product:", err)
      setError(err.message || "Failed to update product. Please try again.")
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",
          }
        )

        if (!response.ok) {
          throw new Error("Failed to delete product")
        }

        await fetchProducts()
      } catch (err) {
        console.error("Error deleting product:", err)
        setError("Failed to delete product. Please try again.")
      }
    }
  }

  const downloadProductList = () => {
    const productListCSV = products
      .map(
        (product) =>
          `${product.id},${product.name},${product.quantity},${product.category}`
      )
      .join("\n")

    const blob = new Blob([`ID,Name,Quantity,Category\n${productListCSV}`], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "product_list.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.productList}>
      <h2>Current Inventory</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <button
        onClick={() => {
          console.log("Add button clicked") // Add this line
          setShowAddForm(!showAddForm)
          setShowUpdateForm(false)
          resetForm()
        }}
        className={styles.actionButton}
      >
        {showAddForm ? "Cancel Add" : "Add New Product"}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className={styles.form}>
          <h3>Add New Product</h3>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Add Product
          </button>
        </form>
      )}

      {showUpdateForm && (
        <form onSubmit={handleUpdateProduct} className={styles.form}>
          <h3>Update Product</h3>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Update Product
            </button>
            <button
              type="button"
              onClick={resetForm}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleUpdateClick(product)}
                    className={styles.updateButton}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={downloadProductList} className={styles.downloadButton}>
        Download Product List
      </button>
    </div>
  )
}

export default ProductList
