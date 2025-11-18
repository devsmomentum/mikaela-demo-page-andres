# 📋 Instrucciones para Copiar y Ejecutar en VS Code

## 🚀 Opción 1: Clonar el Repositorio (Recomendado)

Si este proyecto está en GitHub, puedes clonarlo directamente:

```bash
git clone <URL-DEL-REPOSITORIO>
cd spark-template
npm install
npm run dev
```

## 📦 Opción 2: Descargar y Copiar Manualmente

### Paso 1: Descargar los Archivos

1. **Desde GitHub:**
   - Haz clic en el botón verde "Code"
   - Selecciona "Download ZIP"
   - Extrae el archivo ZIP en tu computadora

2. **Desde este Codespace:**
   - En el explorador de archivos de VS Code (panel izquierdo)
   - Haz clic derecho en la carpeta raíz
   - Selecciona "Download"

### Paso 2: Abrir en VS Code Local

```bash
# Navega a la carpeta descargada
cd ruta/a/spark-template

# Abre VS Code en esta carpeta
code .
```

### Paso 3: Instalar Dependencias

```bash
npm install
```

### Paso 4: Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:5173`

## 📂 Estructura del Proyecto

```
spark-template/
├── src/
│   ├── App.tsx                 # Componente principal
│   ├── components/             # Componentes React
│   │   ├── NavigationHeader.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── ReglamentoSection.tsx
│   │   ├── OnlineGameSection.tsx
│   │   ├── Footer.tsx
│   │   └── ui/                 # Componentes de shadcn
│   ├── assets/                 # Imágenes, videos, etc.
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilidades
│   └── index.css               # Estilos personalizados
├── index.html                  # HTML principal
├── package.json                # Dependencias del proyecto
└── vite.config.ts              # Configuración de Vite

```

## 🔧 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
  - Descarga: https://nodejs.org/
- **npm** (viene con Node.js)
- **VS Code** (opcional pero recomendado)
  - Descarga: https://code.visualstudio.com/

### Verificar Instalación

```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
```

## 📝 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar compilación de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🎨 Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Shadcn UI** - Componentes de UI
- **Framer Motion** - Animaciones
- **Phosphor Icons** - Iconos

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Usa un puerto diferente
npm run dev -- --port 3000
```

### Problemas con tipos TypeScript
```bash
# Limpia la caché de TypeScript
rm -rf node_modules/.vite
npm run dev
```

## 📱 Probar en Dispositivos Móviles

Una vez que el servidor esté corriendo:

1. Encuentra la IP local de tu computadora
2. Accede desde tu móvil a: `http://TU-IP:5173`

### Encontrar tu IP:

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

## 🌐 Desplegar en Producción

Este proyecto puede desplegarse en:

- **Vercel** (recomendado para proyectos React)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

### Desplegar en Vercel:

```bash
npm install -g vercel
vercel
```

## 📧 Soporte

Si tienes problemas al ejecutar el proyecto:

1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta del proyecto
3. Elimina `node_modules` y vuelve a instalar
4. Revisa la consola de errores para más detalles

---

**¡Listo!** Ahora puedes desarrollar y probar el proyecto "Mikaela La Pollita Millonaria" en tu VS Code local. 🎉
