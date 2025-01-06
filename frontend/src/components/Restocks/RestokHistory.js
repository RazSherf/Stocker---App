import React, { useEffect, useReducer, useCallback, useMemo } from "react"
import { X, Loader2, Package2, ChevronLeft, ChevronRight } from "lucide-react"
import { HeaderCard } from "./components/Header"
import { format } from "date-fns"

const API_BASE_URL = "http://18.213.94.237:30002"

export const RestockHistory = () => {
  const [state, dispatch] = useReducer(restockReducer, initialState)
  const { restocks, page, total, isLoading, error, showFilters, filters } =
    state

  const queryParams = useMemo(() => {
    return new URLSearchParams({
      page: page.toString(),
      per_page: "10",
      ...(filters.product && { product: filters.product }),
      ...(filters.dateFrom && { date_from: filters.dateFrom }),
      ...(filters.dateTo && { date_to: filters.dateTo }),
      ...(filters.minQuantity && { min_quantity: filters.minQuantity }),
      ...(filters.maxQuantity && { max_quantity: filters.maxQuantity }),
    })
  }, [page, filters])

  const fetchRestocks = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: "" })

      const response = await fetch(
        `${API_BASE_URL}/api/restocks?${queryParams}`
      )
      const data = await response.json()

      if (!data.success) throw new Error(data.message)

      dispatch({ type: "SET_RESTOCKS", payload: data.restocks })
      dispatch({ type: "SET_TOTAL", payload: data.total })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [queryParams])

  useEffect(() => {
    fetchRestocks()
  }, [fetchRestocks])

  const handleFilterChange = useCallback((key, value) => {
    dispatch({ type: "UPDATE_FILTER", key, value })
  }, [])

  const handleRetry = useCallback(() => {
    fetchRestocks()
  }, [fetchRestocks])

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="space-y-2">
      {/* Header Card */}
      <HeaderCard
        showFilters={showFilters}
        dispatch={dispatch}
        totalItems={restocks.length} // Pass the total count from your data
        lastUpdated={new Date()}
      />

      {/* Filter Panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter inputs remain the same but with added aria-labels */}
            <div className="space-y-2">
              <label
                htmlFor="product"
                className="text-sm font-medium text-gray-700"
              >
                Product
              </label>
              <input
                id="product"
                type="text"
                value={filters.product}
                onChange={(e) => handleFilterChange("product", e.target.value)}
                placeholder="Search product..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Date Range and Quantity Range inputs follow similar pattern */}
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(page - 1) * 10 + 1}-{Math.min(page * 10, total)}
            </span>{" "}
            of <span className="font-medium text-gray-900">{total}</span>{" "}
            entries
          </div>

          {/* Pagination component */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) =>
              dispatch({ type: "SET_PAGE", payload: newPage })
            }
            isDisabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="m-6 p-4 text-sm border rounded-lg bg-red-50 text-red-600 border-red-200"
            role="alert"
          >
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="relative">
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-b-xl"
              role="status"
              aria-label="Loading"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2
                  className="w-8 h-8 animate-spin text-blue-600"
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-500">Loading data...</span>
              </div>
            </div>
          )}

          <div className="content-container verflow-x-auto">
            <div className="">
              <table className="w-full" role="table">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Previous Stock
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      New Stock
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {restocks.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package2
                            className="w-8 h-8 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="text-gray-500 text-sm">
                            No restock history found
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    restocks.map((restock) => (
                      <tr
                        key={restock._id}
                        className="group hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          {format(
                            new Date(restock.timestamp.$date),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {restock.product.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 group-hover:bg-green-100 transition-colors">
                            +{restock.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {restock.previous_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {restock.new_stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {restock.notes || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const initialState = {
  restocks: [],
  page: 1,
  total: 0,
  isLoading: false,
  error: "",
  showFilters: false,
  filters: {
    product: "",
    dateFrom: "",
    dateTo: "",
    minQuantity: "",
    maxQuantity: "",
  },
}

function restockReducer(state, action) {
  switch (action.type) {
    case "SET_RESTOCKS":
      return { ...state, restocks: action.payload }
    case "SET_PAGE":
      return { ...state, page: action.payload }
    case "SET_TOTAL":
      return { ...state, total: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "TOGGLE_FILTERS":
      return { ...state, showFilters: !state.showFilters }
    case "UPDATE_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
        page: 1,
      }
    case "CLEAR_FILTERS":
      return { ...state, filters: initialState.filters, page: 1 }
    default:
      return state
  }
}

const Pagination = ({ currentPage, totalPages, onPageChange, isDisabled }) => {
  const handleKeyPress = useCallback(
    (e, pageNum) => {
      if (e.key === "Enter" || e.key === " ") {
        onPageChange(pageNum)
      }
    },
    [onPageChange]
  )

  return (
    <div
      className="flex items-center gap-3"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isDisabled}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
          )
          .map((p, i, arr) => (
            <React.Fragment key={p}>
              {i > 0 && arr[i - 1] !== p - 1 && (
                <span className="text-gray-400" aria-hidden="true">
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(p)}
                onKeyPress={(e) => handleKeyPress(e, p)}
                className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                } border`}
                aria-current={p === currentPage ? "page" : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            </React.Fragment>
          ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || isDisabled}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
