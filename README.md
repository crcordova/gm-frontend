# GM Propiedades - Frontend MVP1

Frontend moderno para el marketplace inmobiliario chileno **GM Propiedades**. Construido con **Next.js 16**, **React 19** y **TypeScript**.

## Características Principales

- **Página de Inicio**: Muestra propiedades destacadas con navegación intuitiva
- **Búsqueda Avanzada**: Filtros por tipo, precio, dormitorios y más
- **Publicar Propiedad**: Formulario completo para crear nuevas propiedades, incluyendo selector jerárquico de ubicación (Región → Provincia → Comuna) y selector de amenities
- **Detalle de Propiedad**: Vista completa con todas las características, features y amenities
- **Creación de Quotes**: Cada búsqueda genera automáticamente una cotización en el backend para tracking
- **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- **Interfaz en Español**: Todo el contenido en español chileno

## Estado del Proyecto

**MVP1: 100% Completo**

| Área | Estado |
|------|--------|
| 4 páginas funcionales | Completado |
| Integración con backend | Completado |
| Responsive design | Completado |
| TypeScript completo | Completado |
| Documentación | Completado |

## Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.2.4 | Framework React con SSR/App Router |
| React | 19.2.4 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utility-first |
| ESLint | 9.x | Linter de código |

## Estructura del Proyecto

```
gm-frontend/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── page.tsx           # Página de inicio
│   │   ├── buscar/            # Página de búsqueda
│   │   ├── publicar/          # Formulario de publicación
│   │   └── propiedades/[id]/  # Detalle de propiedad
│   ├── components/            # Componentes reutilizables
│   │   ├── PropertyCard.tsx   # Tarjeta de propiedad
│   │   └── SearchFilters.tsx  # Filtros de búsqueda
│   └── lib/                   # Lógica de negocio
│       ├── api.ts            # Cliente API y tipos
│       └── constants.ts      # Constantes de la aplicación
├── public/                    # Archivos estáticos
├── .env.local                 # Variables de entorno
├── next.config.ts             # Configuración Next.js
├── tsconfig.json              # Configuración TypeScript
├── tailwind.config.ts         # Configuración Tailwind
└── package.json               # Dependencias
```

## Páginas Principales

### 1. Inicio (`/`)
Hero section con llamado a la acción y grid de propiedades destacadas (últimas 12). Manejo de errores si el backend no está disponible.

### 2. Buscar (`/buscar`)
Filtros por tipo de propiedad, rango de precio, dormitorios y baños. Resultados en tiempo real con contador. Crea automáticamente un quote (tracking) en el backend por cada búsqueda.

### 3. Publicar (`/publicar`)
Formulario completo con validación, selector jerárquico de ubicación (v2.0) y selector de amenities (v2.0). Redirección automática al detalle tras crear la propiedad.

### 4. Detalle (`/propiedades/[id]`)
Información completa de la propiedad, características destacadas en cards, features adicionales (JSONB), amenities y sección de contacto preparada para MVP2.

## Integración con Backend

Base URL: `http://localhost:8000` (configurable en `.env.local`)

### Endpoints Utilizados

- `GET /api/v1/properties/` - Listar propiedades con filtros
- `GET /api/v1/properties/{id}` - Obtener detalle de propiedad
- `POST /api/v1/properties/` - Crear nueva propiedad
- `POST /api/v1/quotes/` - Crear cotización desde búsqueda
- `GET /api/v1/amenities/` - Listar amenities disponibles

### Configuración

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Cómo Empezar

Consulta **[QUICK_START.md](QUICK_START.md)** para ejecutar el proyecto en minutos.

## Arquitectura y Detalles Técnicos

Consulta **[ARCHITECTURE.md](ARCHITECTURE.md)** para diagramas, flujos de datos, patrones de diseño, tipos TypeScript, referencia completa de API, ejemplos de JSON y troubleshooting detallado.

## Roadmap MVP2

1. **Autenticación**: Login/registro de usuarios, sesiones con JWT, perfil de usuario
2. **Tracking de Eventos**: Analytics de visitas a propiedades, tiempo de permanencia, clicks y conversiones
3. **Imágenes**: Upload de fotos, integración con Cloudinary/S3, galería en detalle y thumbnails
4. **Matching Inteligente**: Algoritmo de recomendaciones, score de compatibilidad
5. **Funcionalidades Sociales**: Favoritos, compartir propiedades, comentarios y valoraciones

## Notas Importantes

- **Sin Autenticación (MVP1)**: Se usa un UUID fijo (`123e4567-e89b-12d3-a456-426614174000`) para `owner_id` y `created_by`. Todas las propiedades son públicas.
- **Selector de Ubicación (v2.0)**: Implementado en frontend. Requiere endpoints de backend: `GET /api/v1/locations/regions/`, `GET /api/v1/locations/regions/{id}/provinces/`, `GET /api/v1/locations/provinces/{id}/comunas/`.
- **Amenities (v2.0)**: El formulario envía `amenity_keys` al crear propiedades. El backend debe soportar este campo.
- **Imágenes**: No están implementadas en MVP1.

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

## Documentación Adicional

- **[QUICK_START.md](QUICK_START.md)** - Inicio rápido y ejecución
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura completa, API reference y troubleshooting
- **[AGENTS.md](AGENTS.md)** - Guía para agentes de desarrollo

## Licencia

Proyecto privado - GM Propiedades © 2025

---

**Desarrollado con ❤️ para el mercado inmobiliario chileno**
