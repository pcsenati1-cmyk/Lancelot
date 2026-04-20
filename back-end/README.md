# Sistema de Gestión de Asistencias - Backend

API REST desarrollada con Express.js y MySQL para la gestión de registros y asistencias de estudiantes.

## 📋 Características

- CRUD completo de estudiantes
- Registro de asistencias (individual y masivo)
- Consulta de estadísticas por estudiante
- Resúmenes diarios de asistencia
- Validación de datos con express-validator
- Manejo de errores centralizado

## 🚀 Instalación

```bash
cd back-end
npm install
```

## ⚙️ Configuración

1. Crea la base de datos ejecutando el script `database/init.sql` en MySQL
2. Configura las variables de entorno en `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_asistencia
JWT_SECRET=tu_clave_secreta
```

## 🏃‍♂️ Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

La API estará disponible en `http://localhost:3000/api`

## 📚 Endpoints

### Estudiantes
- `GET /api/students` - Listar todos los estudiantes
- `GET /api/students/search?q=query` - Buscar estudiantes
- `GET /api/students/code/:code` - Buscar por código
- `GET /api/students/:id` - Obtener estudiante por ID
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Asistencias
- `GET /api/attendance` - Listar todas las asistencias
- `GET /api/attendance/date/:date` - Asistencias por fecha
- `GET /api/attendance/student/:student_id` - Asistencias de un estudiante
- `GET /api/attendance/stats/student/:student_id` - Estadísticas de un estudiante
- `GET /api/attendance/summary/daily?date=YYYY-MM-DD` - Resumen diario
- `POST /api/attendance` - Registrar asistencia individual
- `POST /api/attendance/bulk` - Registrar asistencias masivas
- `PUT /api/attendance/:id` - Actualizar asistencia
- `DELETE /api/attendance/:id` - Eliminar asistencia

### Health Check
- `GET /api/health` - Estado del servicio

## 📊 Modelo de Datos

### Estudiantes
```sql
- id (PK)
- student_code (único)
- first_name, last_name
- email (único)
- phone
- program
- status (active/inactive/graduated/suspended)
```

### Asistencias
```sql
- id (PK)
- student_id (FK)
- attendance_date
- status (present/absent/late/excused)
- observation
```

## 🧪 Ejemplo de uso

Crear estudiante:
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "student_code": "EST001",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@email.com",
    "phone": "1234567890",
    "program": "Ingeniería"
  }'
```

Registrar asistencia masiva:
```bash
curl -X POST http://localhost:3000/api/attendance/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_date": "2025-04-20",
    "records": [
      {"student_id": 1, "status": "present"},
      {"student_id": 2, "status": "present"},
      {"student_id": 3, "status": "absent", "observation": "Enfermedad"}
    ]
  }'
```
