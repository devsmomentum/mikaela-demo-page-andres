# Auditoría de Datos — Pollo Lleno

> Fecha: 2026-03-20  
> Objetivo: Verificar que TODOS los datos de Pollo Lleno pasan por Edge Functions y NADA se consulta directo desde el frontend.

---

## Veredicto: ✅ TODO VÍA EDGE — 0 CONSULTAS DIRECTAS

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Consultas directas a BD | ✅ NINGUNA | `supabase.from()` NO existe en `src/` |
| Datos hardcodeados | ✅ NINGUNO en uso | Solo constantes de config UI |
| Servicio centralizado | ✅ SÍ | Todo pasa por `lotteryApi` |
| Edge Functions usadas | ✅ 2 | `daily_results` (Pollita) + `pollo_lleno` (Pollo Lleno) |

---

## Arquitectura

```
Componentes React (HeroSection, LiveDashboard, Results)
         ↓
   lotteryApi (src/services/lottery-api.ts)
         ↓  supabase.functions.invoke()
   Edge Functions (Supabase — service_role key)
   ├─ daily_results/   → La Pollita
   └─ pollo_lleno/     → Pollo Lleno
         ↓
   Base de Datos (NUNCA expuesta al frontend)
   ├─ pollo_lleno_pot
   ├─ bets_item_pollo_lleno
   └─ daily_results_pollo_lleno
```

---

## Flujo de cada dato de Pollo Lleno

### 1. POTE (Monto Acumulado)

| Componente | Archivo | Línea | Método | Refresh |
|------------|---------|-------|--------|---------|
| HeroSection (PolloLlenoContent) | `src/components/HeroSection.tsx` | ~80 | `lotteryApi.getMetrics()` | 30s |
| LiveDashboardSection | `src/components/LiveDashboardSection.tsx` | ~39 | `lotteryApi.getMetrics()` | 30s |

**Cálculo server-side:** `pote = pollo_lleno_pot.amount_pot × 0.65`  
**Edge:** `pollo_lleno` → acción `GET_METRICS`  
**Tabla:** `pollo_lleno_pot`

---

### 2. TICKETS VENDIDOS HOY

| Componente | Archivo | Línea | Método | Refresh |
|------------|---------|-------|--------|---------|
| LiveDashboardSection | `src/components/LiveDashboardSection.tsx` | ~39 | `lotteryApi.getMetrics()` | 30s |

**Filtro server-side:** Hoy en hora Venezuela (UTC-4) — `toVETRange(todayVET())`  
**Edge:** `pollo_lleno` → acción `GET_METRICS`  
**Tabla:** `bets_item_pollo_lleno` (count)

---

### 3. FEED DE TICKETS RECIENTES (últimos 5)

| Componente | Archivo | Línea | Método | Refresh |
|------------|---------|-------|--------|---------|
| LiveDashboardSection | `src/components/LiveDashboardSection.tsx` | ~40 | `lotteryApi.getRecentTickets(5)` | 30s |

**Filtro server-side:** Solo hoy en hora Venezuela  
**Edge:** `pollo_lleno` → acción `GET_RECENT_TICKETS`  
**Tabla:** `bets_item_pollo_lleno`

---

### 4. NÚMEROS GANADORES DEL DÍA

| Componente | Archivo | Línea | Método | Trigger |
|------------|---------|-------|--------|---------|
| LiveDashboardSection | `src/components/LiveDashboardSection.tsx` | ~56 | `lotteryApi.getPolloLlenoResults(date)` | Cambio de fecha |
| ResultsSection (extraordinario) | `src/components/ResultsSection.tsx` | ~46 | `lotteryApi.getResults({date})` | Cambio de fecha |

**Edge:** `pollo_lleno` → acción `GET_RESULTS`  
**Tabla:** `daily_results_pollo_lleno` (columna `numbers`)

---

### 5. HISTORIAL PAGINADO DE TICKETS

| Componente | Archivo | Línea | Método | Trigger |
|------------|---------|-------|--------|---------|
| LiveDashboardSection | `src/components/LiveDashboardSection.tsx` | ~65 | `lotteryApi.getHistory(params)` | Filtros/paginación |

**Filtros server-side:** Fecha (VET), búsqueda por `key_gamble`, solo ganadores  
**Paginación server-side:** `range(offset, offset + pageSize - 1)`  
**Edge:** `pollo_lleno` → acción `GET_HISTORY`  
**Tablas:** `bets_item_pollo_lleno` + `daily_results_pollo_lleno` (winning numbers)

---

## Mapeo: Función API → Edge → Acción

| Función en `lotteryApi` | Edge Function | Acción | Tablas consultadas |
|--------------------------|---------------|--------|-------------------|
| `getMetrics()` | `pollo_lleno` | `GET_METRICS` | `pollo_lleno_pot`, `bets_item_pollo_lleno` |
| `getRecentTickets(limit)` | `pollo_lleno` | `GET_RECENT_TICKETS` | `bets_item_pollo_lleno` |
| `getPolloLlenoResults(date)` | `pollo_lleno` | `GET_RESULTS` | `daily_results_pollo_lleno` |
| `getHistory(params)` | `pollo_lleno` | `GET_HISTORY` | `bets_item_pollo_lleno`, `daily_results_pollo_lleno` |
| `getResults({date})` (parte ext.) | `pollo_lleno` | `GET_RESULTS` | `daily_results_pollo_lleno` |
| `getResults({date})` (parte ord.) | `daily_results` | `GET_RESULTS` | `daily_results`, `lotteries`, `prizes` |

---

## Verificación de seguridad

```
✅ 0 llamadas a supabase.from() en src/
✅ 0 llamadas a .select() directas en src/
✅ 0 llamadas a .insert() en src/
✅ 6 llamadas a supabase.functions.invoke() (todas en lottery-api.ts)
✅ Frontend usa anon key (solo puede invocar funciones)
✅ Edge Functions usan service_role key (acceso completo, server-side)
✅ Cálculo del pote (×0.65) se hace en edge, no en frontend
✅ Filtro de timezone (UTC-4) se hace en edge, no en frontend
✅ Paginación se hace en edge, no en frontend
✅ MOCK_RESULTS importado en ResultsSection pero NO usado como fallback activo
✅ LOTTERY_CONFIG solo contiene textos UI y reglas de display, no datos de BD
```

---

## Datos hardcodeados en `lottery-data.ts` (NO usados para Pollo Lleno)

| Constante | Valor | ¿Se usa? | Nota |
|-----------|-------|----------|------|
| `POLLO_LLENO_POT` | 25000.00 | ❌ No | Sobreescrito por fetch real |
| `DEFAULT_POT` | 15450.00 | ❌ No (La Pollita) | No aplica a Pollo Lleno |
| `MOCK_RESULTS` | `{}` vacío | ❌ No | Importado pero no como fallback |
| `LOTTERY_FIGURES` | 40 figuras | ✅ Sí (UI) | Solo metadata para display (nombre, emoji, imagen) |

---

## Comandos de deploy

```bash
supabase functions deploy daily_results   # La Pollita
supabase functions deploy pollo_lleno     # Pollo Lleno
```
