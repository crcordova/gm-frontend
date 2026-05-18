# Ejemplos JSON para Métodos POST - Swagger

Este documento contiene ejemplos de JSON para probar todos los endpoints POST de tu API a través de Swagger.

---

## 1. POST /amenities/ - Crear Amenidad

**Endpoint:** `POST /amenities/`

### Ejemplo Básico:
```json
{
  "key": "piscina",
  "label": "Piscina",
  "description": "Piscina temperada disponible todo el año",
  "category": "recreacion"
}
```

### Ejemplo Sin Categoría:
```json
{
  "key": "gimnasio",
  "label": "Gimnasio",
  "description": "Gimnasio equipado con máquinas modernas"
}
```

### Más Ejemplos de Amenidades:
```json
{
  "key": "estacionamiento_visitas",
  "label": "Estacionamiento de Visitas",
  "description": "Espacios de estacionamiento para visitantes",
  "category": "estacionamiento"
}
```

```json
{
  "key": "salon_eventos",
  "label": "Salón de Eventos",
  "description": "Salón multiuso para eventos y celebraciones",
  "category": "areas_comunes"
}
```

```json
{
  "key": "seguridad_24h",
  "label": "Seguridad 24 Horas",
  "description": "Vigilancia y seguridad las 24 horas del día",
  "category": "seguridad"
}
```

---

## 2. POST /properties/ - Crear Propiedad

**Endpoint:** `POST /properties/`

