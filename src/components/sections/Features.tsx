const Features = () => {
  const features = [
    {
      title: "Simplicity",
      description: "No clutter. No chaos. Just pure focus.",
      icon: "🎯",
      gradient: "from-purple-600/20 to-pink-600/20",
      border: "border-purple-500/30"
    },
    {
      title: "Productivity",
      description: "Get things done before they even feel like work.",
      icon: "⚡",
      gradient: "from-blue-600/20 to-cyan-600/20",
      border: "border-blue-500/30"
    },
    {
      title: "AI Assistance",
      description: "A digital buddy who actually gets you.",
      icon: "🤖",
      gradient: "from-green-600/20 to-emerald-600/20",
      border: "border-green-500/30"
    },
    {
      title: "Secure & Private",
      description: "Your data, your vibe. Locked tight.",
      icon: "🔒",
      gradient: "from-orange-600/20 to-red-600/20",
      border: "border-orange-500/30"
    }
  ]

  return (
    <section className="py-24 bg-gray-950 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            Why Choose Clarity?
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto"></div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10`}
            >
              {/* Icon */}
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-light text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Hover Arrow */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-purple-400 text-sm">Learn more →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features