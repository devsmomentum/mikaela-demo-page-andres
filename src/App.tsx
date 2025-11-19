import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { NavigationHeader } from './components/NavigationHeader'
import { HeroSection } from './components/HeroSection'
import { ResultsSection } from './components/ResultsSection'
import { SpecialGame } from './components/SpecialGame'
import { Footer } from './components/Footer'
import { Toaster } from './components/ui/sonner'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main>
        <HeroSection />
        <ResultsSection />
        <SpecialGame />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App