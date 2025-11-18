import { Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import logo from '@/assets/images/Logo_tipografico_Mikaela_La_Pollita_Millonaria-01.png'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Mikaela La Pollita Millonaria" className="h-10 w-auto object-contain" />
              <div>
                <h3 className="font-bold text-lg">Mikaela</h3>
                <p className="text-xs opacity-80">La Pollita Millonaria</p>
              </div>
            </div>
            <p className="text-sm opacity-80">
              Lotería oficial venezolana que te brinda oportunidades diarias de ganar. 
              Operado con responsabilidad y transparencia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Información Legal</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p>Operado por: Daga.corporación22 C.A.</p>
              <p>Avalado por: Lotería de Caracas</p>
              <p>Juego responsable +18 años</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Horarios de Sorteo</h4>
            <div className="space-y-2 text-sm opacity-80">
              <p>🕐 La Pollita: 10:00 AM - 7:00 PM</p>
              <p>🕗 Pollo Lleno: 8:00 PM</p>
              <p>📅 Pollo Millonario: Mensual</p>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-primary-foreground/20" />

        <div className="text-center text-sm opacity-80">
          <p className="flex items-center justify-center gap-2">
            Hecho con <Heart className="h-4 w-4 fill-current" /> para el pueblo venezolano
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Mikaela La Pollita Millonaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
