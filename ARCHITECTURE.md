# Arquitectura y Detalle del Proyecto - GM Propiedades Frontend

## Visión General

Este documento describe la arquitectura completa del frontend MVP1 de GM Propiedades: diagramas, flujos de datos, estructura de componentes, integración con backend, patrones de diseño, troubleshooting y referencia de API.

---

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
│                    (Navegador Web)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   NEXT.JS FRONTEND                               │
│                   (localhost:3000)                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    APP ROUTER                             │  │
│  │                                                           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │  │
│  │  │  Home   │  │ Buscar  │  │Publicar │  │ Detalle  │   │  │
│  │  │   /     │  │ /buscar │  │/publicar│  │/prop/[id]│   │  │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘   │  │
│  │       │            │            │            │          │  │
│  └───────┼────────────┼────────────┼────────────┼──────────┘  │
│          │            │            │            │              │
│  ┌───────▼────────────▼────────────▼────────────▼──────────┐  │
│  │              COMPONENTS LAYER                            │  │
│  │                                                           │  │
│  │  ┌──────────────┐         ┌──────────────┐             │  │
│  │  │PropertyCard  │         │SearchFilters │             │  │
│  │  └──────────────┘         └──────────────┘             │  │
│  └───────────────────────────────────────────────────────────┘  │
│          │                                                       │
│  ┌───────▼───────────────────────────────────────────────────┐  │
│  │                   LIB LAYER                                │  │
│  │                                                            │  │
│  │  ┌─────────────────┐      ┌──────────────────┐          │  │
│  │  │   api.ts        │      │  constants.ts    │          │  │
│  │  │                 │      │                  │          │  │
│  │  │ • getProperties │      │ • PROPERTY_TYPES │          │  │
│  │  │ • getProperty   │      │ • CURRENCIES     │          │  │
│  │  │ • createProperty│      │ • DEFAULT_OWNER  │          │  │
│  │  │ • createQuote   │      │                  │          │  │
│  │  │ • formatPrice   │      │                  │          │  │
│  │  └────────┬────────┘      └──────────────────┘          │  │
│  └───────────┼───────────────────────────────────────────────┘  │
│              │                                                   │
└──────────────┼───────────────────────────────────────────────────┘
               │
               │ REST API (fetch)
               │
┌──────────────▼───────────────────────────────────────────────────┐
│                   FASTAPI BACKEND                                 │
│                   (localhost:8000)                                │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    API ENDPOINTS                            │  │
│  │                                                             │  │
│  │  GET    /api/v1/properties/          → List properties     │  │
│  │  GET    /api/v1/properties/{id}      → Get property        │  │
│  │  POST   /api/v1/properties/          → Create property     │  │
│  │  POST   /api/v1/quotes/              → Create quote        │  │
│  │  GET    /api/v1/amenities/           → List amenities      │  │
│  │                                                             │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
│                            │                                       │
│  ┌─────────────────────────▼───────────────────────────────────┐  │
│  │                   DATABASE LAYER                            │  │
│  │                                                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │Properties│  │  Quotes  │  │ Comunas  │  │Amenities │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  │                                                             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Flujos de Datos

### 1. Ver Propiedades (Home)

```
Usuario → Home Page → getProperties() → Backend API → Database
                                                          ↓
Usuario ← PropertyCard[] ← Properties[] ← JSON Response ←┘
```

### 2. Buscar Propiedades

```
Usuario → Formulario de Búsqueda
           ↓
        Aplicar Filtros
           ↓
        createQuote() → Backend → Guardar Quote en DB
           ↓
        getProperties(filters) → Backend → Filtrar en DB
           ↓
        Mostrar Resultados
```

### 3. Publicar Propiedad

```
Usuario → Formulario de Publicación
           ↓
        Completar Campos (incl. Ubicación Jerárquica y Amenities)
           ↓
        Validar Datos
           ↓
        createProperty() → Backend → Insertar en DB
           ↓
        Redireccionar a Detalle (2 segundos)
```

