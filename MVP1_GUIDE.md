# 🚀 Guía MVP1 - GM Propiedades Frontend

## 📋 Resumen Ejecutivo

MVP1 es un frontend completamente funcional para el marketplace inmobiliario chileno. Permite a los usuarios:
- Ver propiedades disponibles
- Buscar con filtros avanzados
- Publicar nuevas propiedades
- Ver detalles completos de cada propiedad

**Estado**: ✅ Listo para desarrollo
**Tecnologías**: Next.js 16, React 19, TypeScript, Tailwind CSS
**Backend**: FastAPI (http://localhost:8000)

---

## 🎯 Funcionalidades Implementadas

### 1. Página de Inicio (`/`)
**Ruta**: `src/app/page.tsx`

**Características**:
- Header con navegación (Buscar, Publicar)
- Hero section con llamado a la acción
- Grid de propiedades destacadas (últimas 12)
- Manejo de errores si backend no disponible
- Footer informativo

**Componentes usados**:
- `PropertyCard` - Tarjeta individual de propiedad

**API Calls**:
```typescript
getProperties({ limit: 12 })
```

---

### 2. Búsqueda Avanzada (`/buscar`)
**Ruta**: `src/app/buscar/page.tsx`

**Características**:
- Formulario de filtros con 5 campos:
  - Tipo de propiedad (select)
  - Precio mínimo (number)
  - Precio máximo (number)
  - Dormitorios mínimos (number)
  - Baños mínimos (number)
- Botones: Buscar y Limpiar
- Creación automática de quote por cada búsqueda
- Contador de resultados
- Grid responsive de resultados

**Flujo de búsqueda**:
1. Usuario completa filtros
2. Click en "Buscar"
3. Se crea un quote en el backend (tracking)
4. Se obtienen propiedades filtradas
5. Se muestran resultados

**API Calls**:
```typescript
// Crear quote (tracking)
createQuote({
  created_by: DEFAULT_OWNER_ID,
  desired_property_type: propertyType,
  min_price: minPrice,
  max_price: maxPrice,
  min_dormitorios: minDormitorios,
  min_banos: minBanos,
  currency: 'CLP'
})

// Obtener propiedades
getProperties({
  property_type: propertyType,
  min_price: minPrice,
  max_price: maxPrice,
  min_dormitorios: minDormitorios
})
```

**Nota importante**: Los quotes NO usan `lat` y `lon` como se especificó en los requisitos.

---

### 3. Publicar Propiedad (`/publicar`)
**Ruta**: `src/app/publicar/page.tsx`

**Características**:
- Formulario completo con 5 secciones:
  1. **Información Básica**: título, descripción, tipo, estado
  2. **Precio**: precio, moneda
  3. **Características**: m², dormitorios, baños, estacionamientos
  4. **Ubicación**: dirección, región/provincia/comuna (jerárquico), barrio
  5. **Opciones Adicionales**: materiales, condominio
  6. **Amenities**: selector múltiple con checkboxes

**Campos obligatorios** (marcados con *):
- Título
- Tipo de propiedad
- Precio
- Región, Provincia, Comuna (selector jerárquico)

**Selector Jerárquico de Ubicación** (Nuevo en v2.0):
- **Paso 1**: Usuario selecciona Región → Se cargan Provincias
- **Paso 2**: Usuario selecciona Provincia → Se cargan Comunas
- **Paso 3**: Usuario selecciona Comuna → Se guarda `comuna_id`
- **Validación**: Selectores dependientes deshabilitados hasta seleccionar padre
- **Mensajes**: Ayuda contextual ("Primero selecciona una región")

**Selector de Amenities** (Nuevo en v2.0):
- Grid responsive de checkboxes (1/2/3 columnas)
- Muestra label, descripción y categoría
- Contador de amenities seleccionados
- Resumen visual de selección
- Se envía como `amenity_keys: ["seguridad_24h", "piscina"]`

**Validaciones**:
- Campos numéricos con min="0"
- Campos requeridos con HTML5 validation
- Mensajes de error claros en español
- Validación de ubicación completa

**Flujo de publicación**:
1. Usuario completa formulario
2. Selecciona ubicación (Región → Provincia → Comuna)
3. Selecciona amenities (opcional)
4. Click en "Publicar Propiedad"
5. Validación de campos
6. POST al backend con `amenity_keys`
7. Mensaje de éxito
8. Redirección automática a detalle (2 segundos)

**API Calls**:
```typescript
// Cargar datos para selectores
const regions = await getRegions();
const provinces = await getProvincesByRegion(regionId);
const comunas = await getComunasByProvince(provinceId);
const amenities = await getAmenities();

// Crear propiedad
createProperty({
  owner_id: DEFAULT_OWNER_ID,
  title: "...",
  property_type: "casa",
  price: 250000000,
  comuna_id: 14,  // Obtenido del selector
  amenity_keys: ["seguridad_24h", "piscina"],  // Nuevo
  // ... otros campos
})
```

**Estado del Backend**:
⚠️ **Requiere implementación de endpoints**:
- `GET /api/v1/locations/regions/`
- `GET /api/v1/locations/regions/{id}/provinces/`
- `GET /api/v1/locations/provinces/{id}/comunas/`
- `POST /api/v1/properties/` debe aceptar `amenity_keys`

Ver `BACKEND_ENDPOINTS_NEEDED.md` para detalles de implementación.

**Manejo de Errores**:
- Si endpoints no existen: Muestra mensaje claro indicando qué falta
- Permite usar formulario sin selectores jerárquicos (fallback)
- Amenities opcionales: No bloquea si endpoint falla

**Owner ID temporal**: Se usa `123e4567-e89b-12d3-a456-426614174000` para MVP1.

---

### 4. Detalle de Propiedad (`/propiedades/[id]`)
**Ruta**: `src/app/propiedades/[id]/page.tsx`

**Características**:
- Breadcrumb de navegación
- Header con título, ubicación y precio
- Cards con características principales (m², dormitorios, baños, etc.)
- Descripción completa
- Features adicionales (JSONB)
- Amenidades
- Sección de contacto (preparada para MVP2)
- Botón "Volver a la búsqueda"

**Manejo de errores**:
- Propiedad no encontrada → mensaje + botón volver
- Error de backend → mensaje descriptivo

**API Calls**:
```typescript
getProperty(id)
```

---

## 🏗️ Arquitectura del Código

### Estructura de Carpetas
```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Inicio
│   ├── layout.tsx           # Layout global
│   ├── globals.css          # Estilos globales
│   ├── buscar/
│   │   └── page.tsx         # Búsqueda
│   ├── publicar/
│   │   └── page.tsx         # Publicar
│   └── propiedades/
│       └── [id]/
│           └── page.tsx     # Detalle
├── components/
│   ├── PropertyCard.tsx     # Tarjeta de propiedad
│   └── SearchFilters.tsx    # Filtros (no usado actualmente)
└── lib/
    ├── api.ts              # Cliente API + tipos
    └── constants.ts        # Constantes
```

### Componentes Clave

#### `PropertyCard.tsx`
Componente reutilizable para mostrar propiedades en grids.

**Props**:
```typescript
interface PropertyCardProps {
  property: Property;
}
```

**Características**:
- Link a detalle
- Título (line-clamp-2)
- Ubicación (comuna + barrio)
- Precio destacado
- Tipo de propiedad
- Descripción (line-clamp-2)
- Iconos: dormitorios, baños, m², estacionamientos
- Badge de estado (si no es "activo")
- Hover effect con shadow

---

### API Client (`lib/api.ts`)

#### Tipos TypeScript

**Property**:
```typescript
interface Property {
  id: number;
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
      region?: {
        name: string;
      };
    };
  };
  features?: Record<string, any>;
  amenity_keys?: string[];
  lat?: number;
  lon?: number;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}
```

**PropertyCreate**:
Similar a Property pero sin `id`, `created_at`, `updated_at`.

**Quote** y **QuoteCreate**:
Para tracking de búsquedas.

#### Funciones API

**getProperties(filters?)**:
```typescript
const properties = await getProperties({
  property_type: 'casa',
  min_price: 100000000,
  max_price: 300000000,
  min_dormitorios: 3,
  limit: 50
});
```

**getProperty(id)**:
```typescript
const property = await getProperty(123);
```

**createProperty(data)**:
```typescript
const newProperty = await createProperty({
  owner_id: DEFAULT_OWNER_ID,
  title: "Casa en Las Condes",
  property_type: "casa",
  price: 250000000,
  comuna_id: 123
});
```

**createQuote(data)**:
```typescript
const quote = await createQuote({
  created_by: DEFAULT_OWNER_ID,
  desired_property_type: "casa",
  min_price: 200000000,
  max_price: 300000000
});
```

#### Utilidades

**formatPrice(price, currency)**:
```typescript
formatPrice(250000000, 'CLP') // "$250.000.000"
```

**getPropertyTypeLabel(type)**:
```typescript
getPropertyTypeLabel('casa') // "Casa"
getPropertyTypeLabel('departamento') // "Departamento"
```

---

### Constantes (`lib/constants.ts`)

**PROPERTY_TYPES**:
```typescript
[
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'parcela', label: 'Parcela' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'local_comercial', label: 'Local Comercial' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'sitio', label: 'Sitio' }
]
```

**CURRENCIES**:
```typescript
[
  { value: 'CLP', label: 'Peso Chileno (CLP)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'UF', label: 'Unidad de Fomento (UF)' }
]
```

**DEFAULT_OWNER_ID**:
```typescript
'123e4567-e89b-12d3-a456-426614174000'
```

---

## 🎨 Diseño y Estilos

### Tailwind CSS
Todos los estilos usan Tailwind CSS v4 con PostCSS.

### Paleta de Colores
- **Primary**: `blue-600` (#2563eb)
- **Primary Hover**: `blue-700`
- **Background**: `gray-50` (#f9fafb)
- **Card Background**: `white`
- **Text Primary**: `gray-900`
- **Text Secondary**: `gray-600`
- **Text Muted**: `gray-500`
- **Success**: `green-600`, `green-50` (bg)
- **Error**: `red-600`, `red-50` (bg)
- **Warning**: `yellow-600`, `yellow-50` (bg)

### Componentes de UI

**Botón Primary**:
```tsx
<button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
  Texto
</button>
```

**Botón Secondary**:
```tsx
<button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium">
  Texto
</button>
```

**Input**:
```tsx
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

**Card**:
```tsx
<div className="bg-white p-6 rounded-lg shadow-md">
  {/* contenido */}
</div>
```

### Responsive Breakpoints
- **sm**: 640px (móvil grande)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)

**Grid responsive**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🔧 Configuración

### Variables de Entorno

**`.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Producción**:
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Next.js Config

**`next.config.ts`**:
Configuración por defecto de Next.js 16.

### TypeScript Config

**`tsconfig.json`**:
Configuración estándar con paths alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🚀 Deployment

### Desarrollo Local
```bash
npm install
npm run dev
```

### Build de Producción
```bash
npm run build
npm run start
```

### Vercel (Recomendado)
1. Push a GitHub
2. Conectar repositorio en Vercel
3. Configurar variable de entorno `NEXT_PUBLIC_API_URL`
4. Deploy automático

---

## 🧪 Testing Manual

### Checklist de Pruebas

#### Página de Inicio
- [ ] Se cargan las propiedades
- [ ] Se muestran correctamente en el grid
- [ ] Los links funcionan
- [ ] Manejo de error si backend no disponible
- [ ] Responsive en móvil

#### Búsqueda
- [ ] Filtros funcionan correctamente
- [ ] Se crea quote al buscar
- [ ] Resultados se actualizan
- [ ] Botón "Limpiar" resetea filtros
- [ ] Mensaje cuando no hay resultados

#### Publicar
- [ ] Validación de campos obligatorios
- [ ] Se crea la propiedad
- [ ] Redirección al detalle
- [ ] Mensajes de error claros
- [ ] Todos los campos se envían correctamente

#### Detalle
- [ ] Se muestra toda la información
- [ ] Breadcrumb funciona
- [ ] Manejo de propiedad no encontrada
- [ ] Botón "Volver" funciona

---

## 🐛 Problemas Conocidos y Soluciones

### 1. "Failed to fetch properties"
**Causa**: Backend no está ejecutándose o no es accesible.

**Solución**:
```bash
# En el directorio del backend
uvicorn app.main:app --reload
```

### 2. "Property not found"
**Causa**: ID de propiedad no existe en la base de datos.

**Solución**: Verifica que el ID sea correcto o crea propiedades de prueba.

### 3. Error al crear propiedad: "comuna_id not found"
**Causa**: El comuna_id no existe en la base de datos.

**Solución**: Usa un comuna_id válido. Consulta la tabla `comunas` en la base de datos.

### 4. CORS Error
**Causa**: Backend no permite requests desde localhost:3000.

**Solución**: Verifica la configuración de CORS en el backend:
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 Notas para MVP2

### Funcionalidades Pendientes

1. **Autenticación**
   - Reemplazar `DEFAULT_OWNER_ID` con user ID real
   - Agregar login/registro
   - Proteger rutas de publicación

2. **Tracking de Eventos**
   - Implementar analytics
   - Guardar visitas a propiedades
   - Tracking de tiempo en página

3. **Endpoints de Ubicación** ⚠️ **PRIORITARIO**
   - Implementar `GET /api/v1/locations/regions/`
   - Implementar `GET /api/v1/locations/regions/{id}/provinces/`
   - Implementar `GET /api/v1/locations/provinces/{id}/comunas/`
   - Modificar `POST /api/v1/properties/` para aceptar `amenity_keys`
   - Ver `BACKEND_ENDPOINTS_NEEDED.md` para detalles completos

4. **Imágenes**
   - Upload de fotos
   - Galería en detalle
   - Thumbnails en cards

5. **Favoritos**
   - Botón "Guardar" funcional
   - Lista de favoritos del usuario
   - Persistencia en backend

6. **Matching Inteligente**
   - Usar endpoint `/api/v1/matching/quote/{quote_id}`
   - Mostrar propiedades recomendadas
   - Score de compatibilidad

### Refactorings Sugeridos

1. **Componente de Layout**
   - Extraer header/footer a componentes
   - Layout compartido para todas las páginas

2. **Hooks Personalizados**
   - `useProperties()` - Manejo de estado de propiedades
   - `useSearch()` - Lógica de búsqueda
   - `useAuth()` - Autenticación (MVP2)

3. **Validación de Formularios**
   - Usar librería como `react-hook-form`
   - Validación más robusta
   - Mensajes de error mejorados

4. **Estado Global**
   - Context API o Zustand para estado compartido
   - Caché de propiedades
   - Filtros persistentes

---

## 📚 Recursos

### Documentación
- [API Documentation](API_DOCUMENTATION.md)
- [API Quick Reference](API_QUICK_REFERENCE.md)
- [Swagger Examples](SWAGGER_POST_EXAMPLES.md)

### Tecnologías
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## ✅ Checklist de Entrega MVP1

- [x] Página de inicio funcional
- [x] Búsqueda con filtros
- [x] Creación de quotes automática
- [x] Formulario de publicación completo
- [x] Detalle de propiedad
- [x] Diseño responsive
- [x] Manejo de errores
- [x] Tipos TypeScript completos
- [x] README actualizado
- [x] Variables de entorno configuradas
- [x] Código modular y preparado para MVP2

---

**MVP1 está listo para desarrollo y testing** 🎉

Para cualquier duda, consulta la documentación del backend o los archivos de ejemplo.
