const Hero = () => {
  return (
    <section className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10"></div>
      
      {/* Floating Zen Elements */}
      <div className="absolute top-1/4 left-8 w-1 h-20 bg-gradient-to-b from-purple-400/20 to-transparent rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-12 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-purple-400/40 rounded-full"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/Image/Aurevia-logo.png" 
            alt="Aurevia" 
            className="h-28 w-auto drop-shadow-2xl hover:drop-shadow-[0_20px_35px_rgba(168,85,247,0.15)] transition-all duration-500 animate-gentle-float"
          />
        </div>
        
        {/* Main Heading */}
        <div className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-extralight text-white tracking-tight leading-none">
            Aurevia
          </h1>
          
          <p className="text-2xl md:text-3xl text-purple-200 font-light flex items-center justify-center gap-3">
            <span className="text-yellow-300">✨</span>
            Minimal. Intelligent. Made for focus.
          </p>
        </div>
        
        {/* Divider */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto"></div>
        
        {/* Subtext */}
        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
          Cut the noise. Find your flow. Aurevia keeps it simple so your mind stays clear.
        </p>
        
        {/* CTA Button */}
        <div className="pt-8">
          <button className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center mx-auto gap-3">
            <span className="group-hover:tracking-wide transition-all duration-300">
              Let's Begin
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-sm font-light">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-400/50 to-transparent animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero