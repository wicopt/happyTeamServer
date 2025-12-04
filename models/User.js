const { pool } = require("../config/dbConfig");

class User {
  // Получить пользователя по ID
  static async findById(userId) {
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.name, u.surname, u.patronymic,
              u.birthday, u.department_id, d.department_name
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.department_id 
       WHERE u.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  // Получить пользователя по username
  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  // Создать нового пользователя
  static async create(userData) {
    const { username, name, surname, patronymic, department_id, birthday, password_hash } = userData;
    
    const result = await pool.query(
      `INSERT INTO users (username, name, surname, patronymic, department_id, birthday, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING user_id, username, name, surname`,
      [username, name, surname, patronymic, department_id, birthday, password_hash]
    );
    
    return result.rows[0];
  }

  // Обновить пользователя
  static async update(userId, updateData) {
    const { name, surname, patronymic, department_id, birthday } = updateData;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, surname = $2, patronymic = $3, department_id = $4, birthday = $5
       WHERE user_id = $6
       RETURNING *`,
      [name, surname, patronymic, department_id, birthday, userId]
    );
    
    return result.rows[0];
  }

  // Получить всех пользователей
  static async findAll() {
    const result = await pool.query(`
      SELECT u.user_id, u.username, u.name, u.surname, u.patronymic,
             u.birthday, d.department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.department_id
      ORDER BY EXTRACT(MONTH FROM u.birthday), EXTRACT(DAY FROM u.birthday)
    `);
    return result.rows;
  }
}

module.exports = User;