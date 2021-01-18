const pool = require('../utils/pool');
const Comment = require('../models/Comment.js');

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
        this.postTime = String(row.post_time);
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
        console.log('[][][][][][][][][][][][][][]')
        console.log('rows')
        console.log(rows)
        console.log('[][][][][][][][][][][][][][]')

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

    static async update(id, { pictureUrl, videoUrl, postText }) {
        const { rows } = await pool.query(`
            UPDATE posts
            SET
            picture_url = $1,
            video_url = $2,
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
}
