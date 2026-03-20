import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Venezuela es UTC-4 (sin DST). Para convertir una fecha local VET a rango UTC:
// Medianoche VET = 04:00 UTC del mismo día
// 23:59:59 VET  = 03:59:59 UTC del día siguiente
function toVETRange(dateStr: string): { start: string; end: string } {
  const d = new Date(dateStr + "T12:00:00Z");
  const nextDay = new Date(d);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const nextDayStr = nextDay.toISOString().split("T")[0];
  return {
    start: `${dateStr}T04:00:00.000Z`,
    end: `${nextDayStr}T03:59:59.999Z`,
  };
}

function todayVET(): string {
  const now = new Date();
  const vetMs = now.getTime() - 4 * 60 * 60 * 1000;
  return new Date(vetMs).toISOString().split("T")[0];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, payload } = await req.json();

    switch (action) {
      case "GET_METRICS": {
        // Pote: 65% del amount_pot más reciente
        const { data: potData, error: potError } = await supabaseAdmin
          .from("pollo_lleno_pot")
          .select("amount_pot")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (potError) throw potError;

        const amountPot = Number(potData?.amount_pot ?? 0);
        const pote = amountPot * 0.65;

        // Tickets vendidos hoy en hora Venezuela (UTC-4)
        const today = todayVET();
        const { start: dayStart, end: dayEnd } = toVETRange(today);

        const { count: ticketsSold, error: ticketsError } = await supabaseAdmin
          .from("bets_item_pollo_lleno")
          .select("id", { count: "exact", head: true })
          .gte("created_at", dayStart)
          .lte("created_at", dayEnd);

        if (ticketsError) throw ticketsError;

        return new Response(
          JSON.stringify({
            pote,
            amount_pot_raw: amountPot,
            tickets_sold: ticketsSold ?? 0,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "GET_RECENT_TICKETS": {
        const limit = payload?.limit ?? 5;

        const today = todayVET();
        const { start: dayStart, end: dayEnd } = toVETRange(today);

        const { data: tickets, error: ticketsError } = await supabaseAdmin
          .from("bets_item_pollo_lleno")
          .select("id, numbers, created_at, key_gamble")
          .gte("created_at", dayStart)
          .lte("created_at", dayEnd)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (ticketsError) throw ticketsError;

        return new Response(JSON.stringify(tickets ?? []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "GET_RESULTS": {
        // Números ganadores desde daily_results_pollo_lleno
        const date = payload?.date;
        if (!date) {
          return new Response(
            JSON.stringify({ error: "date is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: results, error: resultsError } = await supabaseAdmin
          .from("daily_results_pollo_lleno")
          .select("id, numbers, result_date, created_at")
          .eq("result_date", date)
          .order("created_at", { ascending: false })
          .limit(1);

        if (resultsError) throw resultsError;

        return new Response(JSON.stringify(results ?? []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "GET_HISTORY": {
        const { page = 1, pageSize = 8, date, search, filterType } = payload ?? {};
        const offset = (page - 1) * pageSize;

        let query = supabaseAdmin
          .from("bets_item_pollo_lleno")
          .select("id, bets_id, numbers, status, created_at, prize, amount, key_gamble", { count: "exact" });

        if (date) {
          const { start: dayStart, end: dayEnd } = toVETRange(date);
          query = query.gte("created_at", dayStart).lte("created_at", dayEnd);
        }

        if (search) {
          query = query.ilike("key_gamble", `%${search}%`);
        }

        if (filterType === "ganadores") {
          query = query.gt("prize", 0);
        }

        const { data: tickets, count, error } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (error) throw error;

        let winningNumbers: number[] = [];
        if (date) {
          const { data: results } = await supabaseAdmin
            .from("daily_results_pollo_lleno")
            .select("numbers")
            .eq("result_date", date)
            .limit(1)
            .single();

          if (results?.numbers) {
            winningNumbers = results.numbers;
          }
        }

        return new Response(
          JSON.stringify({
            data: tickets ?? [],
            total: count ?? 0,
            page,
            totalPages: Math.ceil((count ?? 0) / pageSize),
            winningNumbers,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
