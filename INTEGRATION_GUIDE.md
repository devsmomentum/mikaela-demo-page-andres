# Guía de Integración Backend - Lotería Mikaela

Este documento detalla los pasos técnicos y el código necesario para conectar el frontend de "Mikaela La Pollita Millonaria" con una base de datos real en Supabase.

## 1. Diseño de Base de Datos (SQL Script)

Copia y ejecuta este script en el **SQL Editor** de tu proyecto en Supabase. Esto creará las tablas necesarias para manejar la configuración del juego, los sorteos y los tickets.

```sql
-- 1. Tabla de Configuración Global (Maneja precios, potes y textos de premios)
-- Esta tabla evita tener valores "hardcoded" en el frontend.
CREATE TABLE public.game_settings (
    id INT PRIMARY KEY DEFAULT 1,
    default_pot DECIMAL(12,2) NOT NULL DEFAULT 15450.00, -- Monto base del pote
    current_jackpot DECIMAL(12,2) NOT NULL DEFAULT 20000.00, -- Pote actual (Pollo Lleno)
    hero_initial_pot DECIMAL(12,2) NOT NULL DEFAULT 12500.00, -- Pote inicial para animaciones
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 5.00, -- Precio por ticket
    special_prize_label_1 TEXT DEFAULT '$50,000', -- Texto premio especial 1
    special_prize_label_2 TEXT DEFAULT '$45,000', -- Texto premio especial 2
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar la configuración inicial (Solo debe existir una fila con ID 1)
INSERT INTO public.game_settings (id, default_pot, current_jackpot)
VALUES (1, 15450.00, 20000.00);

-- Restricción para asegurar que solo exista una fila de configuración
ALTER TABLE public.game_settings ADD CONSTRAINT single_row_check CHECK (id = 1);

-- 2. Tabla de Sorteos (Draws)
-- Almacena los resultados históricos y del día.
CREATE TABLE public.draws (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    draw_date DATE NOT NULL,
    draw_type TEXT NOT NULL CHECK (draw_type IN ('ordinario', 'extraordinario')),
    draw_time TIME, -- Solo relevante para sorteos ordinarios (ej: '10:00:00')
    winning_figures INTEGER[] DEFAULT '{}', -- Array de números ganadores (ej: [5] o [1,2,3,4,5,6])
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas por fecha (usado en ResultsSection)
CREATE INDEX idx_draws_date ON public.draws(draw_date);

-- 3. Tabla de Tickets (Jugadas)
-- Almacena cada ticket vendido.
CREATE TABLE public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_serial TEXT NOT NULL, -- Ej: "T-1005"
    figures INTEGER[] NOT NULL, -- Los números jugados por el usuario
    draw_id UUID REFERENCES public.draws(id), -- (Opcional) Relación con un sorteo específico
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'winner', 'loser')),
    prize_amount DECIMAL(12,2), -- Monto ganado si es winner
    match_count INTEGER DEFAULT 0, -- Cantidad de aciertos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Realtime para que el Dashboard se actualice en vivo
-- Esto permite escuchar eventos INSERT/UPDATE desde el frontend
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.game_settings;
```

## 2. Implementación de Servicios (`services/lottery-api.ts`)

A continuación se muestra el código TypeScript que debe reemplazar los comentarios `// TODO` en el archivo `lottery-api.ts`.

### A. Función `getGameSettings()`
Obtiene la configuración monetaria dinámica.

```typescript
getGameSettings: async (): Promise<GameSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('game_settings')
      .select('*')
      .single();

    if (error) throw error;

    return {
      defaultPot: data.default_pot,
      currentJackpot: data.current_jackpot,
      heroInitialPot: data.hero_initial_pot,
      specialPrizes: {
        prize1: data.special_prize_label_1,
        prize2: data.special_prize_label_2
      },
      pricing: {
        ticketPrice: data.ticket_price
      }
    };
  } catch (error) {
    console.error('[LotteryAPI] Error fetching settings:', error);
    return null;
  }
}
```

