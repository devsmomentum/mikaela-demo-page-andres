import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import logo from '@/assets/images/Logo_tipografico_Mikaela_La_Pollita_Millonaria-01.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook } from 'react-icons/fa'

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

  // Componente de Redes Sociales reutilizable
  const SocialMediaIcons = ({ className }: { className?: string }) => (
    <div className={`flex gap-4 items-center ${className}`}>
      <button className="socialMedia" aria-label="Facebook">
        <FaFacebook 
          size={20} 
          onClick={() => window.open('https://www.facebook.com/profile.php?id=61583829371206', '_blank')} 
          className="hover:opacity-80 transition-opacity" 
        />
      </button>
      <button className="socialMedia" aria-label="Instagram">
        <FaInstagram 
          size={20} 
          onClick={() => window.open('https://www.instagram.com/mikaelalapollitam', '_blank')} 
          className="hover:opacity-80 transition-opacity" 
        />
      </button>
      <button className="socialMedia" aria-label="YouTube">
        <FaYoutube 
          size={20} 
          onClick={() => window.open('https://m.youtube.com/@MikaelaLapollitamillonaria', '_blank')} 
          className="hover:opacity-80 transition-opacity" 
        />
      </button>
      <button className="socialMedia" aria-label="TikTok">
        <FaTiktok 
          size={20} 
          onClick={() => window.open('https://www.tiktok.com/@mikaelalapollitam?_r=1&_t=ZM-91vRgZS80TI', '_blank')} 
          className="hover:opacity-80 transition-opacity" 
        />
      </button>
    </div>
  )

  return (
    <header className="fixed top-0 w-full z-50 bg-primary text-primary-foreground 
             shadow-lg rounded-b-3xl border-b-4 border-yellow-400 shadow-yellow-500/30
             transition-all duration-300 ease-in-out
             hover:translate-y-[-4px] 
             hover:shadow-yellow-500/80
             cursor-pointer
           ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link to="/" onClick={() => handleNavigate('hero')}>
              <img 
                src={logo} 
                alt="Mikaela La Pollita Millonaria" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Menú de navegación (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 justify-end">
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
            
            
            {/* RRSS en Desktop - Usamos el componente */}
            <SocialMediaIcons />

          </nav>

          {/* Sección de Elementos para Móvil (RRSS y Botón de Menú) */}
          <div className="flex items-center gap-4 md:hidden"> 
            
            {/* RRSS en Mobile - Solo visible en pantallas pequeñas */}
            <SocialMediaIcons className="block" />

            {/* Botón de Menú para Móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Mobile) */}
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
            
          </nav>
        </div>
      )}
    </header>
  )
}