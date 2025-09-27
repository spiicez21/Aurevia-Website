import React from 'react'

import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import AssistantPreview from './components/sections/AssistantPreview'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Contact from './components/sections/Contact'
import FAQ from './components/sections/FAQ'
import Footer from './components/sections/Footer'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Hero />
      <Features />
      <AssistantPreview />
      <About />
      <Services />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App