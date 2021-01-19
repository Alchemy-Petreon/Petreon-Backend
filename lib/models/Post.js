const pool = require('../utils/pool');
const Comment = require('../models/Comment.js');

module.exports = class Post {
    id;
    petId;
    postTime;
    mediaUrl;
    mediaType;
    postText;
    likes;

    constructor(row) {
        this.id = row.id;
        this.petId = row.pet_id;
        this.postTime = String(row.post_time);
        this.mediaUrl = row.media_url;
        this.mediaType = row.media_type;
        this.postText = row.post_text;
        this.likes = row.likes;
    }

    static async insert({ petId, mediaUrl, mediaType, postText }) {

        const currentTime = new Date().toISOString();

        const { rows } = await pool.query(
            `INSERT INTO posts
            (
                pet_id, 
                post_time,
                media_url,
                media_type,
                post_text,
                likes
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING *`,
            [
                petId,
                currentTime,
                mediaUrl,
                mediaType,
                postText,
                0
            ]
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
            `SELECT posts.*,
            array_to_json(array_agg(comments.*)) AS comments
            FROM posts
            LEFT JOIN comments
            ON posts.id  = comments.post_id
            WHERE posts.id = $1
            GROUP BY posts.id
            `, [id]
        );

        if (!rows[0]) throw new Error(`No post with id ${id}`);

        if (rows[0].comments[0] !== null) {
            rows[0].comments = rows[0].comments.map(comment => new Comment(comment))
        } else {
            rows[0].comments = []
        }

        return {
            ...new Post(rows[0]),
            comments: rows[0].comments
        }
    }

    static async update(id, { mediaUrl, mediaType, postText }) {
        const { rows } = await pool.query(`
            UPDATE posts
            SET
            media_url = $1,
            media_type = $2,
            post_text = $3
            WHERE id = $4
            RETURNING *
            `,
            [pictureUrl, videoUrl, postText, id]
        );

        return new Post(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM posts
            CASCADE WHERE id = $1
            RETURNING *`,
            [id]
        );

        return new Post(rows[0]);
    }

    static async updateMedia(mediaUrl, mediaType, postId) {
        const { rows } = await pool.query(
            `
            UPDATE posts
            SET
            media_url = $1,
            media_type = $2
            WHERE id = $3
            RETURNING *
            `, [mediaUrl, mediaType, postId]
        )

        return new Post(rows[0])
    }
}
