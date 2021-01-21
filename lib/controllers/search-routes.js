const { Router } = require('express');
const Search = require('../utils/search-utils.js')
const ensureAuth = require('../auth/ensure-auth.js')

module.exports = Router()

    .get('/', async (req, res, next) => {
        const results = Search(req.query.search)
        console.log('&*&*&*&*&*&*&*&*&&*&*&*&*&&*&*&*&')
        console.log('results')
        console.log(results)
        console.log('&*&*&*&*&*&*&*&*&&*&*&*&*&&*&*&*&')
        res.send(results)

    })