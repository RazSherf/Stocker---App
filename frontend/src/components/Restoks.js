import React, { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

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

// RestockDialog Component
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

      const nQuantity = parseInt(parseInt(quantity))
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id.$oid}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: nQuantity,
            notes,
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1" />
        Restock
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Restock ${product.name}`}
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-32">Current Stock:</label>
            <span>{product.stock}</span>
          </div>

          <div className="flex items-center">
            <label className="w-32">Add Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="border rounded px-3 py-1 w-32"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32">Notes:</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
              className="border rounded px-3 py-1 flex-1"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleRestock}
              disabled={!quantity || isLoading || parseInt(quantity) <= 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Confirm Restock"}
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
