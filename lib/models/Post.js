const pool = require('../utils/pool');
const Comment = require('../models/Comment.js');
var tz = require('timezone');

module.exports = class Post {
    id;
    petId;
    userId;
    postTime;
    mediaUrl;
    mediaType;
    postText;

    constructor(row) {
        this.id = row.id;
        this.petId = row.pet_id;
        this.userId = row.user_id;
        this.postTime = String(row.post_time);
        this.mediaUrl = row.media_url;
        this.mediaType = row.media_type;
        this.postText = row.post_text;
    }

    static async insert({ petId, userId, mediaUrl, mediaType, postText }) {

        const currentTime = new Date().toLocaleString("en-US", { timeZone: '	America/Los_Angeles' });

        console.log('----------------------')
        console.log('currentTime')
        console.log(currentTime)
        console.log('----------------------')


        const { rows } = await pool.query(
            `INSERT INTO posts
            (
                pet_id,
                user_id, 
                post_time,
                media_url,
                media_type,
                post_text
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING *`,
            [
                petId,
                userId,
                currentTime,
                mediaUrl,
                mediaType,
                postText,
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
            (SELECT COUNT(likes.id) FROM likes WHERE likes.post_id = posts.id) AS like_count,
            (SELECT COUNT(comments.id) FROM comments WHERE comments.post_id = posts.id) AS comment_count,
            array_to_json(array_agg(json_build_object(
			'userId', users.id,
			'userProfileURL', users.profile_picture,
			'userName', users.user_name,
			'commentId', comments.id,
			'postId', comments.post_id,
			'text', comments.text,
            'timestamp', comments.timestamp
			))) AS comments
            FROM posts
            LEFT JOIN comments
                ON posts.id  = comments.post_id
			LEFT JOIN users
                ON comments.user_id = users.id
            LEFT JOIN likes
                on posts.id = likes.post_id
            WHERE posts.id = $1
            GROUP BY posts.id`, [id]
        );

        if (!rows[0]) throw new Error(`No post with id ${id}`);

        return {
            ...new Post(rows[0]),
            commentCount: rows[0].comment_count,
            likeCount: rows[0].like_count,
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
            [mediaUrl, mediaType, postText, id]
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