### 4. Ver Detalle

```
Usuario → Click en Propiedad
           ↓
        getProperty(id) → Backend → Query DB
           ↓
        Mostrar Información Completa
```

---

## Estructura de Archivos

```
gm-frontend/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Layout global
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Estilos globales
│   │   │
│   │   ├── buscar/
│   │   │   └── page.tsx             # Search page (Client Component)
│   │   │
│   │   ├── publicar/
│   │   │   └── page.tsx             # Publish page (Client Component)
│   │   │
│   │   └── propiedades/
│   │       └── [id]/
│   │           └── page.tsx         # Detail page (Server Component)
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── PropertyCard.tsx         # Tarjeta de propiedad
│   │   └── SearchFilters.tsx        # Filtros de búsqueda
│   │
│   └── lib/                          # Lógica de negocio
│       ├── api.ts                   # Cliente API + tipos
│       └── constants.ts             # Constantes
│
├── public/                           # Archivos estáticos
│
├── .env.local                        # Variables de entorno
├── .env.local.example               # Ejemplo de variables
├── .gitignore                       # Git ignore
├── next.config.ts                   # Configuración Next.js
├── tsconfig.json                    # Configuración TypeScript
├── tailwind.config.ts               # Configuración Tailwind
├── postcss.config.mjs               # Configuración PostCSS
└── package.json                     # Dependencias
```

---

## Jerarquía de Componentes

```
App
├── Layout (global)
│   ├── Header
│   │   ├── Logo (Link to /)
│   │   └── Navigation
│   │       ├── Buscar (Link to /buscar)
│   │       └── Publicar (Link to /publicar)
│   │
│   ├── Main Content (children)
│   │   │
│   │   ├── Home Page (/)
│   │   │   ├── Hero Section
│   │   │   ├── Properties Grid
│   │   │   │   └── PropertyCard (x12)
│   │   │   └── CTA Button
│   │   │
│   │   ├── Search Page (/buscar)
│   │   │   ├── Search Form
│   │   │   │   ├── Type Select
│   │   │   │   ├── Price Inputs
│   │   │   │   ├── Rooms Inputs
│   │   │   │   └── Action Buttons
│   │   │   └── Results Grid
│   │   │       └── PropertyCard (xN)
│   │   │
│   │   ├── Publish Page (/publicar)
│   │   │   └── Property Form
│   │   │       ├── Basic Info Section
│   │   │       ├── Price Section
│   │   │       ├── Characteristics Section
│   │   │       ├── Location Section (Hierarchical Selector)
│   │   │       ├── Amenities Section (Checkbox Grid)
│   │   │       └── Submit Buttons
│   │   │
│   │   └── Detail Page (/propiedades/[id])
│   │       ├── Breadcrumb
│   │       ├── Header Section
│   │       ├── Key Features Grid
│   │       ├── Description Section
│   │       ├── Features Section
│   │       ├── Amenities Section
│   │       └── Contact Section
│   │
│   └── Footer
```

---

## Integración API

### Configuración

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Endpoints Utilizados

| Método | Endpoint | Función | Usado en |
|--------|----------|---------|----------|
| GET | `/api/v1/properties/` | `getProperties()` | Home, Search |
| GET | `/api/v1/properties/{id}` | `getProperty()` | Detail |
| POST | `/api/v1/properties/` | `createProperty()` | Publish |
| POST | `/api/v1/quotes/` | `createQuote()` | Search |
| GET | `/api/v1/amenities/` | `getAmenities()` | Publish |

### Endpoints Requeridos (Backend Pendiente v2.0)

```
GET /api/v1/locations/regions/
GET /api/v1/locations/regions/{id}/provinces/
GET /api/v1/locations/provinces/{id}/comunas/
```

Además, `POST /api/v1/properties/` debe aceptar el campo `amenity_keys: string[]`.

### Tipos de Datos TypeScript

**Property**:
```typescript
interface Property {
  id: string;                    // UUID
  title: string;
  description?: string;
  property_type: string;
  status: string;
  price: number;
  currency: string;
  m2_construidos?: number;
  m2_totales?: number;
  dormitorios?: number;
  banos?: number;
  estacionamientos?: number;
  direccion?: string;
  barrio?: string;
  comuna_id: number;
  comuna?: {
    id: number;
    name: string;
    province?: {
      name: string;
      region?: { name: string };
    };
  };
  features?: Record<string, any>;
  amenity_keys?: string[];
  lat?: number;
  lon?: number;
  owner_id: string;              // UUID
  created_at?: string;
  updated_at?: string;
}
```

**PropertyCreate**:
Similar a `Property` pero sin `id`, `created_at`, `updated_at`.

**QuoteCreate** (usado en búsqueda):
```typescript
interface QuoteCreate {
  created_by: string;            // UUID
  desired_property_type?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  min_dormitorios?: number;
  min_banos?: number;
  min_m2?: number;
  max_m2?: number;
  min_estacionamientos?: number;
  lat?: number;
  lon?: number;
  max_distance_km?: number;
  preferred_comunas?: string[];
  preferred_barrios?: string[];
  required_amenities?: string[];
  optional_amenities?: string[];
  numero_familia?: number;
  weights?: Record<string, number>;
  desired_features?: Record<string, any>;
}
```

**Amenity**:
```typescript
interface Amenity {
  key: string;
  label: string;
  description?: string;
  category?: string;
}
```

### Utilidades del API Client

```typescript
// Formato de precio
formatPrice(250000000, 'CLP') // "$250.000.000"

// Label de tipo de propiedad
getPropertyTypeLabel('casa') // "Casa"
getPropertyTypeLabel('departamento') // "Departamento"
```

---

## API Reference y Ejemplos

### Properties

#### Create Property
```bash
POST /api/v1/properties/
Content-Type: application/json

{
  "owner_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Hermosa Casa en Las Condes",
  "description": "Casa moderna de 3 pisos con excelente ubicación",
  "property_type": "casa",
  "status": "activo",
  "price": 450000000,
  "currency": "CLP",
  "m2_totales": 250,
  "m2_construidos": 180,
  "dormitorios": 4,
  "banos": 3,
  "estacionamientos": 2,
  "condominio": true,
  "direccion": "Av. Apoquindo 5678, Las Condes",
  "lat": -33.4084,
  "lon": -70.5754,
  "comuna_id": 1,
  "barrio": "El Golf",
  "material_construccion": "hormigon",
  "material_ventanas": "pvc",
  "cubierta": "teja",
  "features": {
    "orientacion": "norte",
    "antiguedad": 5,
    "pisos": 3,
    "calefaccion": "central"
  },
  "amenity_keys": ["piscina", "gimnasio", "seguridad_24h"]
}
```

#### Get Property
```bash
GET /api/v1/properties/{id}
```

#### List Properties
```bash
GET /api/v1/properties/?property_type=casa&min_price=200000000&max_price=300000000
```

#### Update Property
```bash
PUT /api/v1/properties/{id}
Content-Type: application/json

{
  "price": 260000000,
  "status": "reservado"
}
```

#### Delete Property
```bash
DELETE /api/v1/properties/{id}
```

### Quotes

#### Create Quote
```bash
POST /api/v1/quotes/
Content-Type: application/json

{
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "desired_property_type": "casa",
  "min_price": 200000000,
  "max_price": 500000000,
  "currency": "CLP",
  "min_dormitorios": 3,
  "min_banos": 2,
  "lat": -33.4084,
  "lon": -70.5754,
  "max_distance_km": 5,
  "preferred_comunas": ["Las Condes", "Vitacura", "Lo Barnechea"],
  "required_amenities": ["piscina", "seguridad_24h"],
  "optional_amenities": ["gimnasio", "salon_eventos"],
  "numero_familia": 4,
  "weights": {
    "price_weight": 0.3,
    "location_weight": 0.25,
    "size_weight": 0.2,
    "rooms_weight": 0.15,
    "amenities_weight": 0.1
  }
}
```

### Amenities

#### Create Amenity
```bash
POST /api/v1/amenities/
Content-Type: application/json

{
  "key": "piscina",
  "label": "Piscina",
  "description": "Piscina temperada disponible todo el año",
  "category": "recreacion"
}
```

#### List Amenities
```bash
GET /api/v1/amenities/
```

### System

#### Health Check
```bash
GET /health
```

**Respuesta esperada**:
```json
{
  "status": "healthy",
  "database": "connected",
  "app": "GM Real Estate API",
  "version": "1.0.0"
}
```

### Filtros Comunes

| Recurso | Filtros |
|---------|---------|
| Properties | `property_type`, `min_price`, `max_price`, `min_dormitorios`, `max_dormitorios`, `comuna_id`, `status`, `skip`, `limit` |
| Quotes | `property_type`, `skip`, `limit` |

### Tipos de Propiedad Válidos
- `casa`, `departamento`, `parcela`, `oficina`, `local_comercial`, `bodega`, `sitio`

### Estados Válidos
- `activo`, `vendido`, `reservado`, `inactivo`

### Monedas Válidas
- `CLP`, `USD`, `UF`

### Materiales de Construcción
- `hormigon`, `ladrillo`, `madera`, `metalica`, `mixta`, `adobe`, `otro`

### Materiales de Ventanas
- `aluminio`, `pvc`, `madera`, `termopanel`, `otro`

### Tipos de Cubierta
- `teja`, `zinc`, `losa`, `pizarreno`, `otro`

### Códigos de Respuesta
- `200 OK` - Éxito
- `201 Created` - Recurso creado
- `400 Bad Request` - Input inválido
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Error de validación
- `500 Internal Server Error` - Error del servidor

---

## Capa de Presentación

### Tailwind CSS

```
Utility Classes → Componentes → Páginas
```

**Ejemplo**:
```tsx
// Utility classes
<button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">

// Componente
<PropertyCard property={property} />

// Página
<Home />
```

### Responsive Design

```
Mobile First Approach

Base styles (móvil)
  ↓
sm: (640px) → Tablet pequeña
  ↓
md: (768px) → Tablet
  ↓
lg: (1024px) → Desktop
```

---

## Estado y Datos

### Server Components (RSC)
- **Home page** (`/`)
- **Detail page** (`/propiedades/[id]`)

**Características**:
- Fetch en el servidor
- No hay estado del cliente
- SEO optimizado

### Client Components
- **Search page** (`/buscar`)
- **Publish page** (`/publicar`)

**Características**:
- Estado con `useState`
- Interactividad con `useEffect`
- Formularios controlados

---

## Flujo de Navegación

```
                    ┌─────────┐
                    │  Home   │
                    │   /     │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Buscar  │    │Publicar │    │ Detalle │
    │ /buscar │    │/publicar│    │/prop/[id]│
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
         │               └───────┬───────┘
         │                       │
         └───────────────────────▼
                           ┌─────────┐
                           │ Detalle │
                           │/prop/[id]│
                           └─────────┘
```

**Rutas principales**:
1. Home → Buscar → Detalle
2. Home → Publicar → Detalle (después de crear)
3. Home → Detalle (click en propiedad)
4. Buscar → Detalle (click en resultado)

---

## Seguridad

### Actual (MVP1)
- CORS configurado en backend
- Validación de tipos en TypeScript
- Sanitización básica de inputs (HTML5)
- Sin autenticación (MVP1 usa UUID fijo)
- Sin autorización

### MVP2
- JWT tokens
- Protected routes
- User sessions
- CSRF protection
- Rate limiting

---