### B. Función `getResults(date)`
Busca resultados de un día específico y los agrupa por tipo.

```typescript
getResults: async (date: string): Promise<DailyResults | null> => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('draw_date', date);

    if (error) throw error;

    const ordinary: OrdinaryResult[] = [];
    let extraordinary: ExtraordinaryResult = { figures: [] };

    data.forEach(draw => {
      if (draw.draw_type === 'ordinario') {
        // Formatear hora simple de '10:00:00' a '10:00 AM'
        // Nota: Se recomienda usar date-fns para esto en producción
        const [hours, minutes] = draw.draw_time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const timeFormatted = `${hour12}:${minutes} ${ampm}`;

        ordinary.push({
          time: timeFormatted,
          figureNumber: draw.winning_figures[0] 
        });
      } else if (draw.draw_type === 'extraordinario') {
        extraordinary = { figures: draw.winning_figures };
      }
    });

    // Ordenar resultados ordinarios por hora si es necesario
    ordinary.sort((a, b) => new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime());

    return { date, ordinary, extraordinary };
  } catch (error) {
    console.error('[LotteryAPI] Error fetching results:', error);
    return null;
  }
}
```

### C. Función `getRecentTickets(limit)`
Para alimentar el feed de "Últimas Jugadas".

```typescript
getRecentTickets: async (limit: number = 5): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(t => ({
    id: t.id,
    ticketNumber: t.ticket_serial,
    figures: t.figures,
    date: t.created_at,
    status: t.status,
    prize: t.prize_amount ? `${t.prize_amount} Bs` : undefined
  }));
}
```

## 3. Implementación de Realtime (`LiveDashboardSection.tsx`)

Para que el Dashboard muestre tickets entrando en vivo y actualizaciones del pote sin recargar la página.

Ubica el `useEffect` comentado en `LiveDashboardSection.tsx` y usa este código:

```typescript
useEffect(() => {
  // 1. Crear canal de suscripción
  const channel = supabase
    .channel('live-dashboard')
    
    // Escuchar nuevos tickets (INSERT en tabla tickets)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'tickets' },
      (payload) => {
        const newTicketRaw = payload.new;
        
        // Mapear datos crudos a la interfaz Ticket del frontend
        const newTicket: Ticket = {
            id: newTicketRaw.id,
            ticketNumber: newTicketRaw.ticket_serial,
            figures: newTicketRaw.figures,
            date: newTicketRaw.created_at,
            status: newTicketRaw.status
        };

        // Actualizar el feed visual (agregamos al principio, mantenemos máx 5)
        setFeed(prev => [newTicket, ...prev.slice(0, 4)]);
        
        // Actualizar contador de tickets vendidos visualmente
        setMetrics(prev => ({ ...prev, ticketsSold: prev.ticketsSold + 1 }));
      }
    )

    // Escuchar cambios en el Pote (UPDATE en game_settings)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'game_settings' },
      (payload) => {
        const newSettings = payload.new;
        // Actualizar el monto del pote en vivo
        setMetrics(prev => ({ ...prev, pote: newSettings.current_jackpot }));
      }
    )
    .subscribe();

  // Limpieza de suscripción al desmontar el componente
  return () => {
    supabase.removeChannel(channel);
  }
}, [])
```

## 4. Configuración de Seguridad (RLS)

Es crítico configurar esto en el panel de Supabase (**Authentication -> Policies**) para proteger la data.

*   **Lectura Pública (SELECT):**
    Crea una política en `game_settings`, `draws` y `tickets` que permita SELECT al rol `anon` (público) y `authenticated`.
    *   Ejemplo: `Enable read access for all users` -> `true`.

*   **Escritura Restringida (INSERT/UPDATE):**
    **NO** permitas escritura pública.
    Solo el rol `service_role` (backend administrativo) o usuarios autenticados con rol de admin deben poder crear sorteos o modificar el pote.

## 5. Variables de Entorno

Asegúrate de tener un archivo `.env` en la raíz de tu proyecto React con las credenciales de tu proyecto Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-larga
```
