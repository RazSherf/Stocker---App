import React, { useState, useEffect } from "react"
import {
  Package,
  RefreshCw,
  LineChart,
  Menu,
  X,
  Box,
  Search,
  User,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings2,
} from "lucide-react"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const navigation = [
    { name: "Inventory", icon: Package, href: "/inventory" },
    { name: "Restocking", icon: RefreshCw, href: "/restocking" },
    { name: "Analytics", icon: LineChart, href: "/analytics" },
  ]

  const isActivePage = (path) => currentPath === path

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Stocker
                </span>
                <span className="text-xs text-gray-600 font-medium -mt-1">
                  Inventory Management
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <div className="flex space-x-2">
              {navigation.map((item) => {
                const isActive = isActivePage(item.href)
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${isActive ? "text-blue-700" : ""}`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="w-1 h-1 rounded-full bg-blue-600 ml-1" />
                    )}
                  </a>
                )
              })}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Your Profile
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } sm:hidden border-t border-gray-100 bg-white`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = isActivePage(item.href)
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : ""}`}
                />
                {item.name}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto" />
                )}
              </a>
            )
          })}

          {/* Mobile Profile Section */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-center px-4 py-2">
              <User className="w-5 h-5 text-gray-500 mr-3" />
            </div>
            <a
              href="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Your Profile
            </a>
            <a
              href="/account-settings"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Account Settings
            </a>
            <button className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