## Escalabilidad y Preparación MVP2

**Autenticación**:
```typescript
// Reemplazar
const DEFAULT_OWNER_ID = '123e4567...';
// Por
const { user } = useAuth();
const owner_id = user.id;
```

**Tracking de Eventos**:
```typescript
useEffect(() => {
  trackPageView('/propiedades/123');
}, []);
```

**Estado Global**:
```typescript
// Context API o Zustand
const { properties, loading } = useProperties();
```

---

## Patrones de Diseño

1. **Component Composition**: `<PropertyCard property={property} />`
2. **Server-Side Rendering**: Server Components hacen fetch directo
3. **Client-Side State**: `'use client'` + `useState` / `useEffect`
4. **API Client Pattern**: Lógica centralizada en `lib/api.ts`
5. **Type Safety**: Tipos completos en TypeScript

---

## Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- Páginas: `page.tsx`

### Nombres de Funciones
- Componentes: `PascalCase`
- Funciones: `camelCase`
- API calls: `verbNoun` (getProperties, createProperty)

### Estilos
- Tailwind utility classes
- Mobile-first
- Consistent spacing

---

## Troubleshooting Detallado

### Error: "Property not found" después de crear

**Síntoma**: La propiedad se crea correctamente (status 200) pero al redirigir muestra "Propiedad no encontrada". La URL tiene UUID.

**Causa**: El backend usa UUIDs (strings) como IDs.

**Solución**: El frontend ya está corregido para manejar IDs como strings y respuestas paginadas con estructura `{items: [...]}`.

---

### Error: "properties.map is not a function"

**Síntoma**:
```
TypeError: properties.map is not a function
```

**Causa**: El backend no está devolviendo un array, o no está ejecutándose.

**Soluciones**:

1. **Verificar Backend**:
   ```bash
   curl http://localhost:8000/health
   ```
   Si no responde:
   ```bash
   uvicorn app.main:app --reload
   ```

2. **Verificar Endpoint**:
   ```bash
   curl http://localhost:8000/api/v1/properties/
   ```
   Debe devolver un array JSON `[]` o `{items: [...]}`.

3. **Verificar CORS**:
   El backend debe incluir:
   ```python
   allow_origins=["http://localhost:3000"]
   ```

4. **Verificar Variables de Entorno**:
   Archivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   Después de cambiar: reiniciar Next.js (`Ctrl+C`, `npm run dev`).

5. **Limpiar Caché**:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Error: "Failed to fetch properties"

**Causa**: No se puede conectar al backend.

**Soluciones**:
1. Verificar URL del backend en `.env.local`
2. Verificar que el backend esté en el puerto 8000
3. Probar conexión: `curl http://localhost:8000/api/v1/properties/`

---

### Error: "comuna_id not found"

**Causa**: El ID de comuna no existe en la base de datos.

**Solución**: Verificar comunas disponibles en la base de datos:
```sql
SELECT id, name FROM comunas LIMIT 10;
```

---

### Error de TypeScript

**Síntoma**: `Type error: Property 'X' does not exist on type 'Y'`

**Solución**:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

### Página en Blanco

**Causa**: Error de JavaScript no capturado.

**Solución**:
1. Abrir DevTools (F12)
2. Ver Console - Buscar errores en rojo
3. Ver Network - Verificar llamadas API

**Errores comunes**:
- 404: Backend no encontrado
- 500: Error en el backend
- CORS: Problema de permisos

---

### No se Muestran Propiedades

**Causa**: Base de datos vacía.

**Solución**: Crear propiedades de prueba.

**Opción 1** - Usar Swagger:
1. Abre http://localhost:8000/docs
2. Ve a `POST /api/v1/properties/`
3. Click en "Try it out"
4. Usa el ejemplo JSON de la sección API Reference arriba
5. Click en "Execute"

