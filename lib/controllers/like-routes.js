const { Router } = require('express');
const Like = require('../models/Like');
const User = require('../models/User');
const ensureAuth = require('../auth/ensure-auth.js');


module.exports = Router()
    .post('/:id', ensureAuth, (req, res, next) => {

        console.log('{}{}{}{}{}{}{}{}{}{}{}{}')
        console.log('req.params.id')
        console.log(req.params.id)
        console.log('{}{}{}{}{}{}{}{}{}{}{}{}')

        Like
            .insert(req.user, req.params.id)
            .then(like => User.findById(like.userId))
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Like
            .delete(req.params.id)
            .then(like => User.findById(like.id))
            .then(user => res.send(user))
            .catch(next)
    })