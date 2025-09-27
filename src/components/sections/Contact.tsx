import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      
      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1000)
  }

  return (
    <section className="py-24 bg-gray-950 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6">
            Slide into our inbox
          </h2>
          <p className="text-2xl text-gray-300 font-light">
            Questions? Ideas? Just want to say hi? We're listening.
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto mt-8"></div>
        </div>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 md:p-12">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-3 group-focus-within:text-purple-300 transition-colors duration-200">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Email Field */}
                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-3 group-focus-within:text-purple-300 transition-colors duration-200">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Message Field */}
                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-3 group-focus-within:text-purple-300 transition-colors duration-200">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us what's on your mind..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white text-lg font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="group-hover:tracking-wide transition-all duration-300">
                        Send it
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Confirmation Message
              <div className="text-center py-12">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-3xl font-light text-white mb-4">
                  Got it!
                </h3>
                <p className="text-xl text-gray-300 mb-8">
                  We'll reply before your coffee gets cold.
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent mx-auto"></div>
              </div>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Or reach out directly at{' '}
              <a 
                href="mailto:hello@aurevia.com" 
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline decoration-purple-400/30 hover:decoration-purple-300/50"
              >
                hello@aurevia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact