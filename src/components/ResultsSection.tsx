import { useState } from 'react'
import { Calendar, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MOCK_RESULTS, SorteoType, getFigureByNumber, ORDINARY_TIMES } from '@/lib/lottery-data'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function ResultsSection() {
  const [selectedDate, setSelectedDate] = useState(MOCK_RESULTS[0].date)
  const [sorteoType, setSorteoType] = useState<SorteoType>('ordinario')

  const currentResults = MOCK_RESULTS.find(r => r.date === selectedDate)

  return (
    <section id="resultados" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Resultados
          </h2>
          <p className="text-muted-foreground text-lg">
            Consulta los números ganadores de sorteos anteriores
          </p>
        </div>

        <Card className="max-w-6xl mx-auto p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_RESULTS.map(result => (
                    <SelectItem key={result.date} value={result.date}>
                      {format(new Date(result.date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          {currentResults && (
            <div className="overflow-x-auto">
              {sorteoType === 'ordinario' ? (
                <div className="min-w-full">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    Sorteo Ordinario - {format(new Date(selectedDate), "d 'de' MMMM", { locale: es })}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {currentResults.ordinary.map((result, idx) => {
                      const figure = getFigureByNumber(result.figureNumber)
                      const isMikaela = result.figureNumber === 21
                      
                      return (
                        <Card
                          key={idx}
                          className={`p-4 text-center transition-all hover:shadow-lg ${
                            isMikaela ? 'border-2 border-destructive bg-destructive/5' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {result.time}
                          </p>
                          <div className="text-4xl mb-2">{figure?.emoji}</div>
                          <p className="text-2xl font-bold text-primary mb-1">
                            #{result.figureNumber}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {figure?.name}
                          </p>
                          {isMikaela && (
                            <Badge className="mt-2 bg-destructive text-destructive-foreground animate-pulse-glow">
                              ¡Paga 40x!
                            </Badge>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">
                    Pollo Lleno (Extraordinario) - 8:00 PM
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Gana con 5 o 6 aciertos en cualquier orden
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {currentResults.extraordinary.figures.map((figNum, idx) => {
                      const figure = getFigureByNumber(figNum)
                      const isMikaela = figNum === 21
                      
                      return (
                        <Card
                          key={idx}
                          className={`p-6 text-center transition-all hover:shadow-lg ${
                            isMikaela ? 'border-2 border-destructive bg-destructive/5' : 'bg-accent/10'
                          }`}
                        >
                          <div className="text-5xl mb-3">{figure?.emoji}</div>
                          <p className="text-3xl font-bold text-accent mb-1">
                            #{figNum}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {figure?.name}
                          </p>
                          {isMikaela && (
                            <Badge className="mt-2 bg-destructive text-destructive-foreground">
                              Especial
                            </Badge>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
