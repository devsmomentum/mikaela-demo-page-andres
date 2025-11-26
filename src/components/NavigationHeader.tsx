import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import logo from '@/assets/images/Logo_tipografico_Mikaela_La_Pollita_Millonaria-01.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleNavigate = (sectionId: string) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId)
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-primary text-primary-foreground shadow-lg rounded-b-3xl border-b-4 border-yellow-400 shadow-yellow-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <Link to="/" onClick={() => handleNavigate('hero')}>
              <img 
                src={logo} 
                alt="Mikaela La Pollita Millonaria" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigate('hero')}
              className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              Inicio
            </button>

            <Link to="/tablero-en-vivo" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Sorteo en Vivo
            </Link>

            <button
              onClick={() => handleNavigate('resultados')}
              className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              Resultados
            </button>
            <Link to="/reglamento" className="text-sm font-medium hover:opacity-80 transition-opacity">
              Reglamento
            </Link>
            <button
              onClick={() => handleNavigate('sorteo-especial')}
              className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              Pollo Lleno Millonario
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
              onClick={() => handleNavigate('hero')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium cursor-pointer"
            >
              Inicio
            </button>
            <Link to="/tablero-en-vivo" className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Sorteo en Vivo
            </Link>
            <button
              onClick={() => handleNavigate('resultados')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium cursor-pointer"
            >
              Resultados
            </button>
            <Link to="/reglamento" className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Reglamento
            </Link>
            <button
              onClick={() => handleNavigate('sorteo-especial')}
              className="text-left py-3 px-4 rounded-md hover:bg-primary-foreground/10 transition-colors font-medium cursor-pointer"
            >
              Pollo Lleno Millonario
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
