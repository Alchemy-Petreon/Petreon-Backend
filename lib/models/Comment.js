const pool = require('../utils/pool');

module.exports = class Comment {
    id;
    userId;
    postId;
    text;
    timestamp;

    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.postId = row.post_id;
        this.text = row.text;
        this.timestamp = row.timestamp;
    }

    static async insert({ userId, postId, text }) {

        const currentTime = new Date().toLocaleString("en-US");
        console.log('_+_+_+_+_+_+_+_+_+_+_+_+_')
        console.log('currentTime')
        console.log(currentTime)
        console.log('_+_+_+_+_+_+_+_+_+_+_+_+_')


        const { rows } = await pool.query(
            `INSERT INTO comments
            (
                user_id,
                post_id,
                text,
                timestamp
            ) VALUES (
                $1, $2, $3, $4
            ) RETURNING *`,
            [userId, postId, text, currentTime]
        );

        return new Comment(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM comments
            WHERE id = $1
            RETURNING *`, [id]
        )

        return new Comment(rows[0])
    }



}