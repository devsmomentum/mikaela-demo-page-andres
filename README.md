# Mikaela - La Pollita Millonaria (Demo Page)

Este proyecto es una demostración de la página web para la lotería "Mikaela - La Pollita Millonaria". Actualmente, la aplicación funciona con datos simulados (mock data), pero está arquitecturada para conectarse fácilmente a una API REST real.

## 🚀 Guía de Integración de API

La aplicación utiliza un patrón de servicio centralizado para manejar todas las peticiones de datos. Toda la lógica de comunicación con el backend se encuentra en:

📂 `src/services/lottery-api.ts`

### 🔄 Cómo conectar con el Backend Real

Actualmente, el servicio `lotteryApi` simula respuestas asíncronas (`Promise` con `setTimeout`) devolviendo datos estáticos. Para conectar con tu API real, debes modificar los métodos dentro de este archivo.

#### Pasos para la migración:

1.  Abre `src/services/lottery-api.ts`.
2.  Localiza los métodos `getResults` y `getSpecialGameHistory`.
3.  Reemplaza el código de simulación con llamadas `fetch` o `axios`.

**Ejemplo de migración:**

```typescript
// ANTES (Mock)
getResults: async (params: GetResultsPayload) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_RESULTS.find(r => r.date === params.date);
}

// DESPUÉS (Real)
getResults: async (params: GetResultsPayload) => {
  const response = await fetch(`${API_URL}/results?date=${params.date}`);
  if (!response.ok) throw new Error('Error al obtener resultados');
  return await response.json();
}
```

---

## 📡 Documentación de Endpoints y Estructuras de Datos

A continuación se detallan los métodos disponibles en el servicio y los formatos de datos (Payloads y Responses) que el backend debe respetar.

### 1. Obtener Resultados Diarios (`getResults`)

Obtiene los resultados de los sorteos ordinarios y extraordinarios para una fecha específica.

*   **Método:** `lotteryApi.getResults(payload)`
*   **Endpoint Sugerido:** `GET /api/results`

#### 📥 Payload (Request)

```typescript
interface GetResultsPayload {
  date: string; // Formato: "YYYY-MM-DD" (Ej: "2024-11-19")
  type?: 'ordinario' | 'extraordinario'; // Opcional
}
```

#### 📤 Response (Expected Data)

El backend debe devolver un objeto con la estructura `DailyResults`:

```typescript
interface DailyResults {
  date: string; // "YYYY-MM-DD"
  ordinary: OrdinaryResult[];
  extraordinary: ExtraordinaryResult;
}

interface OrdinaryResult {
  time: string;        // Ej: "10:00 AM"
  figureNumber: number; // 1-40
}

interface ExtraordinaryResult {
  figures: number[];   // Array de 6 números
}
```

---

### 2. Historial Juego Especial (`getSpecialGameHistory`)

Obtiene el resultado histórico del juego "Pollo Lleno" (Sorteo Mensual) para un mes y año específicos.

*   **Método:** `lotteryApi.getSpecialGameHistory(payload)`
*   **Endpoint Sugerido:** `GET /api/special-game/history`

#### 📥 Payload (Request)

```typescript
interface GetSpecialGameHistoryPayload {
  year: number;  // Ej: 2024
  month: number; // 0-11 (0 = Enero, 11 = Diciembre)
}
```

#### 📤 Response (Expected Data)

El backend debe devolver un objeto con la estructura `SpecialGameResult` o `null` si no hay sorteo:

```typescript
interface SpecialGameResult {
  dateObj: Date;          // Objeto fecha del sorteo
  dateFormatted: string;  // Ej: "27 de Octubre, 2024"
  figures: number[];      // Array de 6 números ganadores
  ticketSerial: string;   // Serial del ticket ganador o "Vacante"
  prize: string;          // Monto del premio (Ej: "$50,000")
  status: 'Ganador' | 'Vacante';
}
```

---

## 🌍 Configuración de Entorno

Para conectar la aplicación con tu backend real, se recomienda utilizar variables de entorno.

1.  Crea un archivo `.env` en la raíz del proyecto.
2.  Define la URL base de tu API:

```env
VITE_API_URL=https://api.tudominio.com
```

3.  Actualiza `src/services/lottery-api.ts` para usar esta variable:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 🗄️ Integración con Base de Datos (Sugerencia)

Para persistir los datos de los sorteos, se sugiere el siguiente esquema de base de datos (ejemplo en SQL), diseñado para cumplir con las interfaces de TypeScript definidas en el proyecto.

### Tabla: `daily_draws` (Sorteos Diarios)
Almacena la información general del día.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID/INT | Identificador único |
| `date` | DATE | Fecha del sorteo (YYYY-MM-DD) |
| `created_at` | TIMESTAMP | Fecha de creación |

### Tabla: `ordinary_results` (Resultados Ordinarios)
Relacionado con `daily_draws`. Almacena los resultados de cada hora.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID/INT | Identificador único |
| `draw_id` | FK | Referencia a `daily_draws` |
| `time` | VARCHAR | Hora del sorteo (Ej: "10:00 AM") |
| `figure_number` | INT | Número ganador (1-40) |

### Tabla: `extraordinary_results` (Resultados Extraordinarios)
Relacionado con `daily_draws`. Almacena los 6 números ganadores.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID/INT | Identificador único |
| `draw_id` | FK | Referencia a `daily_draws` |
| `figures` | JSON/ARRAY | Array de números: `[5, 12, 33, ...]` |

### Tabla: `special_games` (Juego Especial Mensual)
Almacena los resultados del "Pollo Lleno".

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID/INT | Identificador único |
| `draw_date` | DATE | Fecha del sorteo |
| `figures` | JSON/ARRAY | Array de 6 números ganadores |
| `ticket_serial` | VARCHAR | Serial ganador o NULL si vacante |
| `prize_amount` | DECIMAL | Monto del premio |
| `status` | ENUM | 'Ganador' o 'Vacante' |

---

## 🛠️ Instalación y Ejecución

Para ejecutar este proyecto localmente:

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

3.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📁 Estructura del Proyecto Relevante

*   `src/components/ResultsSection.tsx`: Componente que consume `getResults`.
*   `src/components/SpecialGame.tsx`: Componente que consume `getSpecialGameHistory`.
*   `src/services/lottery-api.ts`: **Archivo principal de configuración de API.**
*   `src/lib/lottery-data.ts`: Definiciones de tipos y datos estáticos de figuras.

