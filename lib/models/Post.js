const pool = require('../utils/pool');

module.exports = class Post {
    id;
    petId;
    postTime;
    pictureUrl;
    videoUrl;
    postText;
    likes;

    constructor(row) {
        this.id = row.id;
        this.petId = row.pet_id;
        this.postTime = row.post_time;
        this.pictureUrl = row.picture_url;
        this.videoUrl = row.video_url;
        this.postText = row.post_text;
        this.likes = row.likes;
    }

    static async insert({ petId, pictureUrl, videoUrl, postText }) {

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
            [petId, currentTime, pictureUrl, videoUrl, postText, 0]
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
        if (rows[0].posts[0] !== null) {
            rows[0].posts = rows[0].posts.map(post => new Post(post))
        } else {
            rows[0].posts = []
        }

        return {
            ...new Post(rows[0]),
            pet: rows[0].pet
        }
    }

    static async update(id, { petId, postTime, pictureUrl, videoUrl, postText, likes }) {
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
            [petId, postTime, pictureUrl, videoUrl, postText, likes, id]
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
