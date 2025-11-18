import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import logo from '@/assets/images/Logo_tipografico_Mikaela_La_Pollita_Millonaria-01.png'

export function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Mikaela La Pollita Millonaria" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('resultados')}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Resultados
            </button>
            <button
              onClick={() => scrollToSection('reglamento')}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Reglamento
            </button>
            <button
              onClick={() => scrollToSection('juego-online')}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Juego Online
            </button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('resultados')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Resultados
            </button>
            <button
              onClick={() => scrollToSection('reglamento')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Reglamento
            </button>
            <button
              onClick={() => scrollToSection('juego-online')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Juego Online
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
