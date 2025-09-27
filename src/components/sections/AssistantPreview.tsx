import { useState } from 'react'

const AssistantPreview = () => {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setIsTyping(true)
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      setInput('')
    }, 2000)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            Try It Now
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the clarity. No signup needed.
          </p>
        </div>
        
        {/* Console Interface */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            {/* Console Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-gray-400 text-sm font-mono">aurevia-console</span>
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your thought. Watch it flow into answers…"
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-lg"
                  disabled={isTyping}
                />
                {isTyping && (
                  <div className="absolute right-4 top-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto disabled:cursor-not-allowed"
              >
                <span className="group-hover:tracking-wide transition-all duration-300">
                  {isTyping ? 'Processing...' : 'Ask Aurevia'}
                </span>
                {!isTyping && (
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                )}
              </button>
            </form>
            
            {/* Response Area */}
            {isTyping && (
              <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm">Aurevia is thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Subtext */}
          <p className="text-gray-400 text-lg mt-8">
            No noise. No ads. Just clarity.
          </p>
        </div>
        
        {/* Demo Stats */}
        <div className="mt-16 flex justify-center gap-12">
          <div className="text-center">
            <div className="text-3xl font-light text-purple-400 mb-2">0.3s</div>
            <div className="text-gray-400">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-blue-400 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-green-400 mb-2">Zero</div>
            <div className="text-gray-400">Data Tracking</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AssistantPreview