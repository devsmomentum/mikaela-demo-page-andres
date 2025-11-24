import { DailyResults, MOCK_RESULTS, LOTTERY_FIGURES, OrdinaryResult } from '@/lib/lottery-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

// Tipos de Payload para las peticiones API
// Estos interfaces definen qué datos espera el backend recibir

export interface GetResultsPayload {
  date: string; // Formato YYYY-MM-DD
  type?: 'ordinario' | 'extraordinario';
}

export interface GetSpecialGameHistoryPayload {
  year: number;
  month: number; // 0-11
}

// Tipos de Respuesta de la API
// Estos interfaces definen qué datos devolverá el backend

export interface SpecialGameResult {
  dateObj: Date;
  dateFormatted: string;
  figures: number[];
  ticketSerial: string;
  prize: string;
  status: 'Ganador' | 'Vacante';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

/**
 * Servicio para manejar las peticiones a la API de Lotería.
 * Actualmente simula respuestas asíncronas usando los datos mockeados.
 * 
 * Para conectar con una API real:
 * 1. Reemplazar las promesas simuladas con fetch() o axios.get()
 * 2. Asegurarse que el backend devuelva la estructura definida en las interfaces.
 */
export const lotteryApi = {
  
  /**
   * Obtiene los resultados de los sorteos para una fecha específica.
   * Endpoint sugerido: GET /api/results?date=YYYY-MM-DD
   */
  getResults: async (params: GetResultsPayload): Promise<DailyResults | undefined> => {
    try {
      console.log('[LotteryAPI] Solicitando resultados para:', params.date);

      // Estrategia robusta para fechas:
      // Usamos gte (>=) fecha_actual y lt (<) fecha_siguiente
      // Esto funciona tanto para columnas tipo DATE como TIMESTAMP/TIMESTAMPTZ
      
      const today = params.date; // YYYY-MM-DD
      
      // Calcular el día siguiente
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() + 1);
      const tomorrow = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

      console.log('[LotteryAPI] Rango de consulta (inclusive-exclusive):', today, 'a', tomorrow);

      // CORRECCIÓN: La columna de fecha/hora se llama 'draw_time', no 'date'.
      const { data: draws, error } = await supabase
        .from('draws')
        .select('*')
        .gte('draw_time', today)
        .lt('draw_time', tomorrow);

      if (error) {
        console.error('[LotteryAPI] Error fetching draws from Supabase:', error);
        return undefined;
      }

      console.log('[LotteryAPI] Datos crudos recibidos de Supabase:', draws);

      if (!draws || draws.length === 0) {
        console.warn('[LotteryAPI] No se encontraron sorteos para esta fecha.');
        return undefined;
      }

      // 2. Transformar datos de Supabase al formato que espera tu App (DailyResults)
      
      // Filtramos los sorteos. Si existe la columna 'type', la usamos. 
      // Si no, asumimos que si tiene 'draw_time' es ordinario.
      const ordinaryDraws = draws.filter((d: any) => 
        d.type === 'ordinario' || (d.draw_time && d.type !== 'extraordinario')
      );
      
      console.log('[LotteryAPI] Sorteos ordinarios filtrados:', ordinaryDraws);

      const ordinary: OrdinaryResult[] = ordinaryDraws
        .map((d: any) => {
          // Formatear hora draw_time.
          // Si es un TIMESTAMP (ej: 2025-11-24 17:00:00+00), lo parseamos correctamente.
          let timeFormatted = d.draw_time;
          
          if (d.draw_time) {
            try {
              // Intentamos parsear como fecha completa
              const dateObj = new Date(d.draw_time);
              
              if (!isNaN(dateObj.getTime())) {
                // Es una fecha válida (TIMESTAMP)
                timeFormatted = format(dateObj, 'hh:mm a');
              } else {
                // Fallback: Intentar parsear como solo hora (HH:mm:ss)
                const parts = d.draw_time.split(':');
                if (parts.length >= 2) {
                  const date = new Date();
                  // Cuidado: si parts[0] viene sucio, esto puede fallar, pero es un fallback.
                  const hours = parseInt(parts[0]);
                  const minutes = parseInt(parts[1]);
                  if (!isNaN(hours) && !isNaN(minutes)) {
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    timeFormatted = format(date, 'hh:mm a');
                  }
                }
              }
            } catch (e) {
              console.error('Error formatting time:', d.draw_time);
            }
          }

          return {
            time: timeFormatted,
            figureNumber: Number(d.winning_animal_number), // Asegurar que sea número
            // Helper para ordenar
            _rawTime: d.draw_time
          };
        })
        // Ordenar por hora
        .sort((a: any, b: any) => {
            if (!a._rawTime) return 1;
            if (!b._rawTime) return -1;
            return a._rawTime.localeCompare(b._rawTime);
        })
        // Limpiar propiedades auxiliares
        .map((d: any) => ({
            time: d.time,
            figureNumber: d.figureNumber
        }));

      console.log('[LotteryAPI] Resultados ordinarios procesados:', ordinary);

      // Para el extraordinario
      const extraordinaryDraw = draws.find((d: any) => d.type === 'extraordinario');
      
      const result: DailyResults = {
        date: params.date,
        ordinary: ordinary,
        extraordinary: {
          figures: [] // TODO: Implementar lógica para extraordinario si es necesario
        }
      };

      return result;

    } catch (error) {
      console.error('[LotteryAPI] Unexpected error in getResults:', error);
      return undefined;
    }
  },

