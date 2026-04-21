const db = require('../config/database');

class Estudiante {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM estudiantes ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM estudiantes WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByCode(codigo) {
    const [rows] = await db.query('SELECT * FROM estudiantes WHERE codigo_estudiante = ?', [codigo]);
    return rows[0];
  }

  static async create(studentData) {
    const { codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado = 'active' } = studentData;
    const sql = `
      INSERT INTO estudiantes (codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado]);
    return result.insertId;
  }

  static async update(id, studentData) {
    const { codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado } = studentData;
    const sql = `
      UPDATE estudiantes
      SET codigo_estudiante = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, programa = ?, estado = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM estudiantes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query) {
    const sql = `
      SELECT * FROM estudiantes
      WHERE codigo_estudiante LIKE ? OR nombres LIKE ? OR apellidos LIKE ? OR correo LIKE ?
      ORDER BY created_at DESC
    `;
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
    return rows;
  }
}

module.exports = Estudiante;