const { Router } = require('express');
const User = require('../models/User.js');
const ensureAuth = require('../auth/ensure-auth.js')

module.exports = Router()

    .get('/email/:email', ensureAuth, (req, res, next) => {
        User
            .findByEmail(req.params.email)
            .then(user => res.send(user))
            .catch(next)
    })

    .post('/', (req, res, next) => {
        User
            .insert(req.body)
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        User
            .find()
            .then(users => res.send(users))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        User
            .findById(req.params.id)
            .then(user => res.send(user))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        User
            .update(req.params.id, req.body)
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        User
            .delete(req.params.id)
            .then(user => res.send(user))
            .catch(next)
    })
