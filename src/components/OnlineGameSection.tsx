import { useEffect, useState } from 'react'
import { Calendar, Clock, Ticket, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LOTTERY_FIGURES } from '@/lib/lottery-data'

export function OnlineGameSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Set target date to the end of the current month or a specific date
    // For demo purposes, let's set it to a fixed date in the future relative to now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 12) // 12 days from now
    targetDate.setHours(20, 0, 0, 0) // 8:00 PM
    
    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Example figures for the demo card - using a mix including Mikaela
  const demoFigures = [21, 15, 6, 27, 8, 12] 

  return (
    <section id="sorteo-especial" className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Info & Countdown */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 px-4 py-1.5 rounded-full text-yellow-200 text-sm font-bold animate-pulse">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Sorteo Mensual Especial</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Pollo Lleno <br/>
              <span className="text-yellow-400">Millonario</span>
            </h2>
            
            <p className="text-xl text-primary-foreground/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              ¡La oportunidad que esperabas! Participa en nuestro sorteo exclusivo una vez al mes. 
              Acierta las 6 figuras y conviértete en el próximo millonario.
            </p>

            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 inline-block w-full max-w-md shadow-xl">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 text-yellow-200">
                <Clock className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-wider text-sm">Próximo Sorteo en</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Días', value: timeLeft.days },
                  { label: 'Horas', value: timeLeft.hours },
                  { label: 'Min', value: timeLeft.minutes },
                  { label: 'Seg', value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                    <span className="text-2xl md:text-3xl font-bold tabular-nums">{item.value.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-primary-foreground/70 uppercase font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm font-medium text-primary-foreground/80 pt-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <Calendar className="h-5 w-5 text-yellow-400" />
                <span>Último domingo del mes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <Ticket className="h-5 w-5 text-yellow-400" />
                <span>Disponible en agencias</span>
              </div>
            </div>
          </div>

          {/* Right Column: Card Simulation */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg relative perspective-1000">
            <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl rounded-full animate-pulse"></div>
            
            <Card className="relative bg-white text-slate-900 p-3 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-yellow-400 transform hover:scale-105">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-black text-2xl text-primary uppercase tracking-tighter">Mikaela</h3>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Pollo Lleno Millonario</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold px-3">
                    Nº 0012345
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {demoFigures.map((num) => {
                    const figure = LOTTERY_FIGURES.find(f => f.number === num)
                    return (
                      <div key={num} className="aspect-square bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 group hover:border-yellow-400 transition-colors">
                        <div className="relative w-full h-full flex items-center justify-center">
                           <img src={figure?.image} alt={figure?.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 group-hover:text-yellow-600">{figure?.name}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="text-center space-y-3">
                  <div className="h-10 bg-slate-200 rounded w-full mx-auto flex items-center justify-center overflow-hidden">
                     <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#e2e8f0_5px,#e2e8f0_10px)] opacity-50"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Conserve este ticket en buen estado • Sorteo Mensual</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg transform rotate-12 border-2 border-white">
                ¡Sorteo Especial!
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}
