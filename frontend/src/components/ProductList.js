import React, { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Pencil,
  Trash,
  X,
  PackageOpen,
  DollarSign,
  AlertCircle,
  Boxes,
  History,
  ArrowUpDown,
} from "lucide-react"
import { RestockDialog, RestockHistory } from "./Restoks.js"

const API_BASE_URL = "http://18.213.94.237:30002" || "http://192.168.49.2:30002"

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative transform transition-all duration-200 scale-100">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
        {children}
      </div>
    </div>
  )
}

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 animate-slide-in-right ${
        type === "error" ? "bg-red-500" : "bg-emerald-500"
      } text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}
    >
      {type === "error" ? (
        <AlertCircle size={18} />
      ) : (
        <div className="text-white">✓</div>
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 p-1 hover:bg-white/10 rounded-full transition-all"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Separate ProductForm component
const ProductForm = ({
  onSubmit,
  initialData = {
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
  },
  isEdit,
}) => {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <div className="relative">
          <PackageOpen
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
            min="0"
            step="0.1"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <div className="relative">
          <PackageOpen
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          rows="3"
          placeholder="Enter product description..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock
        </label>
        <div className="relative">
          <Boxes
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min="0"
            step="1"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white py-2.5 rounded-lg hover:from-indigo-700 hover:via-blue-700 hover:to-blue-600 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
      >
        {isEdit ? "Update Product" : "Add Product"}
      </button>
    </form>
  )
}

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`)
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      showToast("Error fetching products", "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  const handleSubmit = async (formData) => {
    try {
      const method = currentProduct ? "PUT" : "POST"
      const url = currentProduct
        ? `${API_BASE_URL}/api/products/${currentProduct._id.$oid}`
        : `${API_BASE_URL}/api/products`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast(
          `Product ${currentProduct ? "updated" : "added"} successfully`
        )
        await fetchProducts()
        handleCloseModal()
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      showToast("Error saving product", "error")
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${productId}`,
          {
            method: "DELETE",
          }
        )

        if (response.ok) {
          showToast("Product deleted successfully")
          await fetchProducts()
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        showToast("Error deleting product", "error")
      }
    }
  }

  const handleEdit = (product) => {
    setCurrentProduct(product)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setCurrentProduct(null)
  }

  const handleRestock = (productId, newStockLevel) => {
    setProducts(
      products.map((product) =>
        product._id === productId
          ? { ...product, stock: newStockLevel }
          : product
      )
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:via-blue-700 hover:to-blue-600 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id.$oid}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RestockDialog
                          product={product}
                          onRestock={(data) =>
                            handleRestock(product._id, data.new_stock_level)
                          }
                        />
                      </td>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center"
                      >
                        <Pencil size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id.$oid)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-all inline-flex items-center"
                      >
                        <Trash size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title="Add New Product"
      >
        <ProductForm onSubmit={handleSubmit} isEdit={false} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Edit Product"
      >
        <ProductForm
          onSubmit={handleSubmit}
          initialData={{
            name: currentProduct?.name || "",
            price: currentProduct?.price || "",
            category: currentProduct?.category || "",
            stock: currentProduct?.stock || "",
            description: currentProduct?.description || "",
          }}
          isEdit={true}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default ProductList
