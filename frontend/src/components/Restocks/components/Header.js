import React from "react"
import { Package2, Filter, Download, Calendar, RefreshCw } from "lucide-react"

export const HeaderCard = ({
  showFilters,
  dispatch,
  totalItems = 0,
  lastUpdated = new Date(),
}) => {
  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting data...")
  }

  const handleRefresh = () => {
    // Refresh functionality would go here
    console.log("Refreshing data...")
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Top Section with Gradient Accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl" />

      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {/* Title and Quick Stats Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <Package2
                  className="w-6 h-6 text-blue-500"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    Restock History
                  </h2>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Last updated {new Date(lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                    {totalItems.toLocaleString()} items
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: "TOGGLE_FILTERS" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border rounded-lg transition-colors"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <Filter className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Filters</span>
                {showFilters && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    Active
                  </span>
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border rounded-lg transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors"
                aria-label="Export data"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderCard
