const pool = require('../utils/pool');

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
        this.accountCreated = row.account_created;
        this.petProfilePicture = row.profile_picture;
        this.petProfileDescription = row.profile_description;
        this.bannerPicture = row.banner_picture;
    }

    static async create({ userId, petName, type, accountCreated, petProfilePicture, petProfileDescription, bannerPicture }) {
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
            [userId, petName, type, accountCreated, petProfilePicture, petProfileDescription, bannerPicture]
        );
        return new Pet(rows[0]);
    }
    static async update(id, { userId, petName, type, accountCreated, petProfilePicture, petProfileDescription, bannerPicture }) {
        const { rows } = await pool.query(`
            UPDATE pets
            SET 
            user_id = $1,
            pet_name = $2,
            type = $3,
            account_created = $4,
            profile_picture = $5,
            profile_descriptiom = $6
            banner_picture = $7
            WHERE id = $8
            RETURNING *
            `,
            [userId, petName, type, accountCreated, petProfilePicture, petProfileDescription, bannerPicture, id]
        );

        return new Pet(rows[0]);
    }

    static async delete({ id, userId }) {
        const { rows } = await pool.query(
            `DELETE FROM pets 
            WHERE id=$1 
            AND user_id=$2 
            RETURNING *`,
            [id, userId]
        );
        return new Pet(rows[0]);
    }
};
