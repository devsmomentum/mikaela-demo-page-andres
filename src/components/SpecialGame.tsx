import { useEffect, useState } from 'react'
import { Calendar, Clock, Ticket, Star, History, Trophy, Search, AlertCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LOTTERY_FIGURES } from '@/lib/lottery-data'
import { lotteryApi, SpecialGameResult } from '@/services/lottery-api'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import logo from '@/assets/images/Logo_tipografico_Mikaela_La_Pollita_Millonaria-01.png'

export function SpecialGame() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // Search state
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() - 1).toString()) // Default to previous month
  const [searchResult, setSearchResult] = useState<SpecialGameResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())
  const months = [
    { value: '0', label: 'Enero' },
    { value: '1', label: 'Febrero' },
    { value: '2', label: 'Marzo' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Mayo' },
    { value: '5', label: 'Junio' },
    { value: '6', label: 'Julio' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Septiembre' },
    { value: '9', label: 'Octubre' },
    { value: '10', label: 'Noviembre' },
    { value: '11', label: 'Diciembre' },
  ]

  const handleSearch = async () => {
    const year = parseInt(selectedYear)
    const month = parseInt(selectedMonth)
    
    setHasSearched(true)
    setIsLoading(true)
    
    try {
      const result = await lotteryApi.getSpecialGameHistory({ year, month })
      setSearchResult(result)
    } catch (error) {
      console.error("Error fetching special game history:", error)
      setSearchResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Perform initial search on mount
  useEffect(() => {
    handleSearch()
  }, [])

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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-12 mb-24">
          
          {/* Left Column: Info & Countdown */}
          <div className="flex-1 max-w-xl text-center lg:text-left space-y-8">
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
          <div className="w-full max-w-[280px] relative perspective-1000">
            <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl rounded-full animate-pulse"></div>
            
            <Card className="relative bg-white text-slate-900 p-3 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-yellow-400 transform hover:scale-105">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4">
                <div className="flex flex-col items-center text-center mb-6 border-b border-slate-200 pb-4 gap-2">
                  <div>
                    <h3 className="font-black text-2xl text-primary uppercase tracking-tighter">Mikaela</h3>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Pollo Lleno Millonario</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold px-3">
                    Nº 0012345
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {demoFigures.map((num) => {
                    const figure = LOTTERY_FIGURES.find(f => f.number === num)
                    return (
                      <div key={num} className="aspect-square bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 group hover:border-yellow-400 transition-colors">
                        <div className="relative w-full h-full flex items-center justify-center">
                           <img src={figure?.image} alt={figure?.name} loading="lazy" className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
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

        {/* History Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <History className="h-8 w-8 text-yellow-400" />
              Historial Pollo Lleno Millonario
            </h3>
            <p className="text-primary-foreground/70">Consulta los cartones ganadores de los sorteos anteriores</p>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
            {/* Search Controls */}
            <div className="w-full lg:w-1/3 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex flex-col gap-4">
                <div className="w-full space-y-2">
                  <label className="text-sm font-medium text-primary-foreground/80">Año</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full space-y-2">
                  <label className="text-sm font-medium text-primary-foreground/80">Mes</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold mt-2"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Sorteo
                </Button>
              </div>
            </div>

            {/* Result Display */}
            <div className="flex-1 w-full relative min-h-[500px] rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center p-8 group">
              {/* Decorative Background with Logo and Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-900/20"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full group-hover:bg-yellow-400/20 transition-colors duration-700"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/30 blur-[80px] rounded-full"></div>
                
                {/* Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] transform -rotate-12 scale-125">
                  <img src={logo} alt="" className="w-full h-full object-contain grayscale" />
                </div>
                
                {/* Floating particles effect (simulated with divs) */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/40 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-700"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-yellow-200/30 rounded-full animate-pulse delay-300"></div>
              </div>

              <div className="relative z-10 w-full flex justify-center">
                {isLoading ? (
                  <div className="text-center py-12 text-primary-foreground/50">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" />
                    <p>Buscando resultados...</p>
                  </div>
                ) : !hasSearched ? (
                  <div className="text-center py-12 text-primary-foreground/50 max-w-xs">
                    <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Historial de Sorteos</p>
                    <p className="text-sm opacity-80">Selecciona un mes y año para consultar el cartón ganador</p>
                  </div>
                ) : !searchResult ? (
                  <div className="text-center py-12 bg-black/20 backdrop-blur-md rounded-xl border border-white/10 w-full max-w-md p-8">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-400 opacity-80" />
                    <h4 className="text-xl font-bold mb-2">Sorteo no realizado</h4>
                    <p className="text-primary-foreground/70">
                      El sorteo seleccionado aún no se ha llevado a cabo o no hay resultados disponibles.
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-[260px] mx-auto transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent rounded-2xl blur-2xl"></div>
                    <Card className="relative bg-white text-slate-900 p-3 shadow-2xl border-none overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Trophy className="h-24 w-24" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex flex-col items-center text-center mb-6 gap-3">
                          <div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 text-[10px] px-2 h-5">
                                Sorteo Mensual
                              </Badge>
                              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                Último Domingo
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-primary capitalize">{searchResult.dateFormatted}</h4>
                          </div>
                          <div className="w-full bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Serial Ganador</p>
                            <p className="font-mono text-xl font-bold text-slate-900">{searchResult.ticketSerial}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {searchResult.figures.map((num: number) => {
                            const figure = LOTTERY_FIGURES.find(f => f.number === num)
                            return (
                              <div key={num} className="aspect-square bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-2 shadow-sm">
                                <img src={figure?.image} alt={figure?.name} loading="lazy" className="w-full h-full object-contain mb-1" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{figure?.name}</span>
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex flex-col items-center justify-center pt-4 border-t border-slate-100 gap-3 text-center">
                          <div className="flex items-center justify-center gap-4 w-full">
                            <div>
                              <p className="text-[10px] text-slate-500 font-medium uppercase">Premio Mayor</p>
                              <p className="text-lg font-bold text-green-600">{searchResult.prize}</p>
                            </div>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div>
                              <p className="text-[10px] text-slate-500 font-medium uppercase">Estado</p>
                              <Badge variant={searchResult.status === 'Ganador' ? 'default' : 'secondary'} className={cn(
                                "h-5 text-[10px]",
                                searchResult.status === 'Ganador' ? "bg-green-500 hover:bg-green-600" : "bg-slate-500"
                              )}>
                                {searchResult.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase">Resultado Verificado</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