  /**
   * Obtiene el historial del juego especial (Pollo Lleno) para un mes y año específicos.
   * Endpoint sugerido: GET /api/special-game/history?year=2024&month=10
   */
  getSpecialGameHistory: async (params: GetSpecialGameHistoryPayload): Promise<SpecialGameResult | null> => {
    // SUPABASE IMPLEMENTATION:
    /*
    // Aquí iría la lógica para consultar la tabla de juegos especiales
    // const { data } = await supabase...
    */

    await new Promise(resolve => setTimeout(resolve, 800));

    const { year, month } = params;
    
    // Lógica movida desde SpecialGame.tsx para simular el backend
    const date = new Date(year, month + 1, 0); // Último día del mes
    const day = date.getDay(); // 0 es Domingo
    date.setDate(date.getDate() - day); // Retroceder al último domingo
    
    // Si la fecha es futura, no hay resultados
    if (date > new Date()) {
      return null;
    }

    // Generación determinista de datos (simulando base de datos)
    const seed = date.getTime();
    const figures: number[] = [];
    const availableFigures = [...LOTTERY_FIGURES];
    
    let currentSeed = seed;
    for (let i = 0; i < 6; i++) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      const index = Math.floor((currentSeed / 233280) * availableFigures.length);
      if (availableFigures[index]) {
        figures.push(availableFigures[index].number);
        availableFigures.splice(index, 1);
      }
    }

    return {
      dateObj: date,
      dateFormatted: format(date, "d 'de' MMMM, yyyy", { locale: es }),
      figures: figures,
      ticketSerial: (seed % 3 !== 0) ? `A-${seed.toString().slice(-7)}` : 'Vacante',
      prize: (seed % 2 === 0) ? '$50,000' : '$45,000',
      status: (seed % 3 !== 0) ? 'Ganador' : 'Vacante'
    };
  },

  /**
   * Obtiene el catálogo de figuras.
   * Endpoint sugerido: GET /api/figures
   */
  getFigures: async () => {
    // SUPABASE IMPLEMENTATION:
    /*
    const { data, error } = await supabase.from('figures').select('*').order('number');
    if (error) throw error;
    return data;
    */
    return LOTTERY_FIGURES;
  },

  /**
   * Obtiene las métricas en vivo para el dashboard.
   */
  getLiveMetrics: async () => {
    // SUPABASE IMPLEMENTATION:
    // Calcular sumas de la tabla 'tickets' y 'draws'
    return {
      pote: 15450.00,
      ganadores: 4494.00,
      tickets: 137
    };
  },

  /**
   * Obtiene los últimos tickets jugados (Live Feed).
   */
  getLiveFeed: async () => {
    // SUPABASE IMPLEMENTATION:
    /*
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('purchase_date', { ascending: false })
      .limit(5);
    return data.map(t => ({ id: t.serial_number, figures: t.selected_figures }));
    */
    return [
      { id: '1001', figures: [1, 5, 10, 15, 20, 25] },
      { id: '1002', figures: [2, 6, 11, 16, 21, 26] },
      { id: '1003', figures: [3, 7, 12, 17, 22, 27] },
      { id: '1004', figures: [4, 8, 13, 18, 23, 28] },
      { id: '1005', figures: [21, 22, 23, 24, 29, 30] },
    ];
  },

  /**
   * Obtiene el historial de tickets del usuario o general.
   */
  getTicketHistory: async (page: number = 1, limit: number = 10) => {
     // SUPABASE IMPLEMENTATION:
     /*
     const { data, count } = await supabase
        .from('tickets')
        .select('*, draws(*)', { count: 'exact' })
        .range((page - 1) * limit, page * limit - 1);
     */
     
     // Retornamos datos mockeados por ahora, pero la estructura está lista
     // Importamos DAILY_DRAWS dinámicamente para evitar dependencias circulares si fuera necesario
     const { DAILY_DRAWS } = await import('@/lib/lottery-data');
     
     // Lógica de generación de tickets mockeados (movida desde el componente)
     const history = DAILY_DRAWS.flatMap((draw, drawIndex) => {
        return Array.from({ length: 8 }).map((_, i) => {
            const ticketId = 1000 + (drawIndex * 100) + i;
            let ticket = Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 1);
            let rank = 'No Ganador';
            let matchCount = 0;
            let matchedFigures: number[] = [];
            let premio = '-';

            if (draw.winningFigures.length > 0) {
                if (i === 0) { 
                    rank = 'GANADOR';
                    matchCount = 6;
                    matchedFigures = draw.winningFigures.slice(0, 6);
                    ticket = draw.winningFigures.slice(0, 6);
                } else if (i === 1 || i === 2) { 
                    rank = 'GANADOR';
                    matchCount = 5;
                    matchedFigures = draw.winningFigures.slice(0, 5);
                    ticket = [...draw.winningFigures.slice(0, 5), (draw.winningFigures[5] % 40) + 1];
                } else {
                    matchCount = Math.floor(Math.random() * 4);
                    matchedFigures = ticket.slice(0, matchCount);
                }

                if (rank === 'GANADOR') {
                    const totalWinners = 3;
                    const perWinner = draw.totalPot / totalWinners;
                    premio = `${perWinner.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs`;
                }
            } else {
                rank = 'Pendiente';
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
            };
        });
    });
    
    return history;
  }
};
