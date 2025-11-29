export interface LotteryFigure {
  number: number
  name: string
  emoji: string
  image: string
}

export const LOTTERY_FIGURES: LotteryFigure[] = [
  { number: 1, name: "Sol", emoji: "☀️", image: "/figures2/1 SOL.png" },
  { number: 2, name: "Lentes", emoji: "👓", image: "/figures2/2 LENTES.png" },
  { number: 3, name: "Bombillo", emoji: "💡", image: "/figures2/3 BOMBILLO.png" },
  { number: 4, name: "Silla", emoji: "🪑", image: "/figures2/4 SILLA.png" },
  { number: 5, name: "Mano", emoji: "✋", image: "/figures2/5 MANO.png" },
  { number: 6, name: "Rana", emoji: "🐸", image: "/figures2/6 RANA.png" },
  { number: 7, name: "Perico", emoji: "🦜", image: "/figures2/7 PERICO.png" },
  { number: 8, name: "Mariposa", emoji: "🦋", image: "/figures2/8 MARIPOSA.png" },
  { number: 9, name: "Llave", emoji: "🔑", image: "/figures2/9 LLAVE.png" },
  { number: 10, name: "Aguacate", emoji: "🥑", image: "/figures2/10 AGUACATE.png" },
  { number: 11, name: "Lápiz", emoji: "✏️", image: "/figures2/11 LÁPIZ.png" },
  { number: 12, name: "Caballo", emoji: "🐴", image: "/figures2/12 CABALLO.png" },
  { number: 13, name: "Mono", emoji: "🐒", image: "/figures2/13 MONO.png" },
  { number: 14, name: "Paloma", emoji: "🕊️", image: "/figures2/14 PALOMA.png" },
  { number: 15, name: "León", emoji: "🦁", image: "/figures2/15 LEÓN.png" },
  { number: 16, name: "Machete", emoji: "🔪", image: "/figures2/16 MACHETE.png" },
  { number: 17, name: "Barco", emoji: "⛵", image: "/figures2/17 BARCO.png" },
  { number: 18, name: "Burro", emoji: "🫏", image: "/figures2/18 BURRO.png" },
  { number: 19, name: "Limón", emoji: "🍋", image: "/figures2/19 LIMÓN.png" },
  { number: 20, name: "Cochino", emoji: "🐷", image: "/figures2/20 COCHINO.png" },
  { number: 21, name: "MIKAELA", emoji: "🐔", image: "/figures2/21 MIKAELA.png" },
  { number: 22, name: "Pato", emoji: "🦆", image: "/figures2/22 PATO.png" },
  { number: 23, name: "Cuchara", emoji: "🥄", image: "/figures2/23 CUCHARA.png" },
  { number: 24, name: "Ojo", emoji: "👁️", image: "/figures2/24 OJO.png" },
  { number: 25, name: "Piña", emoji: "🍍", image: "/figures2/25 PIÑA.png" },
  { number: 26, name: "Luna", emoji: "🌙", image: "/figures2/26 LUNA.png" },
  { number: 27, name: "Corona", emoji: "👑", image: "/figures2/27 CORONA.png" },
  { number: 28, name: "Mango", emoji: "🥭", image: "/figures2/28 MANGO.png" },
  { number: 29, name: "Martillo", emoji: "🔨", image: "/figures2/29 MARTILLO.png" },
  { number: 30, name: "Huevo", emoji: "🥚", image: "/figures2/30 HUEVO.png" },
  { number: 31, name: "Carro", emoji: "🚗", image: "/figures2/31 CARRO.png" },
  { number: 32, name: "Bicicleta", emoji: "🚲", image: "/figures2/32 BICICLETA.png" },
  { number: 33, name: "Moto", emoji: "🏍️", image: "/figures2/33 MOTO.png" },
  { number: 34, name: "Venado", emoji: "🦌", image: "/figures2/34 VENADO.png" },
  { number: 35, name: "Cuchillo", emoji: "🔪", image: "/figures2/35 CUCHILLO.png" },
  { number: 36, name: "Candado", emoji: "🔒", image: "/figures2/36 CANDADO.png" },
  { number: 37, name: "Reloj", emoji: "⏰", image: "/figures2/37 RELOJ.png" },
  { number: 38, name: "Avión", emoji: "✈️", image: "/figures2/38 AVIÓN.png" },
  { number: 39, name: "Tijera", emoji: "✂️", image: "/figures2/39 TIJERAS.png" },
  { number: 40, name: "Mesa", emoji: "🪑", image: "/figures2/40 MESA.png" },
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
