const pool = require('../utils/pool');
const Pet = require('./Pet.js')

module.exports = class User {
    id;
    userName;
    firstName;
    lastName;
    creationDate;
    profilePicture;
    profileDescription;
    likes;

    constructor(row) {
        this.id = row.id;
        this.userName = row.user_name;
        this.firstName = row.first_name;
        this.lastName = row.last_name;
        this.creationDate = row.creation_date;
        this.profilePicture = row.profile_picture;
        this.likes = row.likes;
    }

    static async insert({ userName, firstName, lastName, profilePicture }) {

        const currentTime = new Date().toISOString();

        const { rows } = await pool.query(
            `INSERT INTO users
            (
                user_name,
                first_name,
                last_name,
                creation_date, 
                profile_picture,
                likes
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING *`,
            [userName, firstName, lastName, currentTime, profilePicture, []]
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
            GROUP BY pets.id`);

        return rows.map(row => new User(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT users.*,
            array_to_json(array_agg(pets.*)) AS pets
            FROM users
            JOIN subscriptions
                ON subscriptions.user_id = users.id
            JOIN pets
                ON pets.id = subscriptions.pet_id
            WHERE users.id = $1
            GROUP BY pets.id`, [id]);

        if (!rows[0]) throw new Error(`No User with id ${id}`);

        return {
            ...new User(rows[0]),
            pets: rows[0].pets.map(pet => new Pet(pet))
        }

    }

    static async update(id, { userName, firstName, lastName, creationDate, profilePicture, likes }) {
        const { rows } = await pool.query(`
            UPDATE users
            SET
            user_name = $1,
            first_name = $2,
            last_name = $3, 
            creation_date = $4,
            profile_picture = $5,
            likes = $6
            WHERE users.id = $7
            RETURNING *`,
            [userName, firstName, lastName, creationDate, profilePicture, likes, id]);

        return new Post(rows[0])
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM users
            WHERE id = $1
            RETURNING *`, [id]
        )

        return new Post(rows[0])
    }
}