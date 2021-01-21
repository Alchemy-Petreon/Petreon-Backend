const pool = require('../utils/pool');

module.exports = Search = (searchQuery) => {

    searchQuery = `%${searchQuery}%`
    console.log('----------------------')
    console.log('searchQuery')
    console.log(searchQuery)
    console.log('----------------------')

    const { rows } = pool.query(`
    SELECT * FROM pets
    WHERE 
    type LIKE $1 OR 
    pet_name LIKE $1 OR
    profile_description LIKE $1
    `, [searchQuery])

    return rows
}   