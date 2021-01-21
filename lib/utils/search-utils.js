const pool = require('../utils/pool');

module.exports = Search = (searchQuery) => {
    console.log('----------------------')
    console.log('searchQuery')
    console.log(searchQuery)
    console.log('----------------------')

    const { rows } = pool.query(`
        SELECT * FROM pets
        WHERE type || name || profile_description 
        LIKE '%$1%'
    `, [searchQuery])
    return searchQuery
}   