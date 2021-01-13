const pool = require('../utils/pool');
const Pet = require('./Pet.js')

module.exports = class User {
    id;
    user_name;
    first_name;
    last_name;
    creation_date;
    profile_picture;
    profile_description;
    likes;

    constructor(row) {
        this.id = row.id;
        this.user_name = row.user_name;
        this.first_name = row.first_name;
        this.last_name = row.last_name;
        this.creation_date = row.creation_date;
        this.profile_picture = row.profile_picture;
        this.likes = row.likes;
    }

    static async insert({ user_name, first_name, last_name, profile_picture }) {

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
            [user_name, first_name, last_name, currentTime, profile_picture, []]
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
}