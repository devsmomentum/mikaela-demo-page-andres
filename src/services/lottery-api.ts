import { supabase } from '@/lib/supabase';

// --- INTERFACES (CONTRATO CON EL BACKEND) ---

export interface OrdinaryResult {
  time: string;       // Ej: "10:00 AM"
  figureNumber: number;
}

export interface ExtraordinaryResult {
  figures: number[];  // Array de 6 números
}

export interface DailyResults {
  date: string;       // YYYY-MM-DD
  ordinary: OrdinaryResult[];
  extraordinary: ExtraordinaryResult;
}

export interface Ticket {
  id: string;         // UUID o Serial String
  ticketNumber: string; // "T-1234"
  figures: number[];
  date: string;       // ISO Date
  status: 'pending' | 'winner' | 'loser';
  matchCount?: number;
  prize?: string;
}

export interface LotteryMetrics {
  pote: number;       // Monto actual del pote
  ticketsSold: number;// Cantidad de tickets vendidos hoy
  lastWinner?: string;// Info del último ganador (opcional)
}

// NUEVO: Interfaz para la configuración global del juego (Antes hardcoded en PRICING)
// Estos valores vendrán de la base de datos (tabla 'system_config' o similar)
export interface GameSettings {
  defaultPot: number;       // Monto base del pote (DEFAULT_POT)
  currentJackpot: number;   // Pote actual del Pollo Lleno (POLLO_LLENO_POT)
  heroInitialPot: number;   // Pote inicial para animaciones (INITIAL_HERO_POT)
  specialPrizes: {
    prize1: string;         // "$50,000" (SPECIAL_GAME_PRIZE_1)
    prize2: string;         // "$45,000" (SPECIAL_GAME_PRIZE_2)
  };
  pricing: {
    ticketPrice: number;    // Precio del ticket
  };
}

export interface GetHistoryParams {
  page: number;
  pageSize: number;
  date?: string;
  search?: string;
  filterType?: 'todos' | 'ganadores';
}

// --- SERVICIO API ---
/**
 * Función auxiliar para convertir "13:00:00" (Postgres) a "01:00 PM" (Frontend)
 * Esto es vital para que el filtro por Turno en ResultsSection siga funcionando.
 */
const formatPostgresTimeToAMPM = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // la hora '0' debe ser '12'
  const hStr = h < 10 ? `0${h}` : h;
  return `${hStr}:${minutes} ${ampm}`;
};

export const lotteryApi = {
  /**
   * Obtiene los resultados de los sorteos para una fecha específica.
   * Ahora consume datos reales de Mikaela (Sorteo Ordinario)
   */
  getResults: async ({ date }: { date: string }): Promise<DailyResults | null> => {
    try {
      console.log(`[LotteryAPI] Fetching results for ${date}...`);
      
      // Consulta con Joins para obtener la hora de la lotería y el número del premio
      const { data, error } = await supabase
        .from('daily_results')
        .select(`
          result_date,
          lotteries (
            draw_time
          ),
          prizes (
            animal_number
          )
        `)
        .eq('result_date', date);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          date,
          ordinary: [],
          extraordinary: { figures: [] }
        };
      }

      // Mapeo de la data al formato que espera ResultsSection.tsx
      const ordinaryResults: OrdinaryResult[] = data.map((item: any) => ({
        // Convertimos el draw_time de la tabla lotteries
        time: formatPostgresTimeToAMPM(item.lotteries.draw_time),
        // Convertimos el animal_number de la tabla prizes a número
        figureNumber: parseInt(item.prizes.animal_number, 10)
      }));

      // Retornamos el objeto DailyResults
      // El sorteo extraordinario se mantiene vacío por ahora según instrucciones
      return {
        date,
        ordinary: ordinaryResults,
        extraordinary: { figures: [] }
      };

    } catch (error) {
      console.error('[LotteryAPI] Error in getResults:', error);
      return null;
    }
  },

  /**
   * Obtiene la configuración global del juego (Precios, Potes base, Premios especiales).
   * Llama a esta función al iniciar la app para setear los valores monetarios.
   */
  getGameSettings: async (): Promise<GameSettings | null> => {
    try {
      console.log('[LotteryAPI] Fetching game settings...');
      
      // TODO: REEMPLAZAR CON LLAMADA REAL A SUPABASE
      // const { data, error } = await supabase.from('system_config').select('*').single();
      
      // Ejemplo de respuesta esperada que el backend debe devolver:
      /*
      return {
        defaultPot: data.default_pot, // 15450.00
        currentJackpot: data.current_jackpot, // 20000.00
        heroInitialPot: data.animation_base_pot, // 12500.00
        specialPrizes: { 
            prize1: data.prize_text_1, // "$50,000"
            prize2: data.prize_text_2  // "$45,000"
        },
        pricing: { ticketPrice: data.ticket_price }
      };
      */

      return null;
    } catch (error) {
      console.error('[LotteryAPI] Error in getGameSettings:', error);
      return null;
    }
  },

  /**
   * Obtiene las métricas en tiempo real (Pote, Tickets vendidos).
   */
  getCurrentMetrics: async (): Promise<LotteryMetrics> => {
    try {
      // TODO: REEMPLAZAR CON LLAMADA REAL A SUPABASE (Tabla game_settings o stats)
      // const { data } = await supabase.from('game_settings').select('current_pot').single();
      
      return {
        pote: 0, 
        ticketsSold: 0
      };
    } catch (error) {
      console.error('[LotteryAPI] Error in getCurrentMetrics:', error);
      return { pote: 0, ticketsSold: 0 };
    }
  },

  /**
   * Obtiene los últimos tickets vendidos para el feed en vivo.
   */
  getRecentTickets: async (limit: number = 5): Promise<Ticket[]> => {
    try {
      // TODO: REEMPLAZAR CON LLAMADA REAL A SUPABASE
      // const { data } = await supabase
      //   .from('tickets')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      //   .limit(limit);

      return [];
    } catch (error) {
      console.error('[LotteryAPI] Error in getRecentTickets:', error);
      return [];
    }
  },

  /**
   * Obtiene el historial de tickets con paginación y filtros.
   */
  getTicketHistory: async (params: GetHistoryParams) => {
    try {
      // TODO: REEMPLAZAR CON LLAMADA REAL A SUPABASE
      // Construir query dinámica basada en params.date, params.search, etc.
      
      return {
        data: [],
        total: 0,
        page: params.page,
        totalPages: 0
      };
    } catch (error) {
      console.error('[LotteryAPI] Error in getTicketHistory:', error);
      return { data: [], total: 0, page: 1, totalPages: 0 };
    }
  }
};