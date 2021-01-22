const { Router } = require('express');
const Search = require('../utils/search-utils.js')
const ensureAuth = require('../auth/ensure-auth.js')

module.exports = Router()

    .get('/', async (req, res, next) => {
        console.log('FOUND!')
        const results = await Search(req.query.search)

        res.send(results)

    })