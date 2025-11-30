import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Search, Clock, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { SorteoType, getFigureByNumber, ORDINARY_TIMES, DailyResults, MOCK_RESULTS } from '@/lib/lottery-data'
import { lotteryApi } from '@/services/lottery-api'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type ShiftType = 'all' | 'morning' | 'afternoon' | 'night'

const SHIFTS = {
  morning: { 
    label: 'Mañana (10:00 AM - 11:00 AM)', 
    times: ['10:00 AM', '11:00 AM'] 
  },
  afternoon: { 
    label: 'Tarde (12:00 PM - 05:00 PM)', 
    times: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'] 
  },
  night: { 
    label: 'Noche (06:00 PM - 07:00 PM)', 
    times: ['06:00 PM', '07:00 PM'] 
  }
}

export function ResultsSection() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [sorteoType, setSorteoType] = useState<SorteoType>('ordinario')
  const [selectedShift, setSelectedShift] = useState<ShiftType>('all')
  
  const [currentResults, setCurrentResults] = useState<DailyResults | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      console.log("🔄 [Frontend] Iniciando búsqueda de resultados para:", selectedDate);
      setIsLoading(true)
      try {
        const data = await lotteryApi.getResults({ date: selectedDate })
        console.log("✅ [Frontend] Resultados recibidos:", data);
        setCurrentResults(data)
      } catch (error) {
        console.error("❌ [Frontend] Error al obtener resultados:", error)
      } finally {
        setIsLoading(false)
        
      }
    }

    fetchResults()
  }, [selectedDate])

  const getFilteredOrdinaryResults = () => {
    if (!currentResults) return []
    if (selectedShift === 'all') return currentResults.ordinary
    
    const targetTimes = SHIFTS[selectedShift].times
    return currentResults.ordinary.filter(result => targetTimes.includes(result.time))
  }

  const filteredOrdinaryResults = getFilteredOrdinaryResults()

  return (
    <section id="resultados" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Resultados
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            Consulta los números ganadores de sorteos anteriores
          </p>
        </div>

        <Card className="max-w-7xl mx-auto p-6 md:p-10 shadow-xl min-h-[600px]">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-foreground">
                <CalendarIcon className="inline h-4 w-4 mr-1" />
                Fecha
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? format(parseISO(selectedDate), "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate ? parseISO(selectedDate) : undefined}
                    onSelect={(d) => {
                      if (d) {
                        setSelectedDate(format(d, 'yyyy-MM-dd'))
                        setIsCalendarOpen(false)
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Search className="inline h-4 w-4 mr-1" />
                Tipo de Sorteo
              </label>
              <Select value={sorteoType} onValueChange={(v) => setSorteoType(v as SorteoType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinario">La Pollita (Ordinario)</SelectItem>
                  <SelectItem value="extraordinario">Pollo Lleno (Extraordinario)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sorteoType === 'ordinario' && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Turno
                </label>
                <Select value={selectedShift} onValueChange={(v) => setSelectedShift(v as ShiftType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los turnos</SelectItem>
                    <SelectItem value="morning">Mañana (10am - 11am)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12pm - 5pm)</SelectItem>
                    <SelectItem value="night">Noche (6pm - 7pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          { isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground" style={{color: 'black'}}>Cargando resultados...</span>
            </div>
          ) : currentResults ? (
            <div className="overflow-visible p-4">
              {sorteoType === 'ordinario' ? (
                <div className="min-w-full">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    Sorteo Ordinario - {format(new Date(selectedDate + 'T12:00:00'), "dd/MM/yy", { locale: es })}
                    {selectedShift !== 'all' && ` - ${SHIFTS[selectedShift].label.split('(')[0].trim()}`}
                  </h3>
                  {filteredOrdinaryResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {filteredOrdinaryResults.map((result, idx) => {
                        const figure = getFigureByNumber(result.figureNumber)
                        const isMikaela = result.figureNumber === 21
                        
                        return (
                          <Card
                          key={idx}
                          /* SE AGREGO: card-hover-effect overflow-visible */
                          className={`p-4 text-center card-hover-effect overflow-visible ${
                              isMikaela ? 'border-2 border-destructive bg-destructive/5' : ''
                          }`}
                      >
                          
                          {/* NUEVO WRAPPER para el número y círculo */}
                          <div className="figure-number-wrapper mb-3">
                              <p className="text-2xl font-bold text-primary">
                                  {result.figureNumber}
                              </p>
                          </div>
                          
                          {/* Aumenté las dimensiones del contenedor a h-28 w-28 (o más, ajústalo) */}
                          <div className="image-wrapper mb-2 h-28 w-28 mx-auto relative">
                              <img 
                                  src={figure?.image} 
                                  alt={figure?.name}
                                  loading="lazy"
                                  /* ¡CLAVE!: Removí la clase 'zoom-image' de la imagen para usar una nueva clase */
                                  className="card-image-content object-contain w-full h-full"
                              />
                          </div>
                          
                          <p className="text-sm font-medium text-foreground" style={{fontSize:'20px'}}>
                              {figure?.name}
                          </p>

                          <div className="flex justify-center mb-3">
                              <Badge variant="secondary" className="font-medium">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {result.time}
                              </Badge>
                          </div>
                          {isMikaela && (
                              <Badge className="mt-2 bg-destructive text-destructive-foreground animate-pulse-glow">
                                  ¡Paga 40x!
                              </Badge>
                          )}
                      </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay resultados disponibles para este turno.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">
                    Pollo Lleno (Sorteo Especial) - 8:00 PM
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Gana con 5 o 6 aciertos en cualquier orden
                  </p>
                  {currentResults.extraordinary.figures.length === 0 && selectedDate === new Date().toISOString().split('T')[0] ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-accent/30 rounded-lg bg-accent/5">
                      <Clock className="h-12 w-12 text-accent mb-4 animate-pulse" />
                      <h4 className="text-xl font-bold text-accent mb-2">Sorteo pendiente</h4>
                      <p className="text-foreground/80 max-w-md">
                        Los resultados del sorteo de las 8:00 PM de hoy aún no han sido publicados.
                        <br />
                        Por favor, vuelve a consultar después de la hora del sorteo.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {currentResults.extraordinary.figures.map((figNum, idx) => {
                        const figure = getFigureByNumber(figNum)
                        const isMikaela = figNum === 21
                        
                        return (
                          <Card
                          key={idx}
                          /* SE AGREGO: card-hover-effect overflow-visible */
                          className={`p-4 text-center card-hover-effect overflow-visible ${
                              isMikaela ? 'border-2 border-destructive bg-destructive/5' : ''
                          }`}
                      >
                          
                          {/* NUEVO WRAPPER para el número y círculo */}
                          <div className="figure-number-wrapper mb-3">
                              <p className="text-2xl font-bold text-primary">
                                  {figNum}
                              </p>
                          </div>
                          
                          {/* Aumenté las dimensiones del contenedor a h-28 w-28 (o más, ajústalo) */}
                          <div className="image-wrapper mb-2 h-28 w-28 mx-auto relative">
                              <img 
                                  src={figure?.image} 
                                  alt={figure?.name}
                                  loading="lazy"
                                  /* ¡CLAVE!: Removí la clase 'zoom-image' de la imagen para usar una nueva clase */
                                  className="card-image-content object-contain w-full h-full"
                              />
                          </div>
                          
                          <p className="text-sm font-medium text-foreground" style={{fontSize:'20px'}}>
                              {figure?.name}
                          </p>

                      </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground text-lg">No hay resultados disponibles para esta fecha.</p>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}