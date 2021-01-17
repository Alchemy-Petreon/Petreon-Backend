const { Router } = require('express');
const User = require('../models/User.js');
const ensureAuth = require('../auth/ensure-auth.js');
const upload = require('../middleware/s3-middleware.js');

module.exports = Router()

    .get('/email/', (req, res, next) => {
        User
            .findByEmail(req.user)
            .then(user => res.send(user))
            .catch(next)
    })

    .get('/username/:username', (req, res, next) => {
        console.log('inside username')
        User
            .checkUserName(req.params.username)
            .then(response => res.send(response))
            .catch(next)
    })

    .post('/', (req, res, next) => {
        User
            .insert({ ...req.body, email: req.user })
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

    .put('/:id', upload.single('profile_picture'), (req, res, next) => {
        User
            .update(req.params.id, { ...req.body, profilePicture: req.file.url })
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        User
            .delete(req.params.id)
            .then(user => res.send(user))
            .catch(next)
    })
