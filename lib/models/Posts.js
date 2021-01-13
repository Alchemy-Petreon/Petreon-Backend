const pool = require('../utils/pool');

module.exports = class Post {
    id;
    pet_id;
    post_time;
    picture_url;
    video_url;
    post_text;
    likes;

    constructor(row) {
        this.id = row.id;
        this.pet_id = row.pet_id;
        this.post_time = row.post_time;
        this.picture_url = row.account_created;
        this.video_url = row.video_url;
        this.post_text = row.post_text;
        this.likes = row.likes;
    }

    static async insert({ pet_id, picture_url, video_url, post_text }) {

        const currentTime = new Date().toISOString();

        const { rows } = await pool.query(
            `INSERT INTO posts
            (
                pet_id, 
                post_time,
                picture_url,
                video_url,
                post_text,
                likes
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING *`,
            [pet_id, currentTime, picture_url, video_url, post_text, 0]
        );

        return new Post(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
            `SELECT posts.*,
            to_json(pets.*) AS pet
            FROM posts
            JOIN pets
            ON posts.pet_id = pets.id
            ORDER BY id ASC`
        );

        return rows.map(row => new Post(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT posts.*
            to_json(pets.*) AS pet
            FROM posts
            JOIN pets
            ON posts.pet_id  = pets.id
            WHERE posts.id = $1
            `, [id]
        );

        if (!rows[0]) throw new Error(`No post with id ${id}`);

        return {
            ...new Post(rows[0]),
            pet: rows[0].pet
        }
    }

    static async update(id, { pet_id, post_time, picture_url, video_url, post_text, likes }) {
        const { rows } = await pool.query(`
            UPDATE posts
            SET 
            pet_id = $1,
            post_time = $2,
            picture_url = $3,
            video_url = $4,
            post_text = $5,
            likes = $6
            WHERE id = $7
            RETURNING *
            `,
            [pet_id, post_time, picture_url, video_url, post_text, likes, id]
        );

        return new Post(rows[0]);
    }

    static async delete(id, pet_id) {
        const { rows } = await pool.query(
            `DELETE FROM posts
            CASCADE WHERE id = $1
            AND pet_id = $2
            RETURNING *`,
            [id, pet_id]
        );

        return new Post(rows[0]);
    }
}
