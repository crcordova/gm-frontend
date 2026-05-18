# 🛠️ Instrucciones de Configuración - GM Propiedades Frontend

## 📋 Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Verificar |
|----------|----------------|-----------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.x | `git --version` |

### Backend
- Backend de GM Propiedades ejecutándose
- Base de datos PostgreSQL con datos
- Endpoint: `http://localhost:8000`

---

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio (si aplica)

```bash
git clone <repository-url>
cd gm-frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

**Tiempo estimado**: 1-2 minutos

**Dependencias instaladas**:
- next@16.2.4
- react@19.2.4
- react-dom@19.2.4
- typescript@5.x
- tailwindcss@4.x
- Y más...

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local
```

**Editar `.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Notas**:
- `NEXT_PUBLIC_` es necesario para variables del cliente
- Cambiar URL para producción

### 4. Verificar Backend

```bash
# En otra terminal, verificar que el backend esté ejecutándose
curl http://localhost:8000/health
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

### 5. Iniciar el Servidor de Desarrollo

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

### 6. Verificar en el Navegador

Abre: http://localhost:3000

**Deberías ver**:
- Header con logo "GM Propiedades"
- Hero section
- Grid de propiedades (si hay datos)

---

## ✅ Verificación de Instalación

### Checklist

- [ ] Node.js instalado (v20+)
- [ ] npm instalado (v10+)
- [ ] Dependencias instaladas sin errores
- [ ] `.env.local` configurado
- [ ] Backend ejecutándose en puerto 8000
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Página de inicio carga correctamente
- [ ] No hay errores en la consola del navegador

### Comandos de Verificación

```bash
# Verificar Node.js
node --version
# Esperado: v20.x.x o superior

# Verificar npm
npm --version
# Esperado: 10.x.x o superior

# Verificar instalación de dependencias
npm list --depth=0
# Debería listar todas las dependencias

# Verificar TypeScript
npx tsc --version
# Esperado: Version 5.x.x

# Verificar backend
curl http://localhost:8000/docs
# Debería devolver HTML de Swagger
```

---

## 🐛 Solución de Problemas

### Problema 1: "Module not found"

**Síntoma**:
```
Error: Cannot find module 'next'
```

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

---

### Problema 2: "Port 3000 already in use"

**Síntoma**:
```
Error: Port 3000 is already in use
```

**Solución 1** - Usar otro puerto:
```bash
PORT=3001 npm run dev
```

**Solución 2** - Matar el proceso:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

### Problema 3: "Failed to fetch properties"

**Síntoma**:
Mensaje de error en la página de inicio.

**Causas posibles**:
1. Backend no está ejecutándose
2. Backend en puerto diferente
3. CORS no configurado

**Solución**:
```bash
# 1. Verificar backend
curl http://localhost:8000/health

# 2. Verificar puerto en .env.local
cat .env.local
# Debe ser: NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Verificar CORS en backend
# En backend/app/main.py debe tener:
# allow_origins=["http://localhost:3000"]
```

---

### Problema 4: Errores de TypeScript

**Síntoma**:
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solución**:
```bash
# Limpiar caché de TypeScript
rm -rf .next
npm run dev
```

---

### Problema 5: Estilos no se aplican

**Síntoma**:
La página se ve sin estilos.

**Solución**:
```bash
# Verificar que Tailwind esté configurado
cat tailwind.config.ts

# Reiniciar servidor
# Ctrl+C para detener
npm run dev
```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Frontend

**Opción 1** - Variable de entorno:
```bash
PORT=3001 npm run dev
```

**Opción 2** - Script en package.json:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

---

### Configurar para Producción

**1. Actualizar `.env.local`**:
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

**2. Build de producción**:
```bash
npm run build
```

**3. Iniciar servidor de producción**:
```bash
npm run start
```

---

### Habilitar HTTPS en Desarrollo (Opcional)