**Opción 2** - Usar curl:
```bash
curl -X POST http://localhost:8000/api/v1/properties/ \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Hermosa Casa en Las Condes",
    "description": "Casa moderna con jardín",
    "property_type": "casa",
    "price": 250000000,
    "currency": "CLP",
    "m2_construidos": 150,
    "dormitorios": 4,
    "banos": 3,
    "estacionamientos": 2,
    "comuna_id": 1,
    "direccion": "Av. Apoquindo 1234"
  }'
```

---

### Errores Específicos del Backend

#### "Table 'comunas' doesn't exist"
**Solución**: Ejecutar migraciones
```bash
alembic upgrade head
```

#### "Connection refused"
**Solución**: Verificar PostgreSQL
```bash
# Windows
sc query postgresql
# Mac
brew services list | grep postgresql
# Linux
systemctl status postgresql
```

#### "Authentication failed"
**Solución**: Verificar credenciales en `.env` del backend
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## Checklist de Diagnóstico

Cuando algo no funciona, verifica en orden:

- [ ] Backend está ejecutándose (puerto 8000)
- [ ] Base de datos está conectada
- [ ] `.env.local` está configurado correctamente
- [ ] CORS está configurado en el backend
- [ ] Frontend está ejecutándose (puerto 3000)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del backend

---

## Comandos Útiles

### Verificar Estado
```bash
# Backend
curl http://localhost:8000/health

# Propiedades
curl http://localhost:8000/api/v1/properties/

# Frontend
curl http://localhost:3000
```

### Reiniciar Todo
```bash
# Backend
uvicorn app.main:app --reload

# Frontend
rm -rf .next
npm run dev
```

### Ver Logs
- Backend: Terminal donde se ejecuta uvicorn
- Frontend: Terminal donde se ejecuta `npm run dev`
- Navegador: F12 → Console

---

## Validaciones a Considerar

### Properties
- `price` > 0
- `m2_construidos` > 0
- `dormitorios`, `banos`, `estacionamientos` >= 0
- `lat` entre -90 y 90
- `lon` entre -180 y 180
- `amenity_keys` deben existir en la tabla de amenities

### Quotes
- `max_price` >= `min_price`
- `max_m2` >= `min_m2`
- Valores numéricos positivos > 0
- `required_amenities` y `optional_amenities` deben existir

### Amenities
- `key` debe ser único
- `key` y `label` son obligatorios

---

## Dependencias

### Producción
- `next`: Framework
- `react`: UI library
- `react-dom`: React renderer

### Desarrollo
- `typescript`: Type checking
- `tailwindcss`: Styling
- `eslint`: Linting

**Total: 6 dependencias principales**

---

## Notas para MVP2

### Funcionalidades Pendientes

1. **Autenticación**: Reemplazar `DEFAULT_OWNER_ID` con user ID real, agregar login/registro, proteger rutas.
2. **Tracking de Eventos**: Analytics, guardar visitas, tracking de tiempo en página.
3. **Endpoints de Ubicación**: Implementar en backend `GET /api/v1/locations/regions/`, provincias y comunas.
4. **Imágenes**: Upload de fotos, galería en detalle, thumbnails en cards.
5. **Favoritos**: Botón "Guardar" funcional, lista de favoritos del usuario.
6. **Matching Inteligente**: Usar endpoint `/api/v1/matching/quote/{quote_id}`, mostrar propiedades recomendadas.

### Refactorings Sugeridos

1. **Componente de Layout**: Extraer header/footer a componentes reutilizables.
2. **Hooks Personalizados**: `useProperties()`, `useSearch()`, `useAuth()`.
3. **Validación de Formularios**: Usar `react-hook-form`.
4. **Estado Global**: Context API o Zustand.

---

**Para más detalles, consulta**:
- [README.md](README.md) - Documentación principal
- [QUICK_START.md](QUICK_START.md) - Inicio rápido
- [AGENTS.md](AGENTS.md) - Guía para agentes

---

**Última actualización**: Mayo 2026
