const { Router } = require('express');
const Search = require('../utils/search-utils.js')
const ensureAuth = require('../auth/ensure-auth.js')

module.exports = Router()

    .get('/', async (req, res, next) => {
        return Search(req.query.search)
            .then(results => res.send(results))
            .catch(next);
    })