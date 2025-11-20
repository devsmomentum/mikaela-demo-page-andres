import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Trophy, DollarSign, Ticket, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { LOTTERY_FIGURES } from '@/lib/lottery-data'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Mock data for live metrics
const LIVE_METRICS = {
  pote: 15450.00,
  primerLugar: 4494.00,
  segundoLugar: 642.00,
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

// Mock data for history table
const HISTORY_DATA = Array.from({ length: 10 }).map((_, i) => ({
  id: 1000 + i,
  ticketNumber: `T-${1000 + i}`,
  ticket: [1, 2, 3, 4, 5, 6].map(n => (n + i * 2) % 36 + 1), // Random figures
  posiciones: '0/6',
  aciertos: i % 3 === 0 ? '1er Lugar' : i % 3 === 1 ? '2do Lugar' : 'Parcial',
  estado: 'Finalizado',
  premio: i % 3 === 0 ? '4494.00 Bs' : i % 3 === 1 ? '642.00 Bs' : '-',
  fecha: '2025-11-19'
}))

export function LiveDashboardSection() {
  const [metrics, setMetrics] = useState(LIVE_METRICS)
  const [feed, setFeed] = useState(LIVE_FEED)
  const [date, setDate] = useState<Date | undefined>(new Date())

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
    <section id="tablero-en-vivo" className="py-12 bg-gradient-to-b from-background to-secondary/10 min-h-screen">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-sm text-muted-foreground font-medium mb-2">Monto Recaudado (Pote)</span>
                <div className="text-3xl font-bold text-primary flex items-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {metrics.pote.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                  +2.5% vs ayer
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-sm text-muted-foreground font-medium mb-2">A Repartir: 1er Lugar</span>
                <div className="text-2xl font-bold text-accent">
                  {metrics.primerLugar.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                </div>
                <span className="text-xs font-bold text-primary mt-1">70% del pote</span>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-sm text-muted-foreground font-medium mb-2">A Repartir: 2do Lugar</span>
                <div className="text-2xl font-bold text-secondary-foreground">
                  {metrics.segundoLugar.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                </div>
                <span className="text-xs font-bold text-primary mt-1">30% del pote</span>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-sm text-muted-foreground font-medium mb-2">Tickets Jugados Hoy</span>
                <div className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Ticket className="w-6 h-6" />
                  {metrics.tickets}
                </div>
                <span className="text-xs text-muted-foreground mt-1">Última jugada hace 2s</span>
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
                    <Badge variant="secondary" className="text-[10px] h-5 bg-black-100 text-black-700">Hace un momento</Badge>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {ticket.figures.map((num) => {
                      const fig = getFigureData(num)
                      return (
                        <div key={num} className="flex flex-col items-center" title={fig.name}>
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm border border-primary/20">
                            {num.toString().padStart(2, '0')}
                          </div>
                          <span className="text-[10px] font-semibold text-black mt-1 truncate max-w-[40px]">{fig.name}</span>
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
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Buscar</label>
                  <Input placeholder="Buscar..." className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Mostrar</label>
                  <Select defaultValue="todos">
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Todos los aciertos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los aciertos</SelectItem>
                      <SelectItem value="ganadores">Ganadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
                    Aplicar Filtros
                  </Button>
                  <Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Mostrando Tickets 1 - 100 de 137</span>
              <span className="text-sm font-medium text-gray-700">Página 1 de 2</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[50px] font-bold text-gray-900">#</TableHead>
                  <TableHead className="font-bold text-gray-900">Nro Ticket</TableHead>
                  <TableHead className="font-bold text-gray-900">Figuras Jugadas</TableHead>
                  <TableHead className="text-center font-bold text-gray-900">Posiciones</TableHead>
                  <TableHead className="font-bold text-gray-900">Aciertos</TableHead>
                  <TableHead className="font-bold text-gray-900">Estado</TableHead>
                  <TableHead className="text-right font-bold text-gray-900">Premio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HISTORY_DATA.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium text-gray-900">{row.id}</TableCell>
                    <TableCell className="font-mono font-bold text-primary">{row.ticketNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[300px]">
                        {row.ticket.map((num) => {
                           const fig = getFigureData(num)
                           return (
                            <div key={num} className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shadow-sm border border-secondary-foreground/10" title={fig.name}>
                              {num.toString().padStart(2, '0')}
                            </div>
                           )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 font-semibold">
                        {row.posiciones}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.aciertos === '1er Lugar' && (
                        <Badge className="bg-[var(--mikaela-gold)] text-yellow-900 hover:bg-[var(--mikaela-gold)]/80 border-none font-bold">
                          🏆 1er Lugar
                        </Badge>
                      )}
                      {row.aciertos === '2do Lugar' && (
                        <Badge className="bg-gray-400 text-white hover:bg-gray-500 border-none font-bold">
                          🥈 2do Lugar
                        </Badge>
                      )}
                      {row.aciertos === 'Parcial' && (
                        <span className="text-gray-700 font-medium text-sm">Parcial</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-700 font-bold text-sm">{row.estado}</span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {row.premio}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t bg-muted/20 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
