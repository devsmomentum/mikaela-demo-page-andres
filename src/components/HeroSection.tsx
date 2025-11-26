import { Trophy, Sparkles, ChevronLeft, ChevronRight, Clock, Ticket, Award } from 'lucide-react' // Añadimos iconos de flecha
import logo from '@/assets/images/Logo Mikaela La Pollita Millonaria_Mesa de trabajo 1.png'
import { LOTTERY_FIGURES, LotteryFigure } from '@/lib/lottery-data' // Asumimos que LOTTERY_FIGURES es un array de objetos
import { useState, useMemo } from 'react' // Necesitamos useState
import { motion, AnimatePresence } from 'framer-motion' // Importamos motion y AnimatePresence

const GAME_MODES = [
  {
    id: 'pollita',
    title: 'La Pollita',
    subtitle: 'Sorteo Ordinario',
    description: '10 sorteos diarios. Gana 30x tu apuesta, o 40x si sale Mikaela (#21).',
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20'
  },
  {
    id: 'pollo-lleno',
    title: 'Pollo Lleno',
    subtitle: 'Sorteo Extra-ordinario',
    description: 'El Acumulado. Acierta 6 figuras. Sorteo todos los días a las 8:00 PM.',
    icon: Trophy,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20'
  },
  {
    id: 'millonario',
    title: 'Pollo Millonario',
    subtitle: 'Sorteo Especial',
    description: 'Tickets pre-impresos con combinaciones únicas. ¡Gana según tus aciertos!',
    icon: Ticket,
    color: 'text-secondary-foreground',
    bgColor: 'bg-secondary/20',
    borderColor: 'border-secondary/20'
  }
];

const MarqueeColumn = ({ figures, duration = 20, reverse = false }: { figures: LotteryFigure[], duration?: number, reverse?: boolean }) => {
  return (
    <div className="h-full overflow-hidden flex flex-col relative flex-1" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}>
      <motion.div
        className="flex flex-col gap-6 pb-6"
        initial={{ y: reverse ? "-50%" : "0%" }}
        animate={{ y: reverse ? "0%" : "-50%" }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity
        }}
      >
        {[...figures, ...figures].map((figure, index) => (
          <div key={`${figure.number}-${index}`} className="flex-shrink-0 px-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-3 flex flex-col items-center gap-2 shadow-lg hover:scale-110 hover:bg-white/40 hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 group cursor-pointer">
              <span className="text-xs font-bold text-white bg-black/30 px-2.5 py-0.5 rounded-full shadow-sm">#{figure.number}</span>
              <div className="w-14 h-14 bg-white rounded-full p-2 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                <img src={figure.image} alt={figure.name} className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="text-xs font-bold text-white text-center leading-tight truncate w-full drop-shadow-md">{figure.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function HeroSection() {
  // Estado para el índice del elemento actual en el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);
  // Estado para la dirección de la animación (para saber si entra por izquierda o derecha)
  const [direction, setDirection] = useState(0); // 0 = sin dirección, 1 = derecha, -1 = izquierda

  // Shuffled figures for the marquee
  const shuffledFigures1 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
  const shuffledFigures2 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
  const shuffledFigures3 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
  const shuffledFigures4 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);

  // Función para ir al siguiente elemento
  const paginate = (newDirection: number) => {
    setDirection(newDirection); // Establece la dirección
    setCurrentIndex((prevIndex) => {
      // Calcula el nuevo índice, asegurándose de que se mantenga dentro de los límites del array
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) {
        return GAME_MODES.length - 1; // Vuelve al final si es menor que 0
      } else if (nextIndex >= GAME_MODES.length) {
        return 0; // Vuelve al principio si excede el tamaño del array
      }
      return nextIndex;
    });
  };

  // Variantes para las animaciones de entrada/salida de los elementos del carrusel
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000, // Entra desde la derecha (1000px) o izquierda (-1000px)
      opacity: 0,
    }),
    center: {
      x: 0, // Posición central
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000, // Sale hacia la derecha o izquierda
      opacity: 0,
      position: 'absolute', // Necesario para que el elemento saliente se anime antes de ser removido
    }),
  };

  const currentGame = GAME_MODES[currentIndex]; // Obtiene el elemento actual a mostrar

  return (
    <section id="hero" className="relative overflow-hidden py-16 md:py-24 min-h-[600px] flex flex-col justify-center" style={{ backgroundImage: 'linear-gradient(180deg, #E4332F 0%, #E95731 35%, #F79133 70%, #FDEB37 100%)'}}>
      {/* Background Pattern with Figures */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZzI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Left Side Figures */}
        <div className="absolute left-0 top-0 bottom-0 w-1/4 hidden md:flex justify-center gap-4 p-4 opacity-60 hover:opacity-100 transition-opacity duration-500 z-0">
           <MarqueeColumn figures={shuffledFigures1} duration={35} />
           <MarqueeColumn figures={shuffledFigures2} duration={45} reverse />
        </div>

        {/* Right Side Figures */}
        <div className="absolute right-0 top-0 bottom-0 w-1/4 hidden md:flex justify-center gap-4 p-4 opacity-60 hover:opacity-100 transition-opacity duration-500 z-0">
           <MarqueeColumn figures={shuffledFigures3} duration={40} />
           <MarqueeColumn figures={shuffledFigures4} duration={50} reverse />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          <div className="mb-8 flex justify-center">
            <img
              src={logo}
              alt="Mikaela La Pollita Millonaria"
              className="w-full max-w-2xl h-auto object-contain drop-shadow-xl"
            />
          </div>

          <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto font-medium">
            Tu oportunidad de ganar cada día con <span className="font-bold text-primary">3 modalidades de juego</span> y premios extraordinarios.
          </p>

          {/* Carrusel de Modalidades de Juego */}
          <div className="relative flex justify-center items-center w-full max-w-2xl mx-auto h-64"> 
            {/* Botón Anterior */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-0 z-20 p-3 bg-background/80 text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 backdrop-blur-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Contenedor de la Animación */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipePower = 1000;
                  const swipe = offset.x + velocity.x * swipePower;

                  if (swipe < -swipePower) {
                    paginate(1);
                  } else if (swipe > swipePower) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full flex justify-center items-center px-12"
              >
                {/* Tarjeta del Carrusel */}
                <div className={`bg-card rounded-xl p-8 shadow-2xl w-full max-w-md flex flex-col items-center text-center border-2 ${currentGame.borderColor}`}>
                  <div className={`p-4 rounded-full mb-4 ${currentGame.bgColor}`}>
                    <currentGame.icon className={`h-10 w-10 ${currentGame.color}`} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-1 ${currentGame.color}`}>
                    {currentGame.title}
                  </h3>
                  
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground mb-4 uppercase tracking-wider">
                    {currentGame.subtitle}
                  </span>
                  
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    {currentGame.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Botón Siguiente */}
            <button
              onClick={() => paginate(1)}
              className="absolute right-0 z-20 p-3 bg-background/80 text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Indicadores de Puntos */}
          <div className="flex justify-center gap-2 mt-8">
            {GAME_MODES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
                }`}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

