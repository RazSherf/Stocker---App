import React from "react"
import { Package2, Search, Plus } from "lucide-react"

export const Header = ({
  searchQuery,
  setSearchQuery,
  onAddProduct,
  totalProducts = 0,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Top Section with Gradient Accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl" />

      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg flex items-center justify-center">
              <Package2 className="w-6 h-6 text-blue-500" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-3 min-h-[40px]">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                Inventory
              </h2>
              {totalProducts > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                  {totalProducts.toLocaleString()} products
                </span>
              )}
            </div>
          </div>

          {/* Search and Add Product Row  */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 group">
              <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Search
                  className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
              </div>
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 h-10 text-sm text-gray-900 
                          bg-white border border-gray-200 rounded-lg 
                          placeholder:text-gray-400
                          focus:ring-2 focus:ring-blue-100 focus:border-blue-500
                          hover:border-gray-300 transition-all"
              />
            </div>
            <button
              onClick={onAddProduct}
              className="group inline-flex items-center whitespace-nowrap h-11 px-5
            bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 
            hover:from-blue-600 hover:via-blue-700 hover:to-indigo-600
            active:from-blue-700 active:via-blue-800 active:to-indigo-700
            text-white font-medium rounded-lg
            transition-all duration-300 ease-out
            shadow-[0_4px_12px_rgba(59,130,246,0.25)]
            hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)]
            active:shadow-[0_2px_6px_rgba(59,130,246,0.25)]
            active:translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2
            relative overflow-hidden
            before:absolute before:inset-0
            before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
            before:translate-x-[-200%] hover:before:translate-x-[200%]
            before:transition-transform before:duration-1000
            before:ease-out before:rounded-lg"
            >
              <Plus
                className="w-5 h-5 mr-2 transition-transform duration-300 ease-out 
                   group-hover:scale-110"
              />
              <span className="inline-block relative">
                Add New Product
                <span
                  className="absolute inset-x-0 bottom-0 h-px bg-white/40 
                     scale-x-0 group-hover:scale-x-100 
                     transition-transform duration-300 ease-out"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
