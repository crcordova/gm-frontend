# 🚀 Quick Start - GM Propiedades Frontend

## Inicio Rápido en 3 Pasos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Backend
Asegúrate de que el backend esté ejecutándose:
```bash
# En el directorio del backend
uvicorn app.main:app --reload
```

Verifica que esté disponible en: http://localhost:8000

### 3️⃣ Iniciar Frontend
```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

---

## ✅ Verificación Rápida

### Backend está funcionando?
Abre: http://localhost:8000/docs

Deberías ver la documentación de Swagger.

### Frontend está funcionando?
Abre: http://localhost:3000

Deberías ver la página de inicio de GM Propiedades.

---

## 🎯 Prueba las Funcionalidades

### 1. Ver Propiedades
- Ve a la página de inicio
- Deberías ver propiedades (si hay datos en el backend)

### 2. Buscar Propiedades
- Click en "Buscar" en el header
- Aplica filtros (tipo, precio, dormitorios)
- Click en "Buscar"
- Verás los resultados filtrados

### 3. Publicar Propiedad
- Click en "Publicar Propiedad" en el header
- Completa el formulario:
  - **Título**: "Casa de Prueba"
  - **Tipo**: Casa
  - **Precio**: 250000000
  - **Comuna ID**: 123 (o cualquier ID válido en tu BD)
- Click en "Publicar Propiedad"
- Serás redirigido al detalle de la propiedad

### 4. Ver Detalle
- Click en cualquier propiedad
- Verás toda la información detallada

---

## 🐛 Problemas Comunes

### "Failed to fetch properties"
**Solución**: Verifica que el backend esté ejecutándose en http://localhost:8000

### "Property not found" al publicar
**Solución**: Usa un `comuna_id` válido que exista en tu base de datos

### Página en blanco
**Solución**: 
1. Revisa la consola del navegador (F12)
2. Verifica que no haya errores de TypeScript
3. Reinicia el servidor: `npm run dev`

---

## 📝 Datos de Prueba

### Comuna IDs Comunes (Santiago)
- Las Condes: 123
- Providencia: 124
- Santiago Centro: 125
- Vitacura: 126

**Nota**: Estos IDs son ejemplos. Consulta tu base de datos para IDs reales.

### Owner ID Temporal
```
123e4567-e89b-12d3-a456-426614174000
```

Este UUID se usa automáticamente en MVP1 (sin login).

---

## 🎨 Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con propiedades destacadas |
| `/buscar` | Búsqueda avanzada con filtros |
| `/publicar` | Formulario para publicar propiedad |
| `/propiedades/[id]` | Detalle de una propiedad específica |

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm run start

# Linter
npm run lint
```

---

## 📚 Documentación Completa

- [README.md](README.md) - Documentación principal
- [MVP1_GUIDE.md](MVP1_GUIDE.md) - Guía completa de MVP1
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentación del backend

---

## 🎉 ¡Listo!

Tu frontend está configurado y funcionando. Ahora puedes:
- Explorar el código en `src/`
- Personalizar estilos en los componentes
- Agregar nuevas funcionalidades
- Preparar para MVP2

**¿Necesitas ayuda?** Consulta [MVP1_GUIDE.md](MVP1_GUIDE.md) para información detallada.
