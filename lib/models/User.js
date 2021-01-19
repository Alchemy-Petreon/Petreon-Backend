const pool = require('../utils/pool');
const Pet = require('./Pet.js')
const Post = require('./Post.js')

module.exports = class User {
    id;
    userName;
    firstName;
    email;
    creationDate;
    profilePicture;
    profileDescription;
    likes;

    constructor(row) {
        this.id = row.id;
        this.userName = row.user_name;
        this.firstName = row.first_name;
        this.email = row.email;
        this.creationDate = row.account_created;
        this.profilePicture = row.profile_picture;
        this.profileDescription = row.profile_description;
        this.likes = row.likes;
    }

    static async insert({ userName, firstName, email, profileDescription }) {
        const defaultPictureUrl = 'https://placekitten.com/150/150'
        const currentTime = new Date().toISOString();

        const { rows } = await pool.query(
            `INSERT INTO users
            (
                user_name,
                first_name,
                email,
                account_created, 
                profile_picture,
                profile_description,
                likes
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING *`,
            [
                userName,
                firstName,
                email,
                currentTime,
                defaultPictureUrl,
                profileDescription,
                0
            ]
        );
        return new User(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
            `SELECT users.*,
            array_to_json(array_agg(pets.*)) AS pets
            FROM users
            JOIN subscriptions
                ON subscriptions.user_id = users.id
            JOIN pets
                ON pets.id = subscriptions.pet_id
            GROUP BY users.id`);

        return rows.map(row => new User(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT users.*,
            array_to_json(array_agg(pets.*)) AS pets
            FROM users
            LEFT JOIN subscriptions
                ON subscriptions.user_id = users.id
            LEFT JOIN pets
                ON pets.id = subscriptions.pet_id
            WHERE users.id=$1
            GROUP BY users.id`, [id]);

        if (!rows[0]) throw new Error(`No User with id ${id}`);

        if (rows[0].pets[0] !== null) {
            rows[0].pets = rows[0].pets.map(pet => new Pet(pet))
        } else {
            rows[0].pets = []
        }

        return {
            ...new User(rows[0]),
            pets: rows[0].pets
        }

    }

    static async findByEmail(email) {
        const { rows } = await pool.query(
            `SELECT *
            FROM users
            WHERE email = $1`, [email]
        )
        if (!rows[0]) {
            return null;
        }

        return new User(rows[0]);
    }

    static async checkUserName(userName) {

        const { rows } = await pool.query(
            `SELECT *
            FROM users
            WHERE user_name = $1`, [userName]
        )

        if (!rows[0]) {
            return false;
        }
        return true;
    }

    static async update(email, { userName, firstName, profilePicture, profileDescription }) {
        const { rows } = await pool.query(`
            UPDATE users
            SET
            user_name = $1,
            first_name = $2,
            profile_picture = $3,
            profile_description = $4
            WHERE users.email = $5
            RETURNING *`,
            [userName, firstName, profilePicture, profileDescription, email]);

        return new User(rows[0])
    }

    static async updateProfilePicture(pictureUrl, email) {
        const { rows } = await pool.query(`
        UPDATE users
        SET
        profile_picture = $1
        WHERE users.email = $2
        RETURNING *
        `, [pictureUrl, email])

        return new User(rows[0])
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM users
            WHERE id = $1
            RETURNING *`, [id]
        )

        return new User(rows[0])
    }

    static async findSubscriptionsByEmail(userEmail) {
        const { rows } = await pool.query(`
        SELECT
        users.*,
        pets.*,
        posts.*
        FROM users
        LEFT JOIN subscriptions
            ON users.id = subscriptions.user_id
        LEFT JOIN pets
            ON subscriptions.pet_id = pets.id
        LEFT JOIN posts
            ON pets.id = posts.pet_id
        WHERE users.email = $1
        `, [userEmail])

        console.log('*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*')
        console.log('rows')
        console.log(rows)
        console.log('*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*(*')

        return rows
        // return rows.map(row => new Post(row))
    }

    static async addSubscription(userId, petId) {
        const { rows } = await pool.query(`
        INSERT INTO subscriptions
        (user_id, pet_id)
        VALUES
        ($1, $2)
        RETURNING *`, [userId, petId])
        console.log(rows)

    }
}

