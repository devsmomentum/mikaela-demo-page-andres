import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Trophy, DollarSign, Ticket, Calendar as CalendarIcon, Clock, Star } from 'lucide-react'
import { LOTTERY_FIGURES, DAILY_DRAWS } from '@/lib/lottery-data'
import { format, parseISO, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Mock data for live metrics
const LIVE_METRICS = {
  pote: 15450.00,
  result: 20000.00,
  ganadores: 4494.00,
  tickets: 137
}

// Mock data for live feed
const LIVE_FEED = [
  { id: '1001', figures: [1, 5, 10, 15, 20, 25] },
  { id: '1002', figures: [2, 6, 11, 16, 21, 26] },
  { id: '1003', figures: [3, 7, 12, 17, 22, 27] },
  { id: '1004', figures: [4, 8, 13, 18, 23, 28] },
  { id: '1005', figures: [21, 22, 23, 24, 29, 30] },
]

// Generate tickets linked to draws
const HISTORY_DATA = DAILY_DRAWS.flatMap((draw, drawIndex) => {
  return Array.from({ length: 8 }).map((_, i) => {
    const ticketId = 1000 + (drawIndex * 100) + i
    // Generate random ticket figures
    let ticket = Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1)

    
    
    let rank = 'No Ganador'
    let matchCount = 0
    let matchedFigures: number[] = []
    let premio = '-'

    if (draw.winningFigures.length > 0) {
        // Force some winners for demo
        if (i === 0) { 
            rank = 'GANADOR'
            matchCount = 6
            matchedFigures = draw.winningFigures.slice(0, 6)
            // Override ticket to match winning figures
            ticket = draw.winningFigures.slice(0, 6)
        } else if (i === 1 || i === 2) { 
            rank = 'GANADOR'
            matchCount = 5
            matchedFigures = draw.winningFigures.slice(0, 5)
             // Override ticket to match 5 winning figures + 1 random
            ticket = [...draw.winningFigures.slice(0, 5), (draw.winningFigures[5] % 40) + 1]
        } else {
            matchCount = Math.floor(Math.random() * 4)
            matchedFigures = ticket.slice(0, matchCount) // Fake matches
        }

        // Calculate prize
        if (rank === 'GANADOR') {
            const totalWinners = 3 // Fixed number of winners for demo
            const perWinner = draw.totalPot / totalWinners
            const resultTodayTest = 20000/3;
            premio = `${perWinner.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs`
        }
    } else {
        rank = 'Pendiente'
    }

    return {
        id: ticketId,
        ticketNumber: `T-${ticketId}`,
        ticket,
        matchedFigures,
        matchCount,
        rank,
        estado: draw.winningFigures.length === 0 ? 'En Curso' : 'Finalizado',
        premio,
        fecha: draw.date,
        drawData: draw
    }
  })
})

