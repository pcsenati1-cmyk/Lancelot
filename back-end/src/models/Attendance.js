const db = require('../config/database');

class Attendance {
  static async getAll() {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      ORDER BY a.attendance_date DESC, a.created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async getById(id) {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  static async getByStudentId(studentId) {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.student_id = ?
      ORDER BY a.attendance_date DESC
    `;
    const [rows] = await db.execute(sql, [studentId]);
    return rows;
  }

  static async getByDate(date) {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.execute(sql, [date]);
    return rows;
  }

  static async getByStudentAndDate(studentId, date) {
    const sql = `
      SELECT * FROM attendance
      WHERE student_id = ? AND attendance_date = ?
    `;
    const [rows] = await db.execute(sql, [studentId, date]);
    return rows;
  }

  static async getByDateRange(startDate, endDate) {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date BETWEEN ? AND ?
      ORDER BY a.attendance_date DESC, a.created_at DESC
    `;
    const [rows] = await db.execute(sql, [startDate, endDate]);
    return rows;
  }

  static async getByStudentIdAndDateRange(studentId, startDate, endDate) {
    const sql = `
      SELECT a.*, s.first_name, s.last_name, s.student_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.student_id = ? AND a.attendance_date BETWEEN ? AND ?
      ORDER BY a.attendance_date DESC
    `;
    const [rows] = await db.execute(sql, [studentId, startDate, endDate]);
    return rows;
  }

  static async create(attendanceData) {
    const { student_id, attendance_date, status, observation } = attendanceData;
    const sql = `
      INSERT INTO attendance (student_id, attendance_date, status, observation)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [student_id, attendance_date, status, observation || null]);
    return result.insertId;
  }

  static async createBulk(attendanceRecords) {
    const values = attendanceRecords.map(record => [
      record.student_id,
      record.attendance_date,
      record.status,
      record.observation || null
    ]);

    const sql = 'INSERT INTO attendance (student_id, attendance_date, status, observation) VALUES ?';
    const [result] = await db.query(sql, [values]);
    return result.insertId;
  }

  static async update(id, attendanceData) {
    const { status, observation } = attendanceData;
    const sql = `
      UPDATE attendance
      SET status = ?, observation = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [status, observation, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM attendance WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAttendanceStats(studentId, startDate = null, endDate = null) {
    let sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused
      FROM attendance
      WHERE student_id = ?
    `;

    let params = [studentId];

    if (startDate && endDate) {
      sql += ' AND attendance_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0];
  }

  static async getDailySummary(date) {
    const sql = `
      SELECT
        a.status,
        COUNT(*) as count
      FROM attendance a
      WHERE a.attendance_date = ?
      GROUP BY a.status
    `;
    const [rows] = await db.execute(sql, [date]);
    return rows;
  }
}

module.exports = Attendance;