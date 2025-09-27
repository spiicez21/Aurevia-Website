const Services = () => {
  const services = [
    {
      title: "AI Tools",
      description: "Smarter than your average to-do list.",
      icon: "🧠",
      features: ["Smart task prioritization", "Context-aware suggestions", "Natural language processing"],
      gradient: "from-purple-600/20 to-pink-600/20",
      border: "border-purple-500/30",
      hoverColor: "hover:border-purple-400/50"
    },
    {
      title: "Productivity Boost",
      description: "Focus hacks, minus the hustle cringe.",
      icon: "⚡",
      features: ["Distraction blocking", "Flow state tracking", "Mindful break reminders"],
      gradient: "from-blue-600/20 to-cyan-600/20", 
      border: "border-blue-500/30",
      hoverColor: "hover:border-blue-400/50"
    },
    {
      title: "Integrations",
      description: "Plugs in where your workflow lives.",
      icon: "🔗",
      features: ["Calendar sync", "Note-taking apps", "Project management tools"],
      gradient: "from-green-600/20 to-emerald-600/20",
      border: "border-green-500/30", 
      hoverColor: "hover:border-green-400/50"
    },
    {
      title: "Zen Mode",
      description: "Pure focus. Zero distractions. Just you and your work.",
      icon: "🧘",
      features: ["Minimalist interface", "Ambient soundscapes", "Breathing exercises"],
      gradient: "from-orange-600/20 to-yellow-600/20",
      border: "border-orange-500/30",
      hoverColor: "hover:border-orange-400/50"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-blue-900/5"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            What We Offer
          </h2>
          <p className="text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-8">
            Tools that actually help instead of getting in your way.
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto"></div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group p-8 rounded-3xl bg-gradient-to-br ${service.gradient} backdrop-blur-sm border ${service.border} ${service.hoverColor} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10`}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-light text-white group-hover:text-purple-200 transition-colors duration-300">
                  {service.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className="text-xl text-gray-300 mb-8 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {service.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Coming Soon Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-600/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300 font-medium">Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/30 max-w-4xl mx-auto">
            <h3 className="text-3xl font-light text-white mb-6">
              Ready to declutter your digital life?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the waitlist and be the first to experience productivity without the chaos.
            </p>
            <button className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center mx-auto gap-3">
              <span className="group-hover:tracking-wide transition-all duration-300">
                Explore Aurevia Tools
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services