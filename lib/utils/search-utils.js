const pool = require('../utils/pool');

module.exports = Search = async (searchQuery) => {

    searchQuery = `%${searchQuery}%`
    console.log('----------------------')
    console.log('searchQuery')
    console.log(searchQuery)
    console.log('----------------------')

    const { rows } = await pool.query(`
    SELECT * FROM pets
    WHERE 
    type COLLATE UTF8_GENERAL_CI LIKE $1 OR
    pet_name COLLATE UTF8_GENERAL_CI LIKE $1 OR
    profile_description COLLATE UTF8_GENERAL_CI LIKE $1
    `, [searchQuery])

    return rows
}   