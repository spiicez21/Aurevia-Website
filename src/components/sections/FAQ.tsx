import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Is Aurevia free?",
      answer: "Yes. Your focus shouldn't cost a paycheck. We believe everyone deserves access to tools that help them think clearly and work better.",
      icon: "💰"
    },
    {
      question: "Can I trust Aurevia?",
      answer: "Your secrets are safe. We don't snoop. We don't sell your data. We don't even want to know what you're working on. Privacy isn't a feature—it's a fundamental right.",
      icon: "🔒"
    },
    {
      question: "Dark mode?",
      answer: "Always. Light mode is a crime against retinas everywhere. Dark mode isn't just an option—it's the only option. Your eyes (and your sanity) will thank you.",
      icon: "🌙"
    },
    {
      question: "Do I need to sign up?",
      answer: "Only if you want to track progress. Lurking is allowed. Use Aurevia anonymously as much as you want. Create an account only when you're ready to save your preferences and sync across devices.",
      icon: "👻"
    },
    {
      question: "Who built this?",
      answer: "A small team of caffeine, code, and vibes. We're designers, developers, and dreamers who got tired of cluttered apps and decided to build something better. No corporate overlords, just passionate humans.",
      icon: "🚀"
    }
  ]

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-blue-900/5"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            FAQ
          </h2>
          <p className="text-2xl text-gray-300 font-light">
            The questions you're probably thinking (and our honest answers).
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto mt-8"></div>
        </div>
        
        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden transition-all duration-300 hover:border-purple-500/30"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-purple-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {faq.icon}
                  </span>
                  <h3 className="text-xl font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>
                <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Answer Content */}
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-6">
                  <div className="pl-12">
                    <div className="w-full h-px bg-gradient-to-r from-purple-400/20 via-purple-400/40 to-purple-400/20 mb-4"></div>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/20">
            <h3 className="text-2xl font-light text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              We're always happy to chat. Reach out and we'll get back to you faster than you can say "productivity app."
            </p>
            <button className="group px-8 py-3 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto">
              <span className="group-hover:tracking-wide transition-all duration-300">
                Ask us anything
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

export default FAQ