export function LiveDashboardSection() {
  const [metrics, setMetrics] = useState(LIVE_METRICS)
  const [feed, setFeed] = useState(LIVE_FEED)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filter logic
  const filteredData = HISTORY_DATA.filter(item => {
    const itemDate = parseISO(item.fecha)
    const matchesDate = date ? isSameDay(itemDate, date) : true
    const matchesSearch = item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toString().includes(searchTerm)
    const matchesType = filterType === 'todos' ? true : 
                        filterType === 'ganadores' ? (item.rank === 'GANADOR') : true
    
    return matchesDate && matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [date, searchTerm, filterType])

  const handleClearFilters = () => {
    setDate(new Date())
    setSearchTerm('')
    setFilterType('todos')
  }

  // Get selected draw info
  const selectedDraw = date 
    ? DAILY_DRAWS.find(d => isSameDay(parseISO(d.date), date)) 
    : null

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        pote: prev.pote + Math.random() * 100,
        tickets: prev.tickets + 1
      }))
      
      setFeed(prev => {
        const newTicket = {
          id: String(Number(prev[0].id) + 1),
          figures: Array.from({ length: 6 }, () => Math.floor(Math.random() * 36) + 1)
        }
        return [newTicket, ...prev.slice(0, 4)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getFigureData = (num: number) => {
    return LOTTERY_FIGURES.find(f => f.number === num) || { number: num, name: 'Unknown', emoji: '?', image: '' }
  }

  return (
    <section id="tablero-en-vivo" className="pt-24 pb-12 md:pt-32 bg-gradient-to-b from-background to-secondary/10 min-h-screen">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Section 1: Live Metrics Dashboard (Tablero de Hoy) */}
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-[var(--mikaela-green)] rounded-xl p-6 text-primary-foreground shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Trophy className="w-8 h-8 text-[var(--mikaela-gold)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-poppins">Tablero de Hoy</h2>
                  <p className="text-primary-foreground/80">Sorteo Pollo Lleno - En Curso</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  En Vivo
                </Badge>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid w-full h-full gap-4">
            <Card className="border-4 border-primary/20 shadow-2xl hover:shadow-3xl transition-all bg-gradient-to-br from-white to-slate-50 transform hover:scale-[1.02]">
              <CardContent className="p-8 md:p-14 flex flex-col items-center text-center justify-center h-full">
                <span className="text-xl md:text-2xl text-slate-500 font-black mb-4 uppercase tracking-widest">Monto Recaudado</span>
                {/* Monto de prueba sin base de datos */}
                <div className="text-6xl md:text-8xl font-black text-primary flex flex-col md:flex-row items-center md:items-baseline gap-2 tracking-tighter drop-shadow-md leading-none">
                  {(isSameDay(parseISO(selectedDraw?.date || ''), new Date()) && new Date().getHours() >= 20 ? metrics.result : metrics.pote).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  <span className="text-4xl md:text-5xl text-primary/40 font-bold">Bs</span>
                </div>
                <Badge variant="outline" className="mt-6 text-base px-4 py-1.5 bg-green-100 text-green-800 border-green-300 font-bold shadow-sm">
                  +2.5% vs ayer
                </Badge>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Section 2: Live Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Últimas Jugadas Ingresadas
          </h3>
          <div className="bg-card rounded-xl shadow-sm p-4 overflow-hidden border">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {feed.map((ticket) => (
                <div key={ticket.id} className="flex-shrink-0 bg-white rounded-lg p-3 border border-gray-200 min-w-[320px] animate-in slide-in-from-right duration-500 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-black-900">Ticket #{ticket.id}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-black-100 text-b-700">Hace un momento</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {ticket.figures.map((num) => {
                      const fig = getFigureData(num)
                      return (
                        <div key={num} className="flex flex-col items-center" title={fig.name}>
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm border border-primary/20">
                            {num.toString().padStart(2, '0')}
                          </div>
                          <span className="text-[10px] font-semibold text-gray-900 mt-1 truncate max-w-[40px]">{fig.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: History Table */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-foreground font-poppins">Historial Pollo Lleno</h3>
          </div>

          {/* Filters */}
          <Card className="bg-secondary/10 border-secondary/20 max-w-5xl mx-auto">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#000000] uppercase">Fecha</label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background text-[#000000]",
                          !date && "text-[#374151]"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span className="text-[#374151]">Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d)
                          setIsCalendarOpen(false)
                        }}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#000000] uppercase">Buscar</label>
                  <Input 
                    placeholder="Buscar..." 
                    className="bg-background placeholder:text-[#374151] text-[#000000]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#000000] uppercase">Mostrar</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-background text-[#000000]">
                      <SelectValue placeholder="Todos los aciertos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los aciertos</SelectItem>
                      <SelectItem value="ganadores">Ganadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10 flex-1"
                    onClick={handleClearFilters}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Draw Summary */}
          {selectedDraw && (
            <div className="bg-gradient-to-r from-primary to-[var(--mikaela-green)] rounded-xl p-6 text-primary-foreground shadow-lg mb-6 animate-in fade-in slide-in-from-top-4 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <CalendarIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary-foreground">Resumen del Día</h4>
                    <p className="text-primary-foreground/80 text-sm">{format(parseISO(selectedDraw.date), "PPP", { locale: es })}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-primary-foreground/80 uppercase tracking-wider">Pote Total</span>
                  <div className="text-2xl font-bold text-[var(--mikaela-gold)] flex items-center gap-1">
                    {isSameDay(parseISO(selectedDraw.date), new Date()) && new Date().getHours() < 20 
                      ? "Pendiente" 
                      : `${(isSameDay(parseISO(selectedDraw.date), new Date()) ? metrics.result : selectedDraw.totalPot).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
                    }
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-primary-foreground/80 uppercase tracking-wider">Figuras Ganadoras</span>
                  {selectedDraw.winningFigures.length > 0 ? (
                    <div className="flex gap-1">
                      {selectedDraw.winningFigures.map(num => {
                        const fig = getFigureData(num)
                        return (
                          <div key={num} className="w-8 h-8 rounded-full bg-[var(--mikaela-gold)] text-[#422006] flex items-center justify-center text-xs font-bold shadow-sm border border-yellow-500" title={fig.name}>
                            {num.toString().padStart(2, '0')}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[var(--mikaela-gold)] border-[var(--mikaela-gold)]">Pendiente</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden max-w-5xl mx-auto">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <span className="text-sm font-medium text-[#374151]">Mostrando Tickets {filteredData.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredData.length)} de {filteredData.length}</span>
              <span className="text-sm font-medium text-[#374151]">Página {currentPage} de {Math.max(1, totalPages)}</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-[#000000]">Nro Ticket</TableHead>
                  <TableHead className="font-bold text-[#000000]">Figuras Jugadas</TableHead>
                  <TableHead className="text-center font-bold text-[#000000]">Aciertos</TableHead>
                  <TableHead className="font-bold text-[#000000]">Posición</TableHead>
                  <TableHead className="text-right font-bold text-[#000000]">Premio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-mono font-bold text-[#000000]">{row.ticketNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[300px]">
                        {row.ticket.map((num) => {
                           const fig = getFigureData(num)
                           const isPending = row.estado === 'En Curso' || row.rank === 'Pendiente'
                           const isMatched = !isPending && row.matchedFigures.includes(num)
                           return (
                            <div 
                              key={num} 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border",
                                isMatched 
                                  ? "bg-[var(--mikaela-gold)] text-[#422006] border-[var(--mikaela-gold)]" 
                                  : "bg-[#f3f4f6] text-[#000000] border-[#e5e7eb]"
                              )}
                              title={fig.name}
                            >
                              {num.toString().padStart(2, '0')}
                            </div>
                           )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-[#f3f4f6] text-[#000000] hover:bg-[#e5e7eb] font-semibold">
                        {row.matchCount}/6
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.rank === 'GANADOR' && (
                        <Badge className="bg-[var(--mikaela-gold)] text-[#422006] hover:bg-[var(--mikaela-gold)]/80 border-none font-bold">
                          🏆 GANADOR
                        </Badge>
                      )}
                      {row.rank === 'No Ganador' && (
                        <span className="text-[#000000] font-medium text-sm">-</span>
                      )}
                      {row.rank === 'Pendiente' && (
                        <Badge variant="outline" className="text-amber-600 border-amber-600 font-bold bg-amber-50">
                          ⏳ Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    {isSameDay(parseISO(row.fecha), new Date()) ? (
                      <TableCell className="text-right font-mono font-bold text-primary">
                        {row.premio !== '-' ? (
                          <>
                            {((20000 / 3) .toLocaleString('es-VE', { minimumFractionDigits: 2 }))} Bs
                          </>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ) : (
                      <TableCell className="text-right font-mono font-bold text-primary">
                        {row.premio}
                      </TableCell>
                    )}
                  </TableRow>                  
                ))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
            <div className="p-4 border-t bg-muted/20 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(i + 1)
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
