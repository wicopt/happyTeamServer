const { pool } = require("../config/dbConfig");
class Initiative {
  static async findById(user_id) {
    const result = await pool.query(
      `SELECT initiative_id, initiator_id, user_id, chat_link, funds_link
       FROM initiative
       WHERE user_id = $1`,
      [user_id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }
  static async create(initiativeData) {
    const { initiator_id, user_id, chat_link, funds_link } = initiativeData;

    const query = `
        INSERT INTO initiative (initiator_id, user_id, chat_link, funds_link)
        VALUES ($1, $2, $3, $4)
        RETURNING chat_link, funds_link;
    `;

    const values = [initiator_id, user_id, chat_link, funds_link];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }
static async delete(user_id){
    const result = await pool.query(
      `DELETE FROM initiative 
       WHERE user_id = $1
       RETURNING *`,
      [user_id]
    );
}
}
module.exports = Initiative;