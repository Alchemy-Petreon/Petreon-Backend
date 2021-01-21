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
    type LIKE $1
    `, [searchQuery])

    return rows
}   