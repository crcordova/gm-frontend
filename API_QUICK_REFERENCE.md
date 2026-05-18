# 🚀 API Quick Reference

**Quick lookup for common API operations**

Base URL: `http://localhost:8000`

---

## 🏠 Properties

### Create Property
```bash
POST /api/v1/properties/
Content-Type: application/json

{
  "title": "Casa en Las Condes",
  "property_type": "casa",
  "operation_type": "venta",
  "price": 250000000,
  "comuna_id": 123,
  "owner_id": "uuid",
  "created_by": "uuid"
}
```

### Get Property
```bash
GET /api/v1/properties/{id}
```

### List Properties
```bash
GET /api/v1/properties/?property_type=casa&min_price=200000000&max_price=300000000
```

### Update Property
```bash
PUT /api/v1/properties/{id}
Content-Type: application/json

{
  "price": 260000000,
  "status": "reserved"
}
```

### Delete Property
```bash
DELETE /api/v1/properties/{id}
```

### Search by Location
```bash
GET /api/v1/properties/search/location?lat=-33.4172&lon=-70.5947&radius_km=5
```

---

## 💬 Quotes

### Create Quote
```bash
POST /api/v1/quotes/
Content-Type: application/json

{
  "title": "Busco Casa",
  "property_type": "casa",
  "operation_type": "venta",
  "min_price": 200000000,
  "max_price": 300000000,
  "user_id": "uuid",
  "created_by": "uuid"
}
```

### Get Quote
```bash
GET /api/v1/quotes/{id}
```

### List Quotes
```bash
GET /api/v1/quotes/
```

### Get User's Quotes
```bash
GET /api/v1/quotes/user/{user_id}
```

### Update Quote
```bash
PUT /api/v1/quotes/{id}
Content-Type: application/json

{
  "max_price": 350000000
}
```

### Delete Quote
```bash
DELETE /api/v1/quotes/{id}
```

---

## 🎨 Amenities

### Create Amenity
```bash
POST /api/v1/amenities/
Content-Type: application/json

{
  "key": "piscina",
  "label": "Piscina",
  "category": "recreational"
}
```

### Get Amenity
```bash
GET /api/v1/amenities/{id}
```

### Get by Key
```bash
GET /api/v1/amenities/key/piscina
```

### List All
```bash
GET /api/v1/amenities/
```

### Get Categories
```bash
GET /api/v1/amenities/categories/list
```

---

## 🎯 Matching (TODO)

### Find Matches
```bash
GET /api/v1/matching/quote/{quote_id}?limit=10&min_score=0.5
```

---

## 🏥 System

### API Info
```bash
GET /
```

### Health Check
```bash
GET /health
```

---

## 📝 Common Filters

### Properties
- `property_type`: casa, departamento, terreno, oficina, local_comercial
- `operation_type`: venta, arriendo
- `min_price`, `max_price`: Integer (CLP)
- `comuna_id`: Integer
- `min_dormitorios`, `max_dormitorios`: Integer
- `status`: available, reserved, sold, rented, inactive
- `skip`, `limit`: Pagination

### Quotes
- `property_type`: Same as properties
- `operation_type`: venta, arriendo
- `skip`, `limit`: Pagination

---

## 🔑 Required Fields

### Property
- `title` (string)
- `property_type` (enum)
- `operation_type` (enum)
- `price` (integer)
- `comuna_id` (integer)
- `owner_id` (uuid string)
- `created_by` (uuid string)

### Quote
- `title` (string)
- `property_type` (enum)
- `operation_type` (enum)
- `user_id` (uuid string)
- `created_by` (uuid string)

### Amenity
- `key` (string, unique)
- `label` (string)

---

## 🎨 Property Types

```typescript
enum PropertyType {
  CASA = "casa"
  DEPARTAMENTO = "departamento"
  TERRENO = "terreno"
  OFICINA = "oficina"
  LOCAL_COMERCIAL = "local_comercial"
  BODEGA = "bodega"
  ESTACIONAMIENTO = "estacionamiento"
}
```

---

## 📊 Response Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

---

## 🧪 Testing

### Using curl
```bash
# Create property
curl -X POST http://localhost:8000/api/v1/properties/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","property_type":"casa","operation_type":"venta","price":250000000,"comuna_id":123,"owner_id":"uuid","created_by":"uuid"}'

# Get properties
curl http://localhost:8000/api/v1/properties/
```

### Using Swagger UI
1. Open http://localhost:8000/docs
2. Click endpoint
3. Click "Try it out"
4. Fill parameters
5. Click "Execute"

---

## 📚 Full Documentation

- **Complete API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Architecture**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Setup Guide**: [README.MD](README.MD)
- **Interactive Docs**: http://localhost:8000/docs

---

**Quick Reference v1.0**
