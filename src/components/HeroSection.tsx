import { Trophy, Sparkles, ChevronLeft, ChevronRight, Clock, Ticket, Award } from 'lucide-react' // Añadimos iconos de flecha
import logo from '@/assets/images/Logo Mikaela La Pollita Millonaria_Mesa de trabajo 1.png'
import { LOTTERY_FIGURES, LotteryFigure } from '@/lib/lottery-data' // Asumimos que LOTTERY_FIGURES es un array de objetos
import { useState, useMemo,useEffect } from 'react' // Necesitamos useState
import { motion, AnimatePresence } from 'framer-motion' // Importamos motion y AnimatePresence

// Definición de colores ajustados para fondo verde (según solicitud del usuario)
const COLORS = {
    // Fondo de tarjeta unificado: Verde oscuro para alto contraste
    cardBg: 'bg-green-700',
    
    // Colores de texto base
    mainText: 'text-white',       // Texto general, contraste contra el verde oscuro
    highlightText: 'text-yellow-300', // Texto de títulos y acentos clave (el amarillo solicitado)

    // Colores para modos Ordinarios (Pollita/Millonario)
    primaryText: 'text-white',
    primaryIconBg: 'bg-green-900/50', // Círculo de icono más oscuro
    primaryIconText: 'text-yellow-300',

    // Colores para modo Extra-ordinario (Pollo Lleno)
    accentText: 'text-yellow-300',
    accentIconBg: 'bg-green-900',  
    accentIconText: 'text-yellow-300',
    accentBorder: 'border-yellow-400', // Borde amarillo para Pollo Lleno
    
    // Subtítulos y detalles
    subtitleText: 'text-green-200', // Verde claro para subtítulos
    cardBorder: 'border-green-800', // Borde del mismo color que el fondo para uniformidad
};


