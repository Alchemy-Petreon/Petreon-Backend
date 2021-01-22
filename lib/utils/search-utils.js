const pool = require('../utils/pool');
const Pet = require('../models/Pet.js')

module.exports = Search = async (searchQuery) => {

    searchQuery = `%${searchQuery}%`.toLowerCase()

    const { rows } = await pool.query(`
    SELECT * FROM pets
    WHERE 
    LOWER(type) LIKE $1 OR
    LOWER(pet_name) LIKE $1 OR
    LOWER (profile_description) LIKE $1
    `, [searchQuery])

    return rows.map(row => new Pet(row))
}   