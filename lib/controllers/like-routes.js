const { Router } = require('express');
const Like = require('../models/Like');
const ensureAuth = require('../auth/ensure-auth.js');


module.exports = Router()
    .post('/:id', ensureAuth, (res, req, next) => {
        Like
            .insert(req.user, req.params.id)
            .then(like => res.send(like))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (res, req, next) => {
        Like
            .delete(req.params.id)
            .then(like => res.send(like))
            .catch(next)
    })