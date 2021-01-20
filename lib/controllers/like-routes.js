const { Router } = require('express');
const Post = require('../models/Post');
const ensureAuth = require('../auth/ensure-auth.js');


module.exports = Router()
    .post('/:id', ensureAuth, (res, req, next) => {
        console.log('jhi')
    })