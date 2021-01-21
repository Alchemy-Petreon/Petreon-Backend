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
    `, [searchQuery])

    return rows
}   