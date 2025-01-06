import React from "react"
import { Construction, ArrowLeft, Sparkles, Clock } from "lucide-react"

const WorkInProgress = ({
  title = "Under Construction",
  message = "We're working hard to bring you something amazing",
}) => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
        <div className="absolute top-1/4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 -mt-20">
        <div className="w-full max-w-lg">
          {/* Main content card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Card gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />

            {/* Decorative corner sparkles */}
            <div className="absolute top-4 right-4">
              <Sparkles className="w-4 h-4 text-blue-500/30 animate-pulse" />
            </div>

            <div className="p-8 flex flex-col items-center text-center space-y-6">
              {/* Icon container with enhanced gradient background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 animate-pulse scale-150" />
                <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-full">
                  <Construction className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              {/* Title and message with enhanced typography */}
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {title}
                </h1>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Enhanced progress bar */}
              <div className="w-full max-w-xs">
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 w-3/4 animate-progress" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Almost there
                  </span>
                </div>
              </div>

              {/* Enhanced back button */}
              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Go Back
              </button>
            </div>
          </div>

          {/* Enhanced feature preview cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ text: "Coming Soon" }, { text: "Stay Tuned" }].map(
              ({ text, icon }, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-center justify-center gap-2 group cursor-default"
                >
                  <span className="text-gray-400 text-sm font-medium group-hover:text-blue-500 transition-colors">
                    {text}
                  </span>
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add keyframes for progress bar animation
const style = document.createElement("style")
style.textContent = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`
document.head.appendChild(style)

export default WorkInProgress
