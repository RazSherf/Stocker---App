import React, { useState } from "react"
import { Package, RefreshCw, LineChart, Menu, X, Box } from "lucide-react"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Inventory", icon: Package, href: "/inventory" },
    { name: "Restocking", icon: RefreshCw, href: "/restocking" },
    { name: "Analytics", icon: LineChart, href: "/analytics" },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 flex items-center justify-center transform rotate-12 shadow-lg">
                <Box className="w-5 h-5 text-white transform -rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">
                  Stocker
                </span>
                <span className="text-xs text-blue-600 font-medium -mt-1">
                  Inventory System
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with enhanced styling */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } sm:hidden border-t border-gray-100`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
