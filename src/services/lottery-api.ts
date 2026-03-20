import { supabase } from '@/lib/supabase';

// --- INTERFACES ---

export interface LotteryMetrics {
  pote: number;
  amountPotRaw: number;
  ticketsSold: number;
}

export interface RecentTicket {
  id: string;
  numbers: number[];
  created_at: string;
  key_gamble: string;
}

export interface PolloLlenoResult {
  id: number;
  numbers: number[];
  result_date: string;
  created_at: string;
}

export interface HistoryTicket {
  id: string;
  bets_id: string;
  numbers: number[];
  status: string;
  created_at: string;
  prize: number;
  amount: number;
  key_gamble: string;
}

export interface GetHistoryParams {
  page: number;
  pageSize: number;
  date?: string;
  search?: string;
  filterType?: 'todos' | 'ganadores';
}

export interface HistoryResponse {
  data: HistoryTicket[];
  total: number;
  page: number;
  totalPages: number;
  winningNumbers: number[];
  pote: number;
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

// --- INTERFACES para La Pollita (ordinario) ---
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

// --- SERVICIO API ---
// La Pollita → Edge Function `daily_results`
// Pollo Lleno → Edge Function `pollo_lleno`

export const lotteryApi = {

  /**
   * Resultados de La Pollita (sorteo ordinario).
   * Usa la edge `daily_results` con GET_RESULTS (contrato original).
   * Tambien consulta `pollo_lleno` para los extraordinarios.
   */
  getResults: async ({ date }: { date: string }): Promise<DailyResults | null> => {
    try {
      // 1. Resultados ordinarios desde daily_results (contrato original)
      const { data, error } = await supabase.functions.invoke('daily_results', {
        body: { action: 'GET_RESULTS', payload: { date } }
      });
      if (error) throw error;

      const ordinaryResults: OrdinaryResult[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        time: formatPostgresTimeToAMPM(item.lotteries?.draw_time || '00:00'),
        figureNumber: parseInt(item.prizes?.animal_number || '0', 10)
      }));

      // 2. Resultados extraordinarios desde pollo_lleno
      let extraordinaryFigures: number[] = [];
      try {
        const { data: plData } = await supabase.functions.invoke('pollo_lleno_results', {
          body: { action: 'GET_RESULTS', payload: { date } }
        });
        const arr = Array.isArray(plData) ? plData : [];
        if (arr.length > 0 && arr[0]?.numbers) {
          extraordinaryFigures = arr[0].numbers.map((n: any) => Number(n));
        }
      } catch { /* sin extraordinarios, no es error */ }

      return {
        date,
        ordinary: ordinaryResults,
        extraordinary: { figures: extraordinaryFigures },
      };
    } catch (err) {
      console.error('[LotteryAPI] Error getResults:', err);
      return null;
    }
  },

  /**
   * Obtener métricas: pote (65% de amount_pot) y tickets vendidos hoy.
   */
  getMetrics: async (): Promise<LotteryMetrics> => {
    try {
      const { data, error } = await supabase.functions.invoke('pollo_lleno_results', {
        body: { action: 'GET_METRICS', payload: {} }
      });
      if (error) throw error;
      return {
        pote: data?.pote ?? 0,
        amountPotRaw: data?.amount_pot_raw ?? 0,
        ticketsSold: data?.tickets_sold ?? 0,
      };
    } catch (err) {
      console.error('[LotteryAPI] Error getMetrics:', err);
      return { pote: 0, amountPotRaw: 0, ticketsSold: 0 };
    }
  },

  /**
   * Últimos tickets ingresados (bets_item_pollo_lleno).
   */
  getRecentTickets: async (limit: number = 5): Promise<RecentTicket[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('pollo_lleno_results', {
        body: { action: 'GET_RECENT_TICKETS', payload: { limit } }
      });
      if (error) throw error;
      return (data ?? []) as RecentTicket[];
    } catch (err) {
      console.error('[LotteryAPI] Error getRecentTickets:', err);
      return [];
    }
  },

  /**
   * Números ganadores del día desde daily_results_pollo_lleno.
   */
  getPolloLlenoResults: async (date: string): Promise<PolloLlenoResult | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('pollo_lleno_results', {
        body: { action: 'GET_RESULTS', payload: { date } }
      });
      if (error) throw error;
      const arr = data as PolloLlenoResult[];
      return arr.length > 0 ? arr[0] : null;
    } catch (err) {
      console.error('[LotteryAPI] Error getPolloLlenoResults:', err);
      return null;
    }
  },

  /**
   * Historial paginado de tickets con filtros.
   */
  getHistory: async (params: GetHistoryParams): Promise<HistoryResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('pollo_lleno_results', {
        body: { action: 'GET_HISTORY', payload: params }
      });
      if (error) throw error;
      return data as HistoryResponse;
    } catch (err) {
      console.error('[LotteryAPI] Error getHistory:', err);
      return { data: [], total: 0, page: 1, totalPages: 0, winningNumbers: [], pote: 0 };
    }
  },
};