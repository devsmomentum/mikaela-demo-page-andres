import { NavigationHeader } from '@/components/NavigationHeader'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function ReglamentoPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main>
        <section id="reglamento" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Reglamento Oficial
              </h2>
              <p className="text-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Conoce las reglas, premios y modalidades de juego. Operado por Daga.corporación22 C.A. y avalado por la Lotería de Caracas.
              </p>
              
              <div className="flex justify-center mb-8">
                <Button asChild>
                  <a href="/reglamento-oficial.pdf" download="Reglamento-Mikaela.pdf" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar Reglamento PDF
                  </a>
                </Button>
              </div>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[800px]">
              <object
                data="/reglamento-oficial.pdf"
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <p className="text-lg mb-4">Tu navegador no puede mostrar el PDF directamente.</p>
                  <Button asChild>
                    <a href="/reglamento-oficial.pdf" download="Reglamento-Mikaela.pdf">
                      Descargar Reglamento
                    </a>
                  </Button>
                </div>
              </object>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
