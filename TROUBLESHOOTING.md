# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### Error: "Property not found" después de crear

**Síntoma**: 
- La propiedad se crea correctamente (status 200)
- Pero al redirigir muestra "Propiedad no encontrada"
- URL tiene UUID: `http://localhost:3000/propiedades/08050be2-...`

**Causa**: El backend usa UUIDs (strings) como IDs, no números enteros.

**Solución**: ✅ Ya corregido en el código

El frontend ahora maneja correctamente:
- IDs como strings (UUIDs)
- Respuestas paginadas con estructura `{items: [...]}`
- Ambos formatos de amenidades (`amenities` y `amenity_keys`)

---

### Error: "properties.map is not a function"

**Síntoma**:
```
TypeError: properties.map is not a function
```

**Causa**: El backend no está devolviendo un array de propiedades, o no está ejecutándose.

**Soluciones**:

#### 1. Verificar que el Backend esté Ejecutándose

```bash
# Verificar si el backend responde
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

Si no responde:
```bash
# En el directorio del backend
uvicorn app.main:app --reload
```

---

#### 2. Verificar el Endpoint de Propiedades

```bash
# Probar el endpoint directamente
curl http://localhost:8000/api/v1/properties/
```

**Respuesta esperada**: Un array JSON (puede estar vacío `[]`)

**Si devuelve error**:
- Verifica que la base de datos esté conectada
- Revisa los logs del backend
- Asegúrate de que las tablas existan

---

#### 3. Verificar CORS

**Síntoma**: Error de CORS en la consola del navegador

**Solución**: En el backend, verifica `app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ← Debe incluir localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

#### 4. Verificar Variables de Entorno

**Archivo**: `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Importante**: 
- Debe empezar con `NEXT_PUBLIC_`
- No debe tener espacios
- Debe ser la URL correcta del backend

**Después de cambiar**: Reinicia el servidor de Next.js
```bash
# Ctrl+C para detener
npm run dev
```

---

#### 5. Limpiar Caché de Next.js

```bash
# Detener el servidor (Ctrl+C)
rm -rf .next
npm run dev
```

---

### Error: "Failed to fetch properties"

**Causa**: No se puede conectar al backend

**Soluciones**:

1. **Verificar URL del backend**:
   ```bash
   echo $NEXT_PUBLIC_API_URL
   # Debe mostrar: http://localhost:8000
   ```

2. **Verificar que el backend esté en el puerto correcto**:
   ```bash
   netstat -ano | findstr :8000  # Windows
   lsof -i :8000                 # Mac/Linux
   ```

3. **Probar conexión**:
   ```bash
   curl http://localhost:8000/api/v1/properties/
   ```

---

### Error: "Property not found"

**Causa**: El ID de la propiedad no existe

**Solución**: Crear propiedades de prueba

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

**Nota**: Asegúrate de que `comuna_id: 1` exista en tu base de datos.

---

### Error: "comuna_id not found"

**Causa**: El ID de comuna no existe en la base de datos

**Solución**: Verificar comunas disponibles

```bash
# En el backend, ejecutar query SQL
SELECT id, name FROM comunas LIMIT 10;
```

O usar un ID que sepas que existe.

---

### Error de TypeScript

**Síntoma**:
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solución**:
```bash
# Limpiar y reconstruir
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

### Página en Blanco

**Causa**: Error de JavaScript no capturado

**Solución**:

1. **Abrir DevTools** (F12)
2. **Ver Console** - Buscar errores en rojo
3. **Ver Network** - Verificar llamadas API

**Errores comunes**:
- 404: Backend no encontrado
- 500: Error en el backend
- CORS: Problema de permisos

---

### No se Muestran Propiedades

**Causa**: Base de datos vacía

**Solución**: Crear propiedades de prueba

**Opción 1** - Usar Swagger:
1. Abre http://localhost:8000/docs
2. Ve a `POST /api/v1/properties/`
3. Click en "Try it out"
4. Usa el ejemplo de [SWAGGER_POST_EXAMPLES.md](SWAGGER_POST_EXAMPLES.md)
5. Click en "Execute"

**Opción 2** - Usar curl:
```bash
curl -X POST http://localhost:8000/api/v1/properties/ \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
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
}
EOF
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
# Ctrl+C para detener
uvicorn app.main:app --reload

# Frontend
# Ctrl+C para detener
rm -rf .next
npm run dev
```

### Ver Logs

```bash
# Backend: Ver en la terminal donde se ejecuta uvicorn

# Frontend: Ver en la terminal donde se ejecuta npm run dev

# Navegador: F12 → Console
```

---

## Errores Específicos del Backend

### "Table 'comunas' doesn't exist"

**Solución**: Ejecutar migraciones

```bash
# En el directorio del backend
alembic upgrade head
```

### "Connection refused"

**Solución**: Verificar PostgreSQL

```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows
sc query postgresql

# Mac
brew services list | grep postgresql

# Linux
systemctl status postgresql
```

### "Authentication failed"

**Solución**: Verificar credenciales en `.env` del backend

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

## Contacto y Recursos

### Documentación
- [README.md](README.md) - Documentación principal
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Configuración
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API del backend

### Herramientas
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Registro de Problemas

Usa esta sección para documentar problemas específicos de tu instalación:

### Problema 1
- **Fecha**: 
- **Error**: 
- **Solución**: 

### Problema 2
- **Fecha**: 
- **Error**: 
- **Solución**: 

---

**Última actualización**: Mayo 2026
