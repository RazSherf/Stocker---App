import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash,
  X,
  PackageOpen,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

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
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

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
  );
};

const ProductForm = ({
  onSubmit,
  initialData,
  isEdit,
}) => {
  // Ensure initialData always has a valid default structure
  const defaultData = {
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: 0
  };

  // Merge initialData with defaultData, ensuring all fields exist
  const [formData, setFormData] = useState(() => ({
    ...defaultData,
    ...(initialData || {})  // Only spread initialData if it exists
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          rows="3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity || 0}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
          min="0"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white py-2.5 rounded-lg hover:from-indigo-700 hover:via-blue-700 hover:to-blue-600 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
      >
        {isEdit ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast("Error fetching products", "error");
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSubmit = async (formData) => {
    try {
      const method = currentProduct ? "PUT" : "POST";
      const url = currentProduct
        ? `${API_BASE_URL}/api/products/${currentProduct._id}`
        : `${API_BASE_URL}/api/products`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      showToast(
        `Product ${currentProduct ? "updated" : "added"} successfully`
      );
      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast("Error saving product", "error");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        showToast("Product deleted successfully");
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast("Error deleting product", "error");
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Search size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-100">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="ml-4 text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModal}
        title={isEditModalOpen ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          onSubmit={handleSubmit}
          initialData={currentProduct}
          isEdit={isEditModalOpen}
        />
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductList;