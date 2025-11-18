import { Trophy, Sparkles } from 'lucide-react'
import logo from '@/assets/images/BLANCO_Logo_de_Mikaela_La_Pollita_Millonaria-01.png'

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/90 to-accent py-16 md:py-24">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>Lotería Oficial Venezolana</span>
          </div>
          
          <div className="mb-8 flex justify-center">
            <img 
              src={logo} 
              alt="Mikaela La Pollita Millonaria" 
              className="w-full max-w-2xl h-auto object-contain"
            />
          </div>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Tu oportunidad de ganar cada día con <span className="font-semibold text-primary">10 sorteos diarios</span> y premios extraordinarios. ¡Consulta los resultados y participa!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-card rounded-lg p-6 shadow-lg flex-1 max-w-xs">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-primary mb-1">30x</p>
              <p className="text-sm text-muted-foreground">Premio Ordinario</p>
            </div>
            
            <div className="bg-destructive rounded-lg p-6 shadow-lg flex-1 max-w-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-20">🐔</div>
              <Trophy className="h-8 w-8 text-destructive-foreground mx-auto mb-2 animate-pulse-glow" />
              <p className="text-2xl md:text-3xl font-bold text-destructive-foreground mb-1">40x</p>
              <p className="text-sm text-destructive-foreground font-medium">¡Si sale MIKAELA #21!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
