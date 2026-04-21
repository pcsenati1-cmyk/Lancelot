# Rutas API - Postman

## Configuración
- **Base URL:** `http://localhost:3000`
- **Content-Type:** `application/json`
- **Body:** raw > JSON

---

## Estudiantes

### GET - Listar todos
```
GET http://localhost:3000/api/estudiantes
```

---

### GET - Obtener por ID
```
GET http://localhost:3000/api/estudiantes/1
```

---

### POST - Crear estudiante
```
POST http://localhost:3000/api/estudiantes
```

**Body (JSON):**
```json
{
  "codigo_estudiante": "EST001",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "correo": "juan@email.com",
  "telefono": "1234567890",
  "programa": "Ingeniería de Sistemas"
}
```

---

### PUT - Actualizar estudiante
```
PUT http://localhost:3000/api/estudiantes/1
```

**Body (JSON):**
```json
{
  "nombres": "NuevoNombre",
  "apellidos": "NuevoApellido"
}
```

---

### DELETE - Eliminar estudiante
```
DELETE http://localhost:3000/api/estudiantes/1
```

---

## Asistencias

### GET - Listar todas
```
GET http://localhost:3000/api/asistencias
```

---

### GET - Por estudiante
```
GET http://localhost:3000/api/asistencias/estudiante/1
```

---

### POST - Registrar asistencia
```
POST http://localhost:3000/api/asistencias
```

**Body (JSON):**
```json
{
  "estudiante_id": 1,
  "fecha_asistencia": "2026-04-21",
  "estado": "presente",
  "observacion": null
}
```

**Estados válidos:** `presente`, `ausente`, `tarde`, `eximido`

---

## Health

### GET - Estado del servidor
```
GET http://localhost:3000/api/health
```