const GAME_MODES = [
    {
        id: 'pollo-lleno',
        title: 'Pollo Lleno',
        subtitle: 'Sorteo Especial',
        description: null, // Lo renderizaremos con el componente PolloLlenoContent
        icon: Trophy,
        color: COLORS.accentText,
        bgColor: COLORS.accentIconBg,
        iconColor: COLORS.accentIconText,
        borderColor: COLORS.accentBorder
    },
    {
        id: 'pollita',
        title: 'La Pollita',
        subtitle: 'Sorteo Ordinario',
        // Texto ajustado para usar el amarillo de contraste
        description: <p className={COLORS.primaryText}> <b className={COLORS.highlightText}>10 sorteos diarios</b>. Gana 30x tu apuesta, o 40x si sale Mikaela (<span className={COLORS.highlightText}>#21</span>). </p>,
        icon: Clock,
        color: COLORS.primaryText,
        bgColor: COLORS.primaryIconBg,
        iconColor: COLORS.primaryIconText,
        borderColor: COLORS.cardBorder
    },
    {
        id: 'millonario',
        title: 'Pollo Millonario',
        subtitle: 'Sorteo Extra-ordinario',
        // Texto ajustado para usar el amarillo de contraste
        description: <p className={COLORS.primaryText}>Tickets pre-impresos con combinaciones únicas. <b className={COLORS.highlightText}>¡Gana según tus aciertos!</b></p>,
        icon: Ticket,
        color: COLORS.primaryText,
        bgColor: COLORS.primaryIconBg,
        iconColor: COLORS.primaryIconText,
        borderColor: COLORS.cardBorder
    }
];

// Componente visual para Pollo Lleno (Cuenta regresiva + Monto)
const PolloLlenoContent = ({ timeLeft }) => {
    const metrics = { pote: 12500.00 }; // Simulación de métricas

    return (
        <div className="w-full flex flex-col gap-3 mt-1 text-center">
            {/* 1. SECCIÓN CUENTA REGRESIVA - Fondo Verde Oscuro */}
            <div className="bg-green-800 rounded-xl p-4 shadow-inner w-full"> 
                <div className="flex items-center justify-center gap-2 mb-3 text-yellow-300"> 
                    <Clock className="h-5 w-5" />
                    <span className="font-bold uppercase tracking-wider text-sm">PRÓXIMO SORTEO EN</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                        { label: 'DÍAS', value: timeLeft.days },
                        { label: 'HORAS', value: timeLeft.hours },
                        { label: 'MIN', value: timeLeft.minutes },
                        { label: 'SEG', value: timeLeft.seconds }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col bg-green-900 rounded-lg p-2 shadow-inner"> {/* Cuadros aún más oscuros */}
                            <span className="text-2xl font-extrabold text-white tabular-nums leading-none">
                                {item.value.toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] text-green-300 uppercase font-medium mt-1">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. SECCIÓN MONTO RECAUDADO - Integrado con borde amarillo */}
            <div className="bg-green-800 rounded-xl p-3 border-2 border-yellow-400 shadow-lg flex flex-col items-center relative overflow-hidden transition-shadow hover:shadow-xl">
                
                <span className="text-sm text-green-200 font-bold mb-1 tracking-wider uppercase">
                    Pozo Acumulado
                </span>
                <div className="text-3xl font-black text-yellow-300 flex items-center gap-1">
                    {metrics.pote.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs
                </div>
                
                <div className="mt-2 text-[10px] px-3 py-0.5 rounded-full bg-yellow-50/20 text-yellow-300 border border-yellow-300 font-medium">
                    +2.5% vs ayer
                </div>
            </div>
            
            <div className="text-sm text-green-200 mt-2">
                Acierta 6 figuras. <b className="text-yellow-300">Sorteo Diario.</b>
            </div>
        </div>
    );
};

// Se cambia el tipo de 'figures' a 'any[]' para evitar errores de tipo al mover la definición de datos
const MarqueeColumn = ({ figures, duration = 20, reverse = false }) => {
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
                            <span className="text-xs font-bold text-white bg-black/30 px-2.5 py-0.5 rounded-full shadow-sm">{figure.number}</span>
                            <div className="w-14 h-14 bg-white rounded-full p-2 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                                {/* Usamos la imagen placeholder */}
                                <img src={figure.image} alt={figure.name} loading="lazy" className="w-full h-full object-contain drop-shadow-sm" />
                            </div>
                            <span className="text-xs font-bold text-white text-center leading-tight truncate w-full drop-shadow-md">{figure.name}</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// Componente principal de la aplicación React
const App = () => {
    // Se usa App como componente principal y export default
    return (
        <div className="min-h-screen bg-slate-100 font-sans antialiased">
            <HeroSection />
        </div>
    );
}

export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); 

    // --- LÓGICA DEL TEMPORIZADOR ---
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            // Configurar meta: Hoy a las 8:00 PM (20:00)
            let target = new Date();
            target.setHours(20, 0, 0, 0);

            // Si ya pasaron las 8 PM, la meta es mañana
            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Ejecutar inmediatamente

        return () => clearInterval(timer);
    }, []);
    // ----------------------------------------

    const shuffledFigures1 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
    const shuffledFigures2 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
    const shuffledFigures3 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);
    const shuffledFigures4 = useMemo(() => [...LOTTERY_FIGURES].sort(() => Math.random() - 0.5), []);

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) {
                return GAME_MODES.length - 1;
            } else if (nextIndex >= GAME_MODES.length) {
                return 0;
            }
            return nextIndex;
        });
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            position: 'absolute',
        }),
    };

    const currentGame = GAME_MODES[currentIndex];

    return (
        <section id="hero" className="relative overflow-hidden py-16 md:py-24 min-h-[600px] flex flex-col justify-center" style={{ backgroundImage: 'linear-gradient(180deg, #E4332F 0%, #E95731 35%, #F79133 70%, #FDEB37 100%)'}}>
            {/* Background Pattern with Figures */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Patrón de puntos */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZzI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGheiz0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                
                {/* Columnas de Figuras Animadas */}
                <div className="absolute left-0 top-0 bottom-0 w-1/4 hidden md:flex justify-center gap-4 p-4 opacity-60 hover:opacity-100 transition-opacity duration-500 z-0">
                    <MarqueeColumn figures={shuffledFigures1} duration={35} />
                    <MarqueeColumn figures={shuffledFigures2} duration={45} reverse />
                </div>

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

                    {/* Carrusel de Modalidades de Juego */}
                    <div className="relative flex justify-center items-center w-full max-w-2xl mx-auto h-96">
                        
                        {/* Botón Anterior */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-0 z-20 p-3 bg-white/80 text-primary rounded-full hover:bg-white hover:text-primary transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 backdrop-blur-sm"
                            aria-label="Anterior"
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
                                className="absolute w-full flex justify-center items-center px-12 h-full"
                            >
                                {/* Tarjeta del Carrusel - AHORA CON FONDO VERDE UNIFICADO */}
                                <div 
                                    className={`
                                        ${COLORS.cardBg} 
                                        rounded-xl p-6 
                                        shadow-2xl w-full 
                                        max-w-md 
                                        flex flex-col 
                                        items-center 
                                        text-center 
                                        border-2 ${currentGame.borderColor} 
                                        min-h-[320px] 
                                        transition-shadow hover:shadow-3xl
                                        ring-4 ring-green-600/50 
                                    `}
                                >
                                    
                                    {/* Contenedor del Título e Icono */}
                                    <div className={`flex items-center gap-3 ${currentGame.id === 'pollo-lleno' ? 'mb-1' : 'mb-4 flex-col'}`}>
                                        {/* Icono */}
                                        <div className={`p-3 rounded-full ${currentGame.bgColor}`}>
                                            <currentGame.icon className={`h-8 w-8 ${currentGame.iconColor}`} />
                                        </div>
                                        {/* Título y Subtítulo */}
                                        {currentGame.id === 'pollo-lleno' ? (
                                            <div className="text-left">
                                                <h3 className={`text-2xl font-black ${currentGame.color}`}>{currentGame.title}</h3>
                                                <span className={`flex-1 max-w-xl text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 px-4 py-1.5 rounded-full text-yellow-200 text-sm font-bold animate-pulse`}>{currentGame.subtitle}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className={`text-3xl font-black mb-1 ${currentGame.color} tracking-tight`}>{currentGame.title}</h3>
                                                <span className={`flex-1 max-w-xl text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 px-4 py-1.5 rounded-full text-yellow-200 text-sm font-bold animate-pulse`}>{currentGame.subtitle}</span>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Contenido Dinámico */}
                                    <div className={`text-lg ${COLORS.mainText} leading-relaxed w-full mt-4`}>
                                        {currentGame.id === 'pollo-lleno' ? (
                                            <PolloLlenoContent timeLeft={timeLeft} />
                                        ) : (
                                            currentGame.description
                                        )}
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Botón Siguiente */}
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-0 z-20 p-3 bg-white/80 text-primary rounded-full hover:bg-white hover:text-primary transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 backdrop-blur-sm"
                            aria-label="Siguiente"
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
                                    index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
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
