const { pool } = require("../config/dbConfig");
class Comments {
  static async findById(comment_id) {
    const result = await pool.query(
      `SELECT с.user_id, c.comment_id, c.wish_id, 
        c.content, c.created_date, c.created_time, u.name, u.surname, u.profile_picture
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.comment_id = $1`,
      [comment_id]
    );
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
  static async create(commentData) {
    const { wish_id, user_id, content } = commentData;

    const query = `
        INSERT INTO comments (user_id, wish_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [user_id, wish_id, content];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
  static async findAll(wish_id) {
    const result = await pool.query(
      `SELECT c.user_id, c.comment_id, c.wish_id, 
        c.content, u.name, u.surname, u.profile_picture
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.wish_id = $1`,
      [wish_id]
    );
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows;
  }
}
module.exports = Comments;
