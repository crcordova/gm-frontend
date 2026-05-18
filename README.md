# GM Propiedades - Frontend MVP1

Frontend moderno para el marketplace inmobiliario chileno **GM Propiedades**. Construido con Next.js 16, React 19 y TypeScript.

## 🎯 Características MVP1

- ✅ **Página de Inicio**: Muestra propiedades destacadas con navegación intuitiva
- ✅ **Búsqueda Avanzada**: Filtros por tipo, precio, dormitorios y más
- ✅ **Publicar Propiedad**: Formulario completo para crear nuevas propiedades
- ✅ **Detalle de Propiedad**: Vista completa con todas las características
- ✅ **Creación de Quotes**: Cada búsqueda genera automáticamente una cotización
- ✅ **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- ✅ **Interfaz en Español**: Todo el contenido en español chileno

## 🏗️ Arquitectura

### Estructura Modular
```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página de inicio
│   ├── buscar/            # Página de búsqueda
│   ├── publicar/          # Formulario de publicación
│   └── propiedades/[id]/  # Detalle de propiedad
├── components/            # Componentes reutilizables
│   ├── PropertyCard.tsx   # Tarjeta de propiedad
│   └── SearchFilters.tsx  # Filtros de búsqueda
└── lib/                   # Lógica de negocio
    ├── api.ts            # Cliente API y tipos
    └── constants.ts      # Constantes de la aplicación
```

### Preparado para MVP2
El código está estructurado para facilitar la implementación de:
- 🔐 Sistema de autenticación de usuarios
- 📊 Tracking de eventos web (visitas a propiedades)
- 💾 Gestión de sesiones
- ⭐ Favoritos y guardados
- 📧 Sistema de notificaciones

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+ instalado
- Backend de GM Propiedades ejecutándose en `http://localhost:8000`
- npm o yarn

### Instalación

