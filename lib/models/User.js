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
    venmo;
    likes;

    constructor(row) {
        this.id = row.id;
        this.userName = row.user_name;
        this.firstName = row.first_name;
        this.email = row.email;
        this.creationDate = row.account_created;
        this.profilePicture = row.profile_picture;
        this.profileDescription = row.profile_description;
        this.venmo = row.venmo;
        this.likes = row.likes;
    }

    static async insert({ userName, firstName, email, profileDescription, venmo }) {
        const defaultPictureUrl = 'https://placekitten.com/150/150'
        const currentTime = new Date().toLocaleString("en-US");

        const { rows } = await pool.query(
            `INSERT INTO users
            (
                user_name,
                first_name,
                email,
                account_created, 
                profile_picture,
                profile_description,
                venmo,
                likes
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8
            ) RETURNING *`,
            [
                userName,
                firstName,
                email,
                currentTime,
                defaultPictureUrl,
                profileDescription,
                venmo,
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
            array_to_json(array_agg(pets.*)) AS pets,
            array_to_json(array_agg(likes.*)) AS likes
            FROM users
            LEFT JOIN subscriptions
                ON subscriptions.user_id = users.id
            LEFT JOIN pets
                ON pets.id = subscriptions.pet_id
            LEFT JOIN likes
                ON users.id = likes.user_id 
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
            `SELECT users.*,
            array_to_json(array_agg(pets.*)) AS pets,
            array_to_json(array_agg(likes.*)) AS likes
            FROM users
            LEFT JOIN subscriptions
                ON subscriptions.user_id = users.id
            LEFT JOIN pets
                ON pets.id = subscriptions.pet_id
            LEFT JOIN likes
                ON users.id = likes.user_id 
            WHERE users.email=$1
            GROUP BY users.id`, [email]
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

    static async update(email, { userName, firstName, profilePicture, profileDescription, venmo }) {
        const { rows } = await pool.query(`
            UPDATE users
            SET
            user_name = $1,
            first_name = $2,
            profile_picture = $3,
            profile_description = $4,
            venmo = $5
            WHERE users.email = $6
            RETURNING *`,
            [userName, firstName, profilePicture, profileDescription, venmo, email]);

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
        SELECT json_agg(json_build_object(
            'id', posts.id,
            'userId', posts.user_id,
            'petId', posts.pet_id,
            'petName', pets.pet_name,
            'petProfileURL', pets.profile_picture,
            'postTime', posts.post_time,
            'mediaURL', posts.media_url,
            'mediaType', posts.media_type,
            'postText', posts.post_text,
            'likes', posts.likes
            ) ORDER BY posts.post_time DESC) AS posts
            FROM users
            LEFT JOIN subscriptions
                ON users.id = subscriptions.user_id
            LEFT JOIN pets
                ON subscriptions.pet_id = pets.id
            INNER JOIN posts
                ON pets.id = posts.pet_id
            WHERE users.email = $1
        `, [userEmail])


        return rows[0].posts
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

    static async unsubscribe(userId, petId) {
        const { rows } = await pool.query(
            `DELETE FROM subscriptions
            WHERE user_id = $1
            AND pet_id = $2
            RETURNING *`, [userId, petId]
        )

        return rows[0];
    }

    static async findOneSubscription(userEmail, petId) {

        const { rows } = await pool.query(`
        SELECT *
        FROM subscriptions
        INNER JOIN users
            ON subscriptions.user_id = users.id
        WHERE users.email = $1
        AND pet_id = $2
        `, [userEmail, petId])

        if (rows.length > 0) {
            return true;
        }
        return false;
    }

}

