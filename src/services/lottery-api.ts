import { supabase } from '@/lib/supabase';

// --- INTERFACES ---
// Estas definen cómo se ven los datos en tu aplicación React
export interface OrdinaryResult {
  time: string;
  figureNumber: number;
}

export interface ExtraordinaryResult {
  figures: number[];
}

export interface DailyResults {
  date: string;
  ordinary: OrdinaryResult[];
  extraordinary: ExtraordinaryResult;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  figures: number[];
  date: string;
  status: 'pending' | 'winner' | 'loser';
  matchCount?: number;
  prize?: string;
}

export interface LotteryMetrics {
  pote: number;
  ticketsSold: number;
  lastWinner?: string;
}

export interface GameSettings {
  defaultPot: number;
  currentJackpot: number;
  heroInitialPot: number;
  specialPrizes: {
    prize1: string;
    prize2: string;
  };
  pricing: {
    ticketPrice: number;
  };
}

export interface GetHistoryParams {
  page: number;
  pageSize: number;
  date?: string;
  search?: string;
  filterType?: 'todos' | 'ganadores';
}

// --- UTILIDADES ---
const formatPostgresTimeToAMPM = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  const hStr = h < 10 ? `0${h}` : h;
  return `${hStr}:${minutes} ${ampm}`;
};

// --- SERVICIO API ---

export const lotteryApi = {
  /**
   * 1. OBTENER RESULTADOS
   * Seguridad: El frontend solo envía la fecha. No puede modificar nada.
   */
  getResults: async ({ date }: { date: string }): Promise<DailyResults | null> => {
    try {
      console.log(`[LotteryAPI] Fetching results via Edge Function: daily_results`);

      // Llamamos a tu endpoint: .../functions/v1/daily_results
      const { data, error } = await supabase.functions.invoke('daily_results', {
        body: { 
          action: 'GET_RESULTS', 
          payload: { date } 
        }
      });

      if (error) {
        console.error('[LotteryAPI] Error invoke:', error);
        throw error;
      }

      // Si la respuesta está vacía o mal formada
      if (!data || !Array.isArray(data)) {
        return {
          date,
          ordinary: [],
          extraordinary: { figures: [] }
        };
      }

      // Transformamos los datos (Backend snake_case -> Frontend clean format)
      const ordinaryResults: OrdinaryResult[] = data.map((item: any) => ({
        time: formatPostgresTimeToAMPM(item.lotteries?.draw_time || '00:00'),
        figureNumber: parseInt(item.prizes?.animal_number || '0', 10)
      }));

      return {
        date,
        ordinary: ordinaryResults,
        extraordinary: { figures: [] }
      };

    } catch (error) {
      console.error('[LotteryAPI] Critical Error in getResults:', error);
      return null;
    }
  },

  /**
   * 2. OBTENER CONFIGURACIÓN (POTES, PRECIOS)
   * Seguridad: Solo lectura. Los valores monetarios vienen firmados del servidor.
   */
  getGameSettings: async (): Promise<GameSettings | null> => {
    try {
      // Reutilizamos la misma función 'daily_results' pero con otra acción
      const { data, error } = await supabase.functions.invoke('daily_results', {
        body: { 
          action: 'GET_SETTINGS', 
          payload: {} 
        }
      });

      if (error) throw error;
      if (!data) return null;

      // Mapeamos los nombres de la base de datos a tu interfaz de React
      return {
        defaultPot: data.default_pot,
        currentJackpot: data.current_jackpot,
        heroInitialPot: data.animation_base_pot,
        specialPrizes: { 
            prize1: data.prize_text_1, 
            prize2: data.prize_text_2  
        },
        pricing: { ticketPrice: data.ticket_price }
      };

    } catch (error) {
      console.error('[LotteryAPI] Error settings:', error);
      return null;
    }
  },

  // ... (El resto de las funciones como getCurrentMetrics, etc. pueden quedar igual
  // o migrarse de la misma forma si también necesitan datos sensibles)
  getCurrentMetrics: async (): Promise<LotteryMetrics> => {
      return { pote: 0, ticketsSold: 0 };
  },

  getRecentTickets: async (limit: number = 5): Promise<Ticket[]> => {
      return [];
  },

  getTicketHistory: async (params: GetHistoryParams) => {
      return { data: [], total: 0, page: 1, totalPages: 0 };
  }
};