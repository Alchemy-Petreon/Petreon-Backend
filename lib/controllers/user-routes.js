const { Router } = require('express');
const User = require('../models/User.js');
const ensureAuth = require('../auth/ensure-auth.js');
const upload = require('../middleware/s3-middleware.js');

module.exports = Router()


    .get('/email/', ensureAuth, (req, res, next) => {
        User
            .findByEmail(req.user)
            .then(user => res.send(user))
            .catch(next)
    })

    .get('/username/:username', ensureAuth, (req, res, next) => {
        User
            .checkUserName(req.params.username)
            .then(response => res.send(response))
            .catch(next)
    })

    .post('/', ensureAuth, (req, res, next) => {
        User
            .insert({ ...req.body, email: req.user })
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/', ensureAuth, (req, res, next) => {
        User
            .find()
            .then(users => res.send(users))
            .catch(next);
    })

    .get('/:id', ensureAuth, (req, res, next) => {
        User
            .findById(req.params.id)
            .then(user => res.send(user))
            .catch(next);
    })

    .post('/picture', ensureAuth, upload.single('profilePicture'), (req, res, next) => {
        User
            .updateProfilePicture(req.file.url, req.user)
            .then(res.send(req.file.url))
            .catch(next);
    })

    .put('/', ensureAuth, (req, res, next) => {
        User
            .update(req.user, { ...req.body, email: req.user })
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        User
            .delete(req.params.id)
            .then(user => res.send(user))
            .catch(next)
    })