```bash
# Instalar mkcert
# Mac
brew install mkcert

# Windows
choco install mkcert

# Generar certificados
mkcert -install
mkcert localhost

# Iniciar con HTTPS
next dev --experimental-https
```

---

## 📊 Estructura de Datos Requerida

### Base de Datos

El backend debe tener estas tablas con datos:

**1. Comunas** (obligatorio):
```sql
SELECT id, name FROM comunas LIMIT 5;
```

**2. Propiedades** (opcional para testing):
```sql
SELECT COUNT(*) FROM properties;
```

**3. Amenidades** (opcional):
```sql
SELECT key, label FROM amenities;
```

### Datos de Prueba

Si no hay propiedades, puedes crear una de prueba:

```bash
curl -X POST http://localhost:8000/api/v1/properties/ \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Casa de Prueba",
    "property_type": "casa",
    "price": 250000000,
    "comuna_id": 1,
    "dormitorios": 3,
    "banos": 2
  }'
```

---

## 🌐 Configuración de Navegadores

### Chrome DevTools

**Abrir DevTools**: F12 o Ctrl+Shift+I

**Pestañas útiles**:
- **Console**: Ver errores de JavaScript
- **Network**: Ver llamadas API
- **Application**: Ver localStorage, cookies

### Extensiones Recomendadas

- **React Developer Tools**: Inspeccionar componentes
- **Redux DevTools**: Estado global (para MVP2)
- **JSON Viewer**: Ver respuestas API formateadas

---

## 📝 Variables de Entorno

### Desarrollo (`.env.local`)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (MVP2)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags (MVP2)
# NEXT_PUBLIC_ENABLE_AUTH=false
```

### Producción (`.env.production`)

```env
# API Backend
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTH=true
```

**Nota**: Nunca commitear archivos `.env.*` con datos sensibles.

---

## 🚀 Deployment

### Vercel (Recomendado)

**1. Instalar Vercel CLI**:
```bash
npm i -g vercel
```

**2. Login**:
```bash
vercel login
```

**3. Deploy**:
```bash
vercel
```

**4. Configurar variables de entorno**:
- Ve a tu proyecto en Vercel Dashboard
- Settings → Environment Variables
- Agregar: `NEXT_PUBLIC_API_URL`

---

### Docker (Opcional)

**Crear `Dockerfile`**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build y Run**:
```bash
docker build -t gm-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://backend:8000 gm-frontend
```

---

## 🧪 Testing

### Linter

```bash
npm run lint
```

**Arreglar automáticamente**:
```bash
npm run lint -- --fix
```

### Type Checking

```bash
npx tsc --noEmit
```

### Build Test

```bash
npm run build
```

Debe completarse sin errores.

---

## 📚 Recursos Adicionales

### Documentación
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

### Archivos del Proyecto
- [README.md](README.md) - Documentación principal
- [MVP1_GUIDE.md](MVP1_GUIDE.md) - Guía completa
- [QUICK_START.md](QUICK_START.md) - Inicio rápido
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura

---

## ✅ Checklist Final

Antes de empezar a desarrollar:

- [ ] Node.js 20+ instalado
- [ ] npm 10+ instalado
- [ ] Repositorio clonado (si aplica)
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env.local` configurado
- [ ] Backend ejecutándose y accesible
- [ ] Frontend ejecutándose (`npm run dev`)
- [ ] Página de inicio carga correctamente
- [ ] No hay errores en consola
- [ ] Puedes navegar entre páginas
- [ ] Documentación leída

---

## 🎉 ¡Listo para Desarrollar!

Si completaste todos los pasos, tu entorno está configurado correctamente.

**Próximos pasos**:
1. Explorar el código en `src/`
2. Probar todas las funcionalidades
3. Leer [MVP1_GUIDE.md](MVP1_GUIDE.md) para detalles
4. Comenzar a desarrollar nuevas features

**¿Problemas?** Consulta la sección de solución de problemas o revisa los logs.

---

**Tiempo total de setup**: ~10 minutos

**Última actualización**: Mayo 2026
