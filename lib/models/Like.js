const pool = require('../utils/pool')

module.exports = class Like {
    id;
    userId;
    postId;

    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.postId = row.post_id
    }


    static async insert(userEmail, postId) {

        const { rows } = await pool.query(`
            INSERT INTO likes(user_id, post_id)
            VALUES (
            (SELECT users.id
            FROM users
            WHERE users.email = $1) , $2)
            RETURNING * 
            `, [userEmail, postId])

        return new Like(rows[0])
    }

    static async delete(id) {

        const { rows } = await pool.query(`
        DELETE FROM likes
        WHERE id = $1
        RETURNING *`, [id])

        return new Like(rows[0])
    }
}