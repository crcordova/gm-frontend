# Quick Start - GM Propiedades Frontend

Inicio rápido para ejecutar el proyecto localmente.

## Requisitos Previos

| Software | Versión Mínima | Verificar |
|----------|----------------|-----------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |

- Backend de GM Propiedades ejecutándose en `http://localhost:8000`
- Base de datos PostgreSQL con datos (al menos tabla `comunas`)

## Instalación en 3 Pasos

### 1. Instalar Dependencias

```bash
npm install
```

**Tiempo estimado**: 1-2 minutos.

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo (si existe)
cp .env.local.example .env.local
```

Edita `.env.local` si es necesario:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Notas**:
- Debe empezar con `NEXT_PUBLIC_` para estar disponible en el cliente.
- Cambia la URL para producción.

### 3. Iniciar el Servidor de Desarrollo

Asegúrate de que el backend esté ejecutándose:
```bash
# En el directorio del backend
uvicorn app.main:app --reload
```

Luego inicia el frontend:
```bash
npm run dev
```

**Salida esperada**:
```
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

Abre tu navegador en: **http://localhost:3000**

---

## Verificación Rápida

### Backend está funcionando?
Abre: http://localhost:8000/docs

Deberías ver la documentación de Swagger.

### Frontend está funcionando?
Abre: http://localhost:3000

Deberías ver la página de inicio de GM Propiedades con el logo, hero section y grid de propiedades (si hay datos).

---

## Prueba las Funcionalidades

### 1. Ver Propiedades
- Ve a la página de inicio (`/`)
- Deberías ver propiedades si hay datos en el backend

### 2. Buscar Propiedades
- Click en "Buscar" en el header
- Aplica filtros (tipo, precio, dormitorios)
- Click en "Buscar"
- Verás los resultados filtrados y se creará un quote automáticamente

### 3. Publicar Propiedad
- Click en "Publicar Propiedad" en el header
- Completa el formulario:
  - **Título**: "Casa de Prueba"
  - **Tipo**: Casa
  - **Precio**: 250000000
  - **Ubicación**: Selecciona Región → Provincia → Comuna (si el backend tiene los endpoints de ubicación)
  - **Amenities**: Selecciona alguna opción (si están disponibles)
- Click en "Publicar Propiedad"
- Serás redirigido al detalle de la propiedad en ~2 segundos

### 4. Ver Detalle
- Click en cualquier propiedad
- Verás toda la información detallada

---

## Datos de Prueba

### Comuna IDs Comunes (Santiago)
- Las Condes: 1 (o el ID que exista en tu BD)
- Providencia: 2
- Santiago Centro: 3
- Vitacura: 4

**Nota**: Estos IDs son ejemplos. Consulta tu base de datos para IDs reales:
```sql
SELECT id, name FROM comunas LIMIT 10;
```

### Owner ID Temporal (MVP1)
```
123e4567-e89b-12d3-a456-426614174000
```
Este UUID se usa automáticamente para `owner_id` y `created_by`.

### Crear Propiedad de Prueba vía API
```bash
curl -X POST http://localhost:8000/api/v1/properties/ \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Casa de Prueba",
    "property_type": "casa",
    "price": 250000000,
    "currency": "CLP",
    "comuna_id": 1,
    "dormitorios": 3,
    "banos": 2
  }'
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo (puerto 3000)

# Calidad
npm run lint         # Linter de código
npx tsc --noEmit     # Type checking sin emitir archivos

# Producción
npm run build        # Build de producción
npm run start        # Ejecutar build de producción
```

---

## Solución de Problemas Rápida

### "Failed to fetch properties"
**Solución**: Verifica que el backend esté ejecutándose en http://localhost:8000 y que CORS permita `http://localhost:3000`.

### "Property not found" al publicar
**Solución**: Usa un `comuna_id` válido que exista en tu base de datos. Verifica con la query SQL de arriba.

### Página en blanco
1. Revisa la consola del navegador (F12)
2. Verifica que no haya errores de TypeScript
3. Reinicia el servidor: `rm -rf .next && npm run dev`

### "Port 3000 already in use"
**Solución**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```
O usa otro puerto: `PORT=3001 npm run dev`

### Error de TypeScript
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## Checklist de Verificación

- [ ] Node.js 20+ instalado
- [ ] npm 10+ instalado
- [ ] Dependencias instaladas sin errores (`npm install`)
- [ ] `.env.local` configurado correctamente
- [ ] Backend ejecutándose en puerto 8000
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Página de inicio carga correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Puedes navegar entre páginas

---

## Documentación Adicional

- **[README.md](README.md)** - Visión general del proyecto
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura completa, API reference y troubleshooting detallado
- **[AGENTS.md](AGENTS.md)** - Guía para agentes de desarrollo

---

**¡Listo!** Tu frontend está configurado y funcionando.

**Última actualización**: Mayo 2026
