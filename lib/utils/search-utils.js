const pool = require('../utils/pool');

module.exports = Search = async (searchQuery) => {

    searchQuery = `%${searchQuery}%`.toLowerCase()
    console.log('----------------------')
    console.log('searchQuery')
    console.log(searchQuery)
    console.log('----------------------')

    const { rows } = await pool.query(`
    SELECT * FROM pets
    WHERE 
    LOWER(type) LIKE $1 OR
    LOWER(pet_name) LIKE $1 OR
    LOWER (profile_description) LIKE $1
    `, [searchQuery])

    return rows
}   