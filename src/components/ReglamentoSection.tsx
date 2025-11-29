import { Clock, Trophy, Ticket, Award, FileText, AlertCircle, Calendar, DollarSign, Info } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mikaela = '/figures2/21 MIKAELA.png'

export function ReglamentoSection() {
  return (
    <section id="reglamento" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Reglamento de Juego
            </h2>
            <img src={mikaela} alt="Mikaela" className="h-32 w-auto object-contain" />
          </div>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            ¡Bienvenido! Aquí tienes la guía rápida para jugar, conocer los horarios y entender cómo cobrar tus premios de forma sencilla.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Accordion type="single" collapsible className="space-y-4">
            {/* 1. La Pollita */}
            <AccordionItem value="pollita" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground cursor-pointer">1. Sorteo Ordinario: "La Pollita" (Juego Rápido)</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        ¿Cómo jugar?
                      </h4>
                      <p className="text-foreground/80">
                        Selecciona una (1) o varias figuras numéricas del 1 al 40.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border border-primary/10">
                            <p className="font-semibold text-primary mb-1">Costo</p>
                            <p className="text-foreground/80">La apuesta mínima es de <span className="font-bold">10 Bs</span> por jugada.</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border border-primary/10">
                            <p className="font-semibold text-primary mb-1">Horarios</p>
                            <p className="text-foreground/80">10 sorteos diarios de Lunes a Domingo.</p>
                            <ul className="text-sm text-foreground/70 mt-2 space-y-1">
                                <li>• <strong>Mañana:</strong> 10:00 AM, 11:00 AM</li>
                                <li>• <strong>Tarde:</strong> 12:00 PM - 4:00 PM (cada hora)</li>
                                <li>• <strong>Noche:</strong> 5:00 PM, 6:00 PM, 7:00 PM</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            ¿Cuánto ganas?
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-primary/10">
                                <Badge variant="outline" className="mt-1">Normal</Badge>
                                <p className="text-foreground/80"><strong>30 veces</strong> el valor de tu apuesta.</p>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                <Badge variant="destructive" className="mt-1">Especial</Badge>
                                <p className="text-foreground/80">
                                    Si la figura ganadora es la <strong>Nro. 21 (Mikaela)</strong>, ganas <strong>40 veces</strong> tu apuesta.
                                </p>
                            </div>
                        </div>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Pollo Lleno */}
            <AccordionItem value="pollo-lleno" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground ">2. Sorteo Extra-ordinario: "Pollo Lleno" (El Acumulado)</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-accent/5 border-accent/20">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-accent" />
                        ¿Cómo jugar?
                      </h4>
                      <p className="text-foreground/80">
                        Selecciona <strong>seis (6) figuras</strong> del 1 al 40. Para ganar, las figuras pueden salir en cualquier orden.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border border-accent/10">
                            <p className="font-semibold text-accent mb-1">Costo</p>
                            <p className="text-foreground/80">El ticket cuesta <strong>100 Bs</strong>.</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border border-accent/10">
                            <p className="font-semibold text-accent mb-1">Horario</p>
                            <p className="text-foreground/80">Todos los días a las <strong>8:00 PM</strong>.</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-accent" />
                            ¿Cómo ganas?
                        </h4>
                        <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-2">
                            <li>Ganas si aciertas <strong>5 o 6 figuras</strong> de las extraídas.</li>
                            <li><strong>Premio:</strong> Es un pozo acumulado que se reparte entre todos los ganadores. Si eres el único, te llevas el total acumulado.</li>
                        </ul>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Millonario */}
            <AccordionItem value="millonario" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-secondary/5 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Ticket className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">3. Sorteo Especial: "Pollo Lleno Millonario"</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Card className="p-6 bg-accent/5 border-accent/20">
                  <div className="space-y-6">
                    <p className="text-foreground/80">
                        Este modo es diferente a los anteriores. Funciona mediante <strong>tickets pre-impresos</strong> (similares a un cartón de lotería tradicional o "kino").
                    </p>
                    
                    <div className="space-y-4">
                        <div className="bg-background/50 p-4 rounded-lg border border-secondary/10">
                            <h4 className="font-semibold text-secondary-foreground mb-2 flex items-center gap-2">
                                <Ticket className="h-4 w-4" /> El Ticket
                            </h4>
                            <p className="text-foreground/80 mb-2">No eliges los números en la pantalla; compras un boleto físico que ya tiene impresa una combinación única.</p>
                            <p className="font-medium text-secondary-foreground mb-1">¿Qué contiene tu cartón?</p>
                            <ul className="list-disc list-inside text-foreground/80 space-y-1 ml-2 text-sm">
                                <li>Una combinación de <strong>seis (6) figuras</strong>.</li>
                                <li>Un número adicional del 0 al 9 llamado <strong>"Comodín"</strong>.</li>
                                <li>Información clave: Precio, número de sorteo, fecha y hora específica del juego.</li>
                            </ul>
                        </div>

                        <div className="bg-background/50 p-4 rounded-lg border border-secondary/10">
                            <h4 className="font-semibold text-secondary-foreground mb-2 flex items-center gap-2">
                                <Award className="h-4 w-4" /> ¿Cómo ganas?
                            </h4>
                            <ul className="list-disc list-inside text-foreground/80 space-y-1 ml-2">
                                <li>Se realiza un sorteo público donde se extraen las figuras ganadoras.</li>
                                <li>El sistema verifica tu cartón y ganas según la <strong>categoría de aciertos</strong> que logres (coincidencia de figuras y/o comodín con los resultados oficiales).</li>
                            </ul>
                        </div>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Reglas de Cobro */}
          <Card className="border-2 border-muted">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="h-6 w-6 text-muted-foreground" />
                    Reglas para Cobrar Premios
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-foreground/80">Para asegurar tu pago, ten en cuenta lo siguiente:</p>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> 1. Cuida tu Ticket
                        </h5>
                        <p className="text-sm text-foreground/80">Debes presentar el ticket original o digital. No se pagan tickets rotos, alterados o ilegibles.</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> 2. Tiempo Límite
                        </h5>
                        <div className="text-sm text-foreground/80 space-y-1">
                            <p><strong>Pollita/Pollo Lleno:</strong> 5 días continuos.</p>
                            <p><strong>Especial:</strong> 10 días continuos.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> 3. Lugar
                        </h5>
                        <p className="text-sm text-foreground/80">Los premios se cobran en los centros de apuesta autorizados.</p>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* PDF Link */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg" asChild className="gap-2">
                <a href="/reglamento-oficial.pdf" target="_blank" rel="noopener noreferrer">
                    <FileText className="h-5 w-5" />
                    Ver Reglamento Oficial Completo (PDF)
                </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}