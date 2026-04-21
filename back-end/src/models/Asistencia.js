const db = require('../config/database');

class Attendance {
  static async getAll() {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      ORDER BY a.fecha_asistencia DESC, a.created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async getById(id) {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      WHERE a.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  static async getByStudentId(studentId) {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      WHERE a.estudiante_id = ?
      ORDER BY a.fecha_asistencia DESC
    `;
    const [rows] = await db.execute(sql, [studentId]);
    return rows;
  }

  static async getByDate(date) {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      WHERE a.fecha_asistencia = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.execute(sql, [date]);
    return rows;
  }

  static async getByStudentAndDate(studentId, date) {
    const sql = `
      SELECT * FROM asistencias
      WHERE estudiante_id = ? AND fecha_asistencia = ?
    `;
    const [rows] = await db.execute(sql, [studentId, date]);
    return rows;
  }

  static async getByDateRange(startDate, endDate) {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      WHERE a.fecha_asistencia BETWEEN ? AND ?
      ORDER BY a.fecha_asistencia DESC, a.created_at DESC
    `;
    const [rows] = await db.execute(sql, [startDate, endDate]);
    return rows;
  }

  static async getByStudentIdAndDateRange(studentId, startDate, endDate) {
    const sql = `
      SELECT a.*, s.nombres, s.apellidos, s.codigo_estudiante
      FROM asistencias a
      JOIN estudiantes s ON a.estudiante_id = s.id
      WHERE a.estudiante_id = ? AND a.fecha_asistencia BETWEEN ? AND ?
      ORDER BY a.fecha_asistencia DESC
    `;
    const [rows] = await db.execute(sql, [studentId, startDate, endDate]);
    return rows;
  }

  static async create(attendanceData) {
    const { estudiante_id, fecha_asistencia, estado, observacion } = attendanceData;
    const sql = `
      INSERT INTO asistencias (estudiante_id, fecha_asistencia, estado, observacion)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [estudiante_id, fecha_asistencia, estado, observacion || null]);
    return result.insertId;
  }

  static async createBulk(attendanceRecords) {
    const values = attendanceRecords.map(record => [
      record.estudiante_id,
      record.fecha_asistencia,
      record.estado,
      record.observacion || null
    ]);

    const sql = 'INSERT INTO asistencias (estudiante_id, fecha_asistencia, estado, observacion) VALUES ?';
    const [result] = await db.query(sql, [values]);
    return result.insertId;
  }

  static async update(id, attendanceData) {
    const { estado, observacion } = attendanceData;
    const sql = `
      UPDATE asistencias
      SET estado = ?, observacion = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [estado, observacion, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM asistencias WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAttendanceStats(studentId, startDate = null, endDate = null) {
    let sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) as presente,
        SUM(CASE WHEN estado = 'ausente' THEN 1 ELSE 0 END) as ausente,
        SUM(CASE WHEN estado = 'tarde' THEN 1 ELSE 0 END) as tarde,
        SUM(CASE WHEN estado = 'eximido' THEN 1 ELSE 0 END) as eximido
      FROM asistencia
      WHERE estudiante_id = ?
    `;

    let params = [studentId];

    if (startDate && endDate) {
      sql += ' AND fecha_asistencia BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0];
  }

  static async getDailySummary(date) {
    const sql = `
      SELECT
        a.estado,
        COUNT(*) as count
      FROM asistencias a
      WHERE a.fecha_asistencia = ?
      GROUP BY a.estado
    `;
    const [rows] = await db.execute(sql, [date]);
    return rows;
  }
}

module.exports = Attendance;