const pool = require('../utils/pool');
const Post = require('../models/Post.js');
module.exports = class Pet {
    id;
    userId;
    petName;
    type;
    accountCreated;
    petProfilePicture;
    petProfileDescription;
    bannerPicture;


    constructor(row) {
        this.id = String(row.id);
        this.userId = String(row.user_id);
        this.petName = row.pet_name;
        this.type = row.type;
        this.accountCreated = String(row.account_created);
        this.petProfilePicture = row.profile_picture;
        this.petProfileDescription = row.profile_description;
        this.bannerPicture = row.banner_picture;
    }

    static async create({ userId, petName, type, petProfilePicture, petProfileDescription, bannerPicture }) {

        const currentTime = new Date().toISOString();

        const { rows } = await pool.query(
            `INSERT INTO pets 
            (
                user_id, 
                pet_name, 
                type, 
                account_created, 
                profile_picture, 
                profile_description, 
                banner_picture
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING *`,
            [userId, petName, type, currentTime, petProfilePicture, petProfileDescription, bannerPicture]
        );
        return new Pet(rows[0]);
    }

    static async update(id, { petName, petProfilePicture, petProfileDescription, bannerPicture }) {
        const { rows } = await pool.query(`
            UPDATE pets
            SET 
            pet_name = $1,
            profile_picture = $2,
            profile_description = $3,
            banner_picture = $4
            WHERE id = $5
            RETURNING *
            `,
            [petName, petProfilePicture, petProfileDescription, bannerPicture, id]
        );

        return new Pet(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
            `SELECT * FROM pets`

        );

        return rows.map(row => new Pet(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT pets.*,
            array_to_json (array_agg(posts.*)) AS posts
            FROM pets
                LEFT JOIN  posts
                ON posts.pet_id = pets.id
            WHERE pets.id = $1
            GROUP BY pets.id
            `, [id]
        );
        if (!rows[0]) throw new Error(`No pets found with id of ${id}`);

        if (rows[0].posts[0] !== null) {
            rows[0].posts = rows[0].posts.map(post => new Post(post))
        } else {
            rows[0].posts = []
        }
        return {
            ...new Pet(rows[0]),
            posts: rows[0].posts.map(post => new Post(post))
        };
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM pets 
            WHERE id=$1
            RETURNING *`,
            [id]
        );
        return new Pet(rows[0]);
    }

    static async findByUser(id) {
        const { rows } = await pool.query(
            `SELECT *
            FROM pets
            WHERE user_id = $1
            `, [Number(id)]
        );
        return rows
    }

    static async updateProfilePicture(fileUrl, petId) {
        const { rows } = await pool.query(
            `
            UPDATE pets
            SET
            profile_picture = $1
            WHERE id = $2
            `, [fileUrl, petId]
        )
        return new Pet(rows[0])
    }

    static async updateBannerPicture(fileUrl, petId) {
        const { rows } = await pool.query(
            `
            UPDATE pets
            SET
            banner_picture = $1
            WHERE id = $2
            `, [fileUrl, petId]
        )
        return new Pet(rows[0])
    }
};
