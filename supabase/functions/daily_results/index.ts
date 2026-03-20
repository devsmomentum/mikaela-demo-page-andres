import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
      case "GET_RESULTS": {
        const date = payload?.date;
        if (!date) {
          return new Response(
            JSON.stringify({ error: "date is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabaseAdmin
          .from("daily_results")
          .select("id, result_date, lotteries:lottery_id(draw_time), prizes:prize_id(animal_number, animal_name)")
          .eq("result_date", date)
          .order("created_at", { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify(data ?? []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "GET_SETTINGS": {
        const { data, error } = await supabaseAdmin
          .from("game_settings")
          .select("*")
          .limit(1)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data ?? {}), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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
