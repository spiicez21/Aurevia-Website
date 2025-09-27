const About = () => {
  const roadmapItems = [
    {
      year: "2025",
      title: "Born out of clutter",
      description: "Fed up with noisy apps and cluttered interfaces",
      icon: "🌱",
      position: "left"
    },
    {
      year: "Now",
      title: "Shaped into focus",
      description: "Refined into a tool that actually helps you think",
      icon: "🎯",
      position: "right"
    },
    {
      year: "Next",
      title: "Evolving into the future",
      description: "The future of mindful productivity is just beginning",
      icon: "🚀",
      position: "left"
    }
  ]

  const teamMembers = [
    { name: "Alex", role: "Founder", avatar: "👾" },
    { name: "Sam", role: "Designer", avatar: "🎨" },
    { name: "Jordan", role: "Developer", avatar: "💻" },
    { name: "Casey", role: "AI Specialist", avatar: "🤖" }
  ]

  return (
    <section className="py-24 bg-gray-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            Why Aurevia?
          </h2>
          <p className="text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
            Built for creators, thinkers, learners, and doers who crave less chaos and more clarity.
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto mt-8"></div>
        </div>
        
        {/* Roadmap Timeline */}
        <div className="mb-20">
          <h3 className="text-3xl font-light text-white text-center mb-16">Our Journey</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-green-500/50"></div>
            
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-16 ${
                  item.position === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-gray-900 z-10"></div>
                
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${item.position === 'left' ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="text-purple-400 font-mono text-lg">{item.year}</span>
                    </div>
                    <h4 className="text-2xl font-light text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team Section */}
        <div className="text-center">
          <h3 className="text-3xl font-light text-white mb-8">Meet the Team</h3>
          <p className="text-xl text-gray-300 mb-12">
            A small crew with big clarity. Placeholder faces for now 👾.
          </p>
          
          <div className="flex justify-center gap-8 flex-wrap">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h4 className="text-lg font-medium text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">
                  {member.name}
                </h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About