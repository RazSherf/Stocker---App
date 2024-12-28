import React, { useState, useEffect } from "react"
import { Plus, X, Boxes, History, AlertCircle } from "lucide-react"

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://18.213.94.237:30002"
    : "http://192.168.49.2:30002"

// uncomment for development
// const API_BASE_URL = "http://18.213.94.237:30002"

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
export const RestockDialog = ({ product, onRestock }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRestock = async () => {
    try {
      setIsLoading(true)
      setError("")

      const nQuantity = parseInt(quantity)
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id.$oid}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: nQuantity,
            notes: notes.trim(),
          }),
        }
      )
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      onRestock(data)
      setIsOpen(false)
      setQuantity("")
      setNotes("")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
        title="Restock Product"
      >
        <Plus size={18} strokeWidth={1.5} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Restock ${product.name}`}
      >
        <div className="space-y-6">
          {/* Current Stock Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Boxes className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Current Stock
                </span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {product.stock}
              </span>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add Quantity
            </label>
            <div className="relative">
              <Plus
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onFocus={handleFocus}
                min="1"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter quantity to add..."
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <div className="relative">
              <History
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onFocus={handleFocus}
                placeholder="Optional: Add notes about this restock..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="3"
              />
            </div>
          </div>

          {/* New Stock Preview */}
          {quantity && parseInt(quantity) > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">
                  New Stock Level
                </span>
                <span className="text-lg font-semibold text-blue-700">
                  {product.stock + parseInt(quantity)}
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleRestock}
              disabled={!quantity || isLoading || parseInt(quantity) <= 0}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-300 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">↻</span>
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Confirm Restock
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
// RestockHistory Component
export const RestockHistory = () => {
  const [restocks, setRestocks] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRestocks = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(
        `${API_BASE_URL}/api/restocks?page=${page}&per_page=10`
      )
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setRestocks(data.restocks)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestocks()
  }, [page])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Restock History</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total || isLoading}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restocks.map((restock) => (
              <tr key={restock._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(restock.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {restock.product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {restock.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {restock.previous_stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {restock.new_stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {restock.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
