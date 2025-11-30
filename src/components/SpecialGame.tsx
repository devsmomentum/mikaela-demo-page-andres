import React from 'react'
import { Sparkles, HelpCircle, Lock, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SpecialGame() {
  
  return (
    <section id="proximamente" className="py-20 md:py-32 
             bg-gradient-to-br 
             from-emerald-950 
             via-black 
             to-emerald-900 
             text-white relative overflow-hidden">
      
      {/* Background pattern - sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      {/* Luz ambiental decorativa */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 mb-12">
          
          {/* Left Column: Misterio & Intriga Text */}
          <div className="flex-1 max-w-xl text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-200 text-sm font-bold animate-pulse">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="tracking-wider uppercase">Proyecto Secreto</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              ¿Estás listo para <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
                lo inesperado?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Las reglas están a punto de cambiar. Estamos preparando una nueva experiencia que desafiará tu suerte como nunca antes.
              <span className="block mt-4 font-medium text-white">Mantén los ojos abiertos.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
               <div className="flex items-center gap-3 text-sm text-emerald-400/80 uppercase tracking-widest font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Información Clasificada</span>
               </div>
            </div>
          </div>

          {/* Right Column: Mystery Card Simulation */}
          <div className="w-full max-w-[320px] relative perspective-1000 group">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600/20 to-yellow-400/20 blur-3xl rounded-full animate-pulse"></div>
            
            <Card className="relative bg-[#0a0a0a] text-white p-4 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700 ease-out border-2 border-emerald-800/50 transform group-hover:scale-105">
              
              {/* Border decoration */}
              <div className="absolute inset-1 border border-dashed border-emerald-900/50 rounded-lg pointer-events-none"></div>

              <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-lg p-5 relative overflow-hidden">
                
                {/* Header del Ticket */}
                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                  <h3 className="font-black text-3xl text-white uppercase tracking-tighter drop-shadow-md">Mikaela</h3>
                  <div className="h-0.5 w-12 bg-yellow-500 my-2"></div>
                  <p className="text-[10px] text-emerald-400 font-bold tracking-[0.2em] uppercase">Confidencial</p>
                </div>

                {/* AREA DE MISTERIO PRINCIPAL */}
                <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden border-2 border-yellow-500/20 bg-emerald-950/30 flex flex-col items-center justify-center">
                  
                  {/* Fondo animado dentro de la carta */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent animate-pulse"></div>
                  
                  {/* Signo de interrogación */}
                  <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
                    <HelpCircle className="w-24 h-24 text-yellow-400/80 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" strokeWidth={1.5} />
                  </div>

                  {/* Texto overlay */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="text-xs font-mono text-emerald-500/70">???</span>
                  </div>

                  {/* Cortina de "ruido" o textura */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                </div>

                {/* Footer del Ticket */}
                <div className="text-center space-y-3 relative z-10">
                  <div className="h-8 bg-slate-800/50 rounded w-full mx-auto flex items-center justify-center border border-white/5">
                      <span className="text-[10px] text-slate-500 font-mono tracking-widest">PROXIMAMENTE</span>
                  </div>
                </div>

                {/* Brillo diagonal sobre el ticket */}
                <div className="absolute -top-[150%] -left-[150%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-45 transition-all duration-1000 group-hover:translate-x-full group-hover:translate-y-full"></div>
              </div>
              
              {/* Badge Flotante "Coming Soon" */}
              <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs font-black px-4 py-1.5 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.4)] transform rotate-6 border border-yellow-300 z-20">
                PRÓXIMAMENTE
              </div>
            </Card>
          </div>
        </div>

      </div>
    </section>
  )
}