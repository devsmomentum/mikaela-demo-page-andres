export interface LotteryFigure {
  number: number
  name: string
  emoji: string
  image: string
}

export const LOTTERY_FIGURES: LotteryFigure[] = [
  { number: 1, name: "Sol", emoji: "☀️", image: "/figures/1 SOL-01.png" },
  { number: 2, name: "Lentes", emoji: "👓", image: "/figures/2 LENTES-01.png" },
  { number: 3, name: "Bombillo", emoji: "💡", image: "/figures/3 BOMBILLO-01.png" },
  { number: 4, name: "Silla", emoji: "🪑", image: "/figures/4 SILLA-01.png" },
  { number: 5, name: "Mano", emoji: "✋", image: "/figures/5 MANO-01.png" },
  { number: 6, name: "Rana", emoji: "🐸", image: "/figures/6 RANA-01.png" },
  { number: 7, name: "Perico", emoji: "🦜", image: "/figures/7 PERICO-01.png" },
  { number: 8, name: "Mariposa", emoji: "🦋", image: "/figures/8 MARIPOSA-01.png" },
  { number: 9, name: "Llave", emoji: "🔑", image: "/figures/9 LLAVE-01.png" },
  { number: 10, name: "Aguacate", emoji: "🥑", image: "/figures/10 AGUACATE-01.png" },
  { number: 11, name: "Lápiz", emoji: "✏️", image: "/figures/11 LÁPIZ-01.png" },
  { number: 12, name: "Caballo", emoji: "🐴", image: "/figures/12 CABALLO-01.png" },
  { number: 13, name: "Mono", emoji: "🐒", image: "/figures/13 MONO-01.png" },
  { number: 14, name: "Paloma", emoji: "🕊️", image: "/figures/14 PALOMA-01.png" },
  { number: 15, name: "León", emoji: "🦁", image: "/figures/15 LEÓN-01.png" },
  { number: 16, name: "Machete", emoji: "🔪", image: "/figures/16 MACHETE-01.png" },
  { number: 17, name: "Barco", emoji: "⛵", image: "/figures/17 BARCO-01.png" },
  { number: 18, name: "Burro", emoji: "🫏", image: "/figures/18 BURRO-01.png" },
  { number: 19, name: "Limón", emoji: "🍋", image: "/figures/19 LIMÓN-01.png" },
  { number: 20, name: "Cochino", emoji: "🐷", image: "/figures/20 COCHINO-01.png" },
  { number: 21, name: "MIKAELA", emoji: "🐔", image: "/figures/21 MIKAELA-01.png" },
  { number: 22, name: "Pato", emoji: "🦆", image: "/figures/22 PATO-01.png" },
  { number: 23, name: "Cuchara", emoji: "🥄", image: "/figures/23 CUCHARA-01.png" },
  { number: 24, name: "Ojo", emoji: "👁️", image: "/figures/24 OJO-01.png" },
  { number: 25, name: "Piña", emoji: "🍍", image: "/figures/25 PIÑA-01.png" },
  { number: 26, name: "Luna", emoji: "🌙", image: "/figures/26 LUNA-01.png" },
  { number: 27, name: "Corona", emoji: "👑", image: "/figures/27 CORONA-01.png" },
  { number: 28, name: "Mango", emoji: "🥭", image: "/figures/28 MANGO-01.png" },
  { number: 29, name: "Martillo", emoji: "🔨", image: "/figures/29 MARTILLO-01.png" },
  { number: 30, name: "Huevo", emoji: "🥚", image: "/figures/30 HUEVO-01.png" },
  { number: 31, name: "Carro", emoji: "🚗", image: "/figures/31 CARRO-01.png" },
  { number: 32, name: "Bicicleta", emoji: "🚲", image: "/figures/32 BICICLETA-01.png" },
  { number: 33, name: "Moto", emoji: "🏍️", image: "/figures/33 MOTO-01.png" },
  { number: 34, name: "Venado", emoji: "🦌", image: "/figures/34 VENADO-01.png" },
  { number: 35, name: "Cuchillo", emoji: "🔪", image: "/figures/35 CUCHILLO-01.png" },
  { number: 36, name: "Candado", emoji: "🔒", image: "/figures/36 CANDADO-01.png" },
  { number: 37, name: "Reloj", emoji: "⏰", image: "/figures/37 RELOJ-01.png" },
  { number: 38, name: "Avión", emoji: "✈️", image: "/figures/38 AVIÓN-01.png" },
  { number: 39, name: "Tijera", emoji: "✂️", image: "/figures/39 TIJERAS-01.png" },
  { number: 40, name: "Mesa", emoji: "🪑", image: "/figures/40 MESA-01.png" },
]

export interface DailyDraw {
  date: string // YYYY-MM-DD
  totalPot: number
  winningFigures: number[]
  winnersCount: {
    firstPlace: number
    secondPlace: number
  }
}

export const getFigureByNumber = (num: number): LotteryFigure | undefined => {
  return LOTTERY_FIGURES.find(fig => fig.number === num)
}

export type SorteoType = 'ordinario' | 'extraordinario'

export interface OrdinaryResult {
  time: string
  figureNumber: number
}

export interface ExtraordinaryResult {
  figures: number[]
}

export interface DailyResults {
  date: string
  ordinary: OrdinaryResult[]
  extraordinary: ExtraordinaryResult
}

export const ORDINARY_TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
]

const generateRandomFigure = () => Math.floor(Math.random() * 40) + 1

const generateRandomExtraordinary = (): number[] => {
  const figures = new Set<number>()
  while (figures.size < 6) {
    figures.add(generateRandomFigure())
  }
  return Array.from(figures)
}

const generateOrdinaryResults = (): OrdinaryResult[] => {
  return ORDINARY_TIMES.map(time => ({
    time,
    figureNumber: generateRandomFigure()
  }))
}

const generateDailyResults = (daysAgo: number): DailyResults => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const isToday = daysAgo === 0
  
  return {
    date: date.toISOString().split('T')[0],
    ordinary: generateOrdinaryResults(),
    extraordinary: {
      figures: isToday ? [] : generateRandomExtraordinary()
    }
  }
}

export const MOCK_RESULTS: DailyResults[] = Array.from({ length: 30 }, (_, i) => generateDailyResults(i))

export interface DailyDraw {
  date: string // YYYY-MM-DD
  totalPot: number
  winningFigures: number[]
  winnersCount: {
    firstPlace: number
    secondPlace: number
  }
}

export const DAILY_DRAWS: DailyDraw[] = MOCK_RESULTS.map((result, index) => {
  const isToday = index === 0
  return {
    date: result.date,
    totalPot: isToday ? 15450.00 : Math.floor(Math.random() * 5000) + 10000,
    winningFigures: result.extraordinary.figures,
    winnersCount: {
      firstPlace: isToday ? 0 : Math.floor(Math.random() * 3) + 1,
      secondPlace: isToday ? 0 : Math.floor(Math.random() * 10) + 5
    }
  }
})
