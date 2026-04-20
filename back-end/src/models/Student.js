const db = require('../config/database');

class Student {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByCode(code) {
    const [rows] = await db.query('SELECT * FROM students WHERE student_code = ?', [code]);
    return rows[0];
  }

  static async create(studentData) {
    const { student_code, first_name, last_name, email, phone, program, status = 'active' } = studentData;
    const sql = `
      INSERT INTO students (student_code, first_name, last_name, email, phone, program, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [student_code, first_name, last_name, email, phone, program, status]);
    return result.insertId;
  }

  static async update(id, studentData) {
    const { student_code, first_name, last_name, email, phone, program, status } = studentData;
    const sql = `
      UPDATE students
      SET student_code = ?, first_name = ?, last_name = ?, email = ?, phone = ?, program = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [student_code, first_name, last_name, email, phone, program, status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query) {
    const sql = `
      SELECT * FROM students
      WHERE student_code LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
      ORDER BY created_at DESC
    `;
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
    return rows;
  }
}

module.exports = Student;