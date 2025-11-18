import { Clock, Trophy, Ticket, Award } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ReglamentoSection() {
  return (
    <section id="reglamento" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Reglamento Oficial
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            Conoce las reglas, premios y modalidades de juego. Operado por Daga.corporación22 C.A. y avalado por la Lotería de Caracas.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="pollita" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">La Pollita (Sorteo Ordinario)</h3>
                    <p className="text-foreground/80 text-lg max-w-2xl mx-auto">10 sorteos diarios</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        Cómo Jugar
                      </h4>
                      <p className="text-foreground/80">
                        Selecciona 1 figura de las 40 disponibles. Cada sorteo se realiza cada hora desde las 10:00 AM hasta las 7:00 PM.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Apuesta Mínima</p>
                        <p className="text-2xl font-bold text-primary">10 Bs</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Premio Base</p>
                        <p className="text-2xl font-bold text-accent">30x</p>
                      </div>
                    </div>

                    <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <Award className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                        <div>
                          <h5 className="font-bold text-destructive mb-2">¡Regla Especial MIKAELA!</h5>
                          <p className="text-sm text-foreground/80">
                            Si gana el número <span className="font-bold text-destructive">21 (Mikaela 🐔)</span>, 
                            el premio se incrementa a <span className="font-bold text-destructive">40 veces</span> lo apostado.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                        <span className="font-medium">⏰ Caducidad:</span> Los premios deben reclamarse dentro de 5 días continuos desde el sorteo.
                      </p>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pollo-lleno" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Pollo Lleno (Extraordinario)</h3>
                    <p className="text-foreground/80 text-lg max-w-2xl mx-auto">Sorteo nocturno con Jackpot</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-accent/5 border-accent/20">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-accent" />
                        Cómo Jugar
                      </h4>
                      <p className="text-foreground/80">
                        Selecciona 6 figuras diferentes de las 40 disponibles. Ganas si aciertas 5 o 6 figuras en cualquier orden.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-accent/10">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Apuesta</p>
                        <p className="text-2xl font-bold text-accent">100 Bs</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Horario</p>
                        <p className="text-2xl font-bold text-accent">8:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Frecuencia</p>
                        <p className="text-2xl font-bold text-accent">Diario</p>
                      </div>
                    </div>

                    <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 mt-4">
                      <h5 className="font-bold text-accent mb-3">🎯 Premios</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/80">6 aciertos (en orden)</span>
                          <Badge className="bg-accent text-accent-foreground">Acumulado (Jackpot)</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/80">5 aciertos (cualquier orden)</span>
                          <Badge variant="outline" className="border-accent text-accent">Premio Base</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-accent/10">
                      <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                        <span className="font-medium">💰 Acumulado:</span> Si no hay ganador de 6 aciertos, el premio se acumula para el siguiente día.
                      </p>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="millonario" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-secondary/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Award className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Pollo Lleno Millonario (Especial)</h3>
                    <p className="text-foreground/80 text-lg max-w-2xl mx-auto">Sorteo mensual con cartón pre-impreso</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-secondary/5 border-secondary/20">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-secondary-foreground" />
                        Cómo Participar
                      </h4>
                      <p className="text-foreground/80">
                        Compra un cartón pre-impreso con combinaciones únicas. El sorteo se realiza una vez al mes con múltiples categorías de premios.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-secondary/10">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Precio del Cartón</p>
                        <p className="text-2xl font-bold text-secondary-foreground">500 Bs</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Frecuencia</p>
                        <p className="text-2xl font-bold text-secondary-foreground">Mensual</p>
                      </div>
                    </div>

                    <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-4 mt-4">
                      <h5 className="font-bold text-secondary-foreground mb-3">🏆 Categorías de Premios</h5>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <span className="text-foreground/80">Cartón lleno (6 aciertos)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📐</span>
                          <span className="text-foreground/80">Esquinas del cartón</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📏</span>
                          <span className="text-foreground/80">Figura en "L"</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">➖</span>
                          <span className="text-foreground/80">Líneas completas</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-secondary/10">
                      <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                        <span className="font-medium">📋 Nota:</span> Los cartones son pre-impresos y deben adquirirse en puntos de venta autorizados.
                      </p>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
