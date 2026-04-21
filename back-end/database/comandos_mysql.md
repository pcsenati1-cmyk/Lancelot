# Comandos MySQL - Sistema de Gestión de Asistencias

## Conexión a MySQL

```bash
mysql -h localhost -u root -p1234
```

## Usar base de datos

```sql
USE sistema_asistencia;
```

## Ver tablas

```sql
SHOW TABLES;
```

## Ver estructura de tablas

```sql
DESCRIBE estudiantes;
DESCRIBE asistencia;
DESCRIBE usuarios;
```

## Consultas commones

### Estudiantes

```sql
-- Listar todos los estudiantes
SELECT * FROM estudiantes;

-- Insertar estudiante
INSERT INTO estudiantes (codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado)
VALUES ('EST001', 'Juan', 'Pérez', 'juan@email.com', '1234567890', 'Ingeniería de Sistemas', 'active');

-- Actualizar estudiante
UPDATE estudiantes SET nombres = 'NuevoNombre' WHERE id = 1;

-- Eliminar estudiante
DELETE FROM estudiantes WHERE id = 1;
```

### Asistencias

```sql
-- Listar todas las asistencias
SELECT * FROM asistencia;

-- Insertar asistencia
INSERT INTO asistencia (estudiante_id, fecha_asistencia, estado, observacion)
VALUES (1, '2026-04-21', 'presente', NULL);

-- Ver asistencia por estudiante
SELECT a.*, e.codigo_estudiante, e.nombres, e.apellidos
FROM asistencia a
JOIN estudiantes e ON a.estudiante_id = e.id
WHERE e.id = 1;

-- Resumen diario
SELECT estado, COUNT(*) as total
FROM asistencia
WHERE fecha_asistencia = '2026-04-21'
GROUP BY estado;

-- Estadísticas de estudiante
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) as presente,
  SUM(CASE WHEN estado = 'ausente' THEN 1 ELSE 0 END) as ausente,
  SUM(CASE WHEN estado = 'tarde' THEN 1 ELSE 0 END) as tarde,
  SUM(CASE WHEN estado = 'eximido' THEN 1 ELSE 0 END) as eximido
FROM asistencia
WHERE estudiante_id = 1;
```

### Búsquedas

```sql
-- Buscar estudiante por código
SELECT * FROM estudiantes WHERE codigo_estudiante = 'EST001';

-- Buscar estudiante por nombre
SELECT * FROM estudiantes WHERE nombres LIKE '%Juan%';
```

## Ejecutar script de inicialización

```bash
mysql -h localhost -u root -p1234 < database/init.sql
```

O desde MySQL:

```sql
SOURCE path/al/init.sql;
```