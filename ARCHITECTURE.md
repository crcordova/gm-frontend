# 🏗️ Arquitectura MVP1 - GM Propiedades Frontend

## 📊 Diagrama de Arquitectura

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
               │ REST API
               │ (fetch)
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

## 🔄 Flujo de Datos

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
        Completar Campos
           ↓
        Validar Datos
           ↓
        createProperty() → Backend → Insertar en DB
           ↓
        Redireccionar a Detalle
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

## 📦 Estructura de Componentes

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
│   │   │       ├── Location Section
│   │   │       ├── Additional Options Section
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

## 🗂️ Estructura de Archivos

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
│   └── *.svg                        # Iconos
│
├── .env.local                        # Variables de entorno
├── .env.local.example               # Ejemplo de variables
├── .gitignore                       # Git ignore
├── next.config.ts                   # Configuración Next.js
├── tsconfig.json                    # Configuración TypeScript
├── tailwind.config.ts               # Configuración Tailwind
├── postcss.config.mjs               # Configuración PostCSS
├── package.json                     # Dependencias
│
└── Documentación/
    ├── README.md                    # Documentación principal
    ├── MVP1_GUIDE.md                # Guía completa
    ├── MVP1_SUMMARY.md              # Resumen ejecutivo
    ├── QUICK_START.md               # Inicio rápido
    ├── TESTING_CHECKLIST.md         # Checklist de testing
    ├── ARCHITECTURE.md              # Este archivo
    ├── API_DOCUMENTATION.md         # Docs del backend
    ├── API_QUICK_REFERENCE.md       # Referencia rápida
    └── SWAGGER_POST_EXAMPLES.md     # Ejemplos de JSON
```

---

## 🔌 Integración API

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

### Tipos de Datos

```typescript
// Request
PropertyCreate {
  owner_id: string
  title: string
  property_type: string
  price: number
  comuna_id: number
  // ... más campos
}

// Response
Property {
  id: number
  title: string
  price: number
  comuna: {
    name: string
    province: {
      name: string
      region: {
        name: string
      }
    }
  }
  // ... más campos
}
```

---

## 🎨 Capa de Presentación

### Tailwind CSS

```
Utility Classes → Componentes → Páginas
```

**Ejemplo**:
```tsx
// Utility classes
<button className="px-6 py-2 bg-blue-600 text-white rounded-md">

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

## 🔄 Estado y Datos

### Server Components (RSC)
- Home page (`/`)
- Detail page (`/propiedades/[id]`)

**Características**:
- Fetch en el servidor
- No hay estado del cliente
- SEO optimizado

### Client Components
- Search page (`/buscar`)
- Publish page (`/publicar`)

**Características**:
- Estado con `useState`
- Interactividad con `useEffect`
- Formularios controlados

---

## 🚀 Flujo de Navegación

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

**Rutas**:
1. Home → Buscar → Detalle
2. Home → Publicar → Detalle (después de crear)
3. Home → Detalle (click en propiedad)
4. Buscar → Detalle (click en resultado)

---

## 📊 Flujo de Datos Detallado

### Ejemplo: Crear Propiedad

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Usuario completa formulario                               │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 2. Click en "Publicar Propiedad"                             │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 3. Validación en el cliente                                  │
│    - Campos obligatorios                                     │
│    - Tipos de datos                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 4. createProperty(formData)                                  │
│    - Construir objeto PropertyCreate                         │
│    - Agregar DEFAULT_OWNER_ID                                │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 5. POST /api/v1/properties/                                  │
│    - Headers: Content-Type: application/json                │
│    - Body: JSON.stringify(data)                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 6. Backend procesa request                                   │
│    - Validación de schema                                    │
│    - Verificar comuna_id existe                              │
│    - Insertar en database                                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 7. Response 201 Created                                      │
│    - Property object con ID                                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 8. Frontend procesa response                                 │
│    - Mostrar mensaje de éxito                                │
│    - Guardar property.id                                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 9. Redirección (2 segundos)                                  │
│    - router.push(`/propiedades/${property.id}`)              │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 10. Mostrar detalle de la propiedad creada                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Seguridad (MVP1)

### Actual
- ✅ CORS configurado en backend
- ✅ Validación de tipos en TypeScript
- ✅ Sanitización básica de inputs (HTML5)
- ⚠️ Sin autenticación (MVP1)
- ⚠️ Sin autorización (MVP1)

### MVP2
- 🔜 JWT tokens
- 🔜 Protected routes
- 🔜 User sessions
- 🔜 CSRF protection
- 🔜 Rate limiting

---

## 📈 Escalabilidad

### Preparado para MVP2

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
// Agregar en cada página
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

## 🎯 Patrones de Diseño

### 1. Component Composition
```tsx
<PropertyCard property={property} />
```

### 2. Server-Side Rendering
```tsx
// Server Component
export default async function Home() {
  const properties = await getProperties();
  return <div>{properties.map(...)}</div>;
}
```

### 3. Client-Side State
```tsx
// Client Component
'use client';
const [properties, setProperties] = useState([]);
```

### 4. API Client Pattern
```typescript
// Centralizado en lib/api.ts
export async function getProperties() { ... }
```

### 5. Type Safety
```typescript
// Tipos completos en TypeScript
interface Property { ... }
```

---

## 📝 Convenciones de Código

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

## 🔄 Ciclo de Vida

### Server Component
```
Request → Fetch Data → Render HTML → Send to Client
```

### Client Component
```
Mount → useState → useEffect → Render → Update → Re-render
```

---

## 📚 Dependencias

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

## 🎉 Conclusión

Esta arquitectura es:
- ✅ **Modular**: Componentes reutilizables
- ✅ **Escalable**: Preparada para MVP2
- ✅ **Type-safe**: TypeScript en todo
- ✅ **Performante**: SSR + RSC
- ✅ **Mantenible**: Código limpio y documentado

---

**Para más detalles, consulta**:
- [MVP1_GUIDE.md](MVP1_GUIDE.md) - Guía completa
- [README.md](README.md) - Documentación principal
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Backend API