### Ejemplo Completo - Casa:
```json
{
  "owner_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Hermosa Casa en Las Condes",
  "description": "Casa moderna de 3 pisos con excelente ubicación, cerca de colegios y centros comerciales. Amplio jardín y terraza.",
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
  "numeracion": "numero",
  "numero": "5678",
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

### Ejemplo Mínimo - Departamento:
```json
{
  "owner_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Departamento Céntrico en Providencia",
  "description": "Departamento luminoso de 2 dormitorios, ideal para pareja o familia pequeña.",
  "property_type": "departamento",
  "price": 180000000,
  "m2_construidos": 65,
  "dormitorios": 2,
  "banos": 1,
  "estacionamientos": 1,
  "condominio": false,
  "direccion": "Av. Providencia 1234",
  "comuna_id": 2
}
```

### Ejemplo - Parcela:
```json
{
  "owner_id": "987e6543-e21b-12d3-a456-426614174999",
  "title": "Parcela de Agrado en Pirque",
  "description": "Hermosa parcela con vista a la cordillera, ideal para proyecto familiar. Cuenta con pozo de agua y luz eléctrica.",
  "property_type": "parcela",
  "status": "activo",
  "price": 95000000,
  "currency": "CLP",
  "m2_totales": 5000,
  "m2_construidos": 120,
  "dormitorios": 3,
  "banos": 2,
  "estacionamientos": 3,
  "condominio": false,
  "direccion": "Camino El Peral Km 8, Pirque",
  "lat": -33.6500,
  "lon": -70.5833,
  "comuna_id": 15,
  "barrio": "El Peral",
  "material_construccion": "madera",
  "material_ventanas": "aluminio",
  "cubierta": "zinc",
  "features": {
    "pozo": true,
    "luz_electrica": true,
    "cerco": "perimetral",
    "arboles_frutales": 15
  },
  "amenity_keys": []
}
```

### Ejemplo - Oficina:
```json
{
  "owner_id": "456e7890-e12b-34d5-a678-426614175111",
  "title": "Oficina Moderna en Edificio Corporativo",
  "description": "Oficina completamente equipada en edificio clase A, con excelente conectividad y servicios.",
  "property_type": "oficina",
  "status": "activo",
  "price": 120000000,
  "currency": "CLP",
  "m2_construidos": 85,
  "dormitorios": 0,
  "banos": 2,
  "estacionamientos": 2,
  "condominio": true,
  "direccion": "Av. Vitacura 3567, Piso 12",
  "lat": -33.3950,
  "lon": -70.5800,
  "comuna_id": 3,
  "barrio": "Vitacura Centro",
  "material_construccion": "hormigon",
  "material_ventanas": "termopanel",
  "features": {
    "piso": 12,
    "vista": "cordillera",
    "aire_acondicionado": true,
    "sala_reuniones": 2
  },
  "amenity_keys": ["seguridad_24h", "estacionamiento_visitas"]
}
```

### Tipos de Propiedad Válidos:
- `"casa"`
- `"departamento"`
- `"parcela"`
- `"oficina"`
- `"local_comercial"`
- `"bodega"`
- `"sitio"`

### Estados Válidos:
- `"activo"`
- `"vendido"`
- `"reservado"`
- `"inactivo"`

### Monedas Válidas:
- `"CLP"` (Peso Chileno)
- `"USD"` (Dólar)
- `"UF"` (Unidad de Fomento)

### Materiales de Construcción:
- `"hormigon"`
- `"ladrillo"`
- `"madera"`
- `"metalica"`
- `"mixta"`
- `"adobe"`
- `"otro"`

### Materiales de Ventanas:
- `"aluminio"`
- `"pvc"`
- `"madera"`
- `"termopanel"`
- `"otro"`

### Tipos de Cubierta:
- `"teja"`
- `"zinc"`
- `"losa"`
- `"pizarreno"`
- `"otro"`

---

## 3. POST /quotes/ - Crear Cotización/Búsqueda

**Endpoint:** `POST /quotes/`

### Ejemplo Completo:
```json
{
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "desired_property_type": "casa",
  "min_price": 200000000,
  "max_price": 500000000,
  "currency": "CLP",
  "min_m2": 150,
  "max_m2": 300,
  "min_dormitorios": 3,
  "min_banos": 2,
  "min_estacionamientos": 2,
  "lat": -33.4084,
  "lon": -70.5754,
  "max_distance_km": 5,
  "preferred_comunas": ["Las Condes", "Vitacura", "Lo Barnechea"],
  "preferred_barrios": ["El Golf", "Manquehue"],
  "required_amenities": ["piscina", "seguridad_24h"],
  "optional_amenities": ["gimnasio", "salon_eventos"],
  "numero_familia": 4,
  "weights": {
    "price_weight": 0.3,
    "location_weight": 0.25,
    "size_weight": 0.2,
    "rooms_weight": 0.15,
    "amenities_weight": 0.1
  },
  "desired_features": {
    "orientacion": "norte",
    "calefaccion": "central",
    "jardin": true
  }
}
```

### Ejemplo Mínimo:
```json
{
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "desired_property_type": "departamento",
  "min_price": 100000000,
  "max_price": 200000000,
  "min_dormitorios": 2,
  "min_banos": 1
}
```

### Ejemplo - Búsqueda por Ubicación:
```json
{
  "created_by": "987e6543-e21b-12d3-a456-426614174999",
  "desired_property_type": "casa",
  "min_price": 150000000,
  "max_price": 350000000,
  "currency": "CLP",
  "min_dormitorios": 3,
  "min_banos": 2,
  "lat": -33.4372,
  "lon": -70.6506,
  "max_distance_km": 10,
  "required_amenities": ["estacionamiento_visitas"],
  "numero_familia": 5
}
```

### Ejemplo - Búsqueda Flexible:
```json
{
  "created_by": "456e7890-e12b-34d5-a678-426614175111",
  "min_price": 80000000,
  "max_price": 150000000,
  "currency": "CLP",
  "min_m2": 50,
  "max_m2": 100,
  "min_dormitorios": 1,
  "preferred_comunas": ["Providencia", "Ñuñoa", "Santiago Centro"],
  "optional_amenities": ["gimnasio", "piscina"]
}
```

### Ejemplo - Búsqueda de Oficina:
```json
{
  "created_by": "111e2222-e33b-44d5-a666-426614177777",
  "desired_property_type": "oficina",
  "min_price": 50000000,
  "max_price": 150000000,
  "currency": "CLP",
  "min_m2": 60,
  "max_m2": 120,
  "lat": -33.4084,
  "lon": -70.5754,
  "max_distance_km": 3,
  "preferred_comunas": ["Las Condes", "Vitacura"],
  "required_amenities": ["seguridad_24h", "estacionamiento_visitas"],
  "desired_features": {
    "aire_acondicionado": true,
    "piso_minimo": 5
  }
}
```

---

## Notas Importantes:

### UUIDs:
Los campos `owner_id` y `created_by` requieren UUIDs válidos. Puedes usar estos ejemplos o generar los tuyos:
- `123e4567-e89b-12d3-a456-426614174000`
- `987e6543-e21b-12d3-a456-426614174999`
- `456e7890-e12b-34d5-a678-426614175111`
- `111e2222-e33b-44d5-a666-426614177777`

### Coordenadas de Referencia (Santiago, Chile):
- Las Condes: `lat: -33.4084, lon: -70.5754`
- Providencia: `lat: -33.4372, lon: -70.6506`
- Santiago Centro: `lat: -33.4489, lon: -70.6693`
- Vitacura: `lat: -33.3950, lon: -70.5800`

### Comuna IDs:
Asegúrate de usar IDs de comunas válidos que existan en tu base de datos. Los ejemplos usan IDs genéricos (1, 2, 3, etc.).

### Amenity Keys:
Antes de usar `amenity_keys` en propiedades o `required_amenities`/`optional_amenities` en quotes, asegúrate de que esas amenidades existan en tu base de datos (créalas primero con POST /amenities/).

### Campos Opcionales:
Todos los campos marcados como `Optional` en los schemas pueden ser omitidos del JSON. Los ejemplos mínimos muestran solo los campos requeridos.

---

## Cómo Usar en Swagger:

1. Abre Swagger UI en tu navegador (generalmente en `http://localhost:8000/docs`)
2. Busca el endpoint POST que quieres probar
3. Haz clic en "Try it out"
4. Copia uno de los ejemplos JSON de arriba
5. Pégalo en el campo "Request body"
6. Ajusta los valores según necesites (especialmente UUIDs y IDs)
7. Haz clic en "Execute"
8. Revisa la respuesta

---

## Validaciones a Considerar:

### Properties:
- `price` debe ser mayor que 0
- `m2_construidos` debe ser mayor que 0
- `dormitorios`, `banos`, `estacionamientos` deben ser >= 0
- `lat` debe estar entre -90 y 90
- `lon` debe estar entre -180 y 180
- `amenity_keys` deben existir en la tabla de amenidades

### Quotes:
- `max_price` debe ser >= `min_price`
- `max_m2` debe ser >= `min_m2`
- Todos los valores numéricos positivos deben ser > 0
- `required_amenities` y `optional_amenities` deben existir en la tabla de amenidades

### Amenities:
- `key` debe ser único (no puede haber dos amenidades con el mismo key)
- `key` y `label` son obligatorios