1. **Clonar e instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.local.example .env.local
```

Edita `.env.local` si tu backend está en otra URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Ejecutar el servidor de desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

## 📡 Integración con Backend

### Endpoints Utilizados

#### Propiedades
- `GET /api/v1/properties/` - Listar propiedades con filtros
- `GET /api/v1/properties/{id}` - Obtener detalle de propiedad
- `POST /api/v1/properties/` - Crear nueva propiedad

#### Quotes (Búsquedas)
- `POST /api/v1/quotes/` - Crear cotización desde búsqueda

### Tipos TypeScript
Todos los tipos están definidos en `src/lib/api.ts` y coinciden con los schemas del backend.

## 🎨 Páginas Principales

### 1. Inicio (`/`)
- Hero section con llamado a la acción
- Grid de propiedades destacadas (últimas 12)
- Navegación a búsqueda y publicación
- Manejo de errores si el backend no está disponible

### 2. Buscar (`/buscar`)
- Filtros: tipo de propiedad, rango de precio, dormitorios, baños
- Resultados en tiempo real
- Creación automática de quote por cada búsqueda
- Contador de resultados

### 3. Publicar (`/publicar`)
- Formulario completo con validación
- **Selector jerárquico de ubicación**: Región → Provincia → Comuna (v2.0)
- **Selector de amenities**: Checkboxes múltiples con descripción (v2.0)
- Campos obligatorios: título, tipo, precio, ubicación completa
- Campos opcionales: descripción, características, materiales, amenities
- Redirección automática al detalle tras crear

**Nota**: El selector jerárquico requiere endpoints del backend. Ver `BACKEND_ENDPOINTS_NEEDED.md`.

### 4. Detalle (`/propiedades/[id]`)
- Información completa de la propiedad
- Características destacadas en cards
- Amenidades y features adicionales
- Sección de contacto (preparada para MVP2)

## 🔧 Configuración

### Owner ID Temporal
Para MVP1, se usa un UUID fijo definido en `src/lib/constants.ts`:
```typescript
export const DEFAULT_OWNER_ID = '123e4567-e89b-12d3-a456-426614174000';
```

En MVP2, esto será reemplazado por el ID del usuario autenticado.

### Tipos de Propiedad
```typescript
casa, departamento, parcela, oficina, 
local_comercial, bodega, sitio
```

### Monedas Soportadas
```typescript
CLP (Peso Chileno), USD (Dólar), UF (Unidad de Fomento)
```

## 🎯 Funcionalidades Clave

### Búsqueda con Quote
Cada vez que un usuario realiza una búsqueda, se crea automáticamente un "quote" (cotización) en el backend. Esto permite:
- Tracking de búsquedas populares
- Análisis de demanda
- Preparación para matching inteligente (MVP2)

### Filtros Disponibles
- **Tipo de propiedad**: Casa, departamento, parcela, etc.
- **Rango de precio**: Mínimo y máximo en CLP
- **Dormitorios mínimos**: Filtro numérico
- **Baños mínimos**: Filtro numérico (solo en búsqueda avanzada)

### Validaciones
- Campos obligatorios marcados con asterisco rojo
- Validación de tipos numéricos
- Mensajes de error claros en español
- Feedback visual de éxito/error

## 🎨 Diseño y UX

### Paleta de Colores
- **Primary**: Blue-600 (#2563eb)
- **Background**: Gray-50 (#f9fafb)
- **Text**: Gray-900 (#111827)
- **Success**: Green-600
- **Error**: Red-600

### Componentes Reutilizables
- `PropertyCard`: Tarjeta de propiedad con hover effects
- `SearchFilters`: Formulario de filtros (preparado para expansión)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid adaptativo: 1 columna (móvil) → 3 columnas (desktop)

## 📝 Notas Importantes

### Selector de Ubicación (v2.0)
✅ **Implementado en frontend**: Selector jerárquico Región → Provincia → Comuna
⚠️ **Pendiente en backend**: Endpoints de ubicación

El formulario de publicar ahora incluye un selector jerárquico que:
- Carga regiones automáticamente
- Carga provincias al seleccionar región
- Carga comunas al seleccionar provincia
- Valida la selección completa

**Para que funcione completamente**, el backend debe implementar:
```
GET /api/v1/locations/regions/
GET /api/v1/locations/regions/{id}/provinces/
GET /api/v1/locations/provinces/{id}/comunas/
```

Ver `BACKEND_ENDPOINTS_NEEDED.md` para la guía completa de implementación.

### Amenities (v2.0)
✅ **Implementado**: Selector múltiple con checkboxes
✅ **Backend compatible**: Endpoint `GET /api/v1/amenities/` ya existe

El formulario permite seleccionar múltiples amenities que se envían como:
```json
{
  "amenity_keys": ["seguridad_24h", "piscina", "estacionamiento_visitas"]
}
```

### Sin Autenticación (MVP1)
- No hay login/registro de usuarios
- Se usa un UUID fijo para `owner_id` y `created_by`
- Todas las propiedades son públicas

### Imágenes
Las imágenes de propiedades no están implementadas en MVP1. Para MVP2:
- Upload de múltiples imágenes
- Integración con Cloudinary o S3
- Galería de fotos en detalle

## 🚧 Próximos Pasos (MVP2)

1. **Autenticación**
   - Login/registro de usuarios
   - Sesiones con JWT
   - Perfil de usuario

2. **Tracking de Eventos**
   - Analytics de visitas a propiedades
   - Tiempo de permanencia
   - Clicks y conversiones

3. **Matching Inteligente**
   - Algoritmo de recomendaciones
   - Notificaciones de nuevas propiedades
   - Score de compatibilidad

4. **Funcionalidades Sociales**
   - Favoritos
   - Compartir propiedades
   - Comentarios y valoraciones

## 🐛 Troubleshooting

### Error: "Failed to fetch properties"
- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Revisa la consola del backend para errores
- Confirma que la base de datos tenga datos

### Error: "Property not found"
- Asegúrate de que el ID de la propiedad exista
- Verifica que el backend esté respondiendo correctamente

### Error al crear propiedad
- Revisa que todos los campos obligatorios estén completos
- Verifica que el `comuna_id` exista en la base de datos
- Consulta los logs del backend para más detalles

## 📚 Documentación Relacionada

- [API Documentation](API_DOCUMENTATION.md) - Documentación completa del backend
- [API Quick Reference](API_QUICK_REFERENCE.md) - Referencia rápida de endpoints
- [Swagger Examples](SWAGGER_POST_EXAMPLES.md) - Ejemplos de JSON para testing

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

## 📄 Licencia

Proyecto privado - GM Propiedades © 2025

---

**Desarrollado con ❤️ para el mercado inmobiliario chileno**
