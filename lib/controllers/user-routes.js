const { Router } = require('express');
const User = require('../models/User.js');
const ensureAuth = require('../auth/ensure-auth.js');
const upload = require('../middleware/s3-middleware.js');
const { del } = require('../utils/s3-storage');

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

    .post('/picture', ensureAuth, upload.single('profilePicture'), async (req, res, next) => {
        const oldUserInfo = User.findByEmail(req.user);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        console.log('oldUserInfo')
        console.log(oldUserInfo);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')

        const oldPictureKey = user.profilePicture.slice('com/')[1];
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        console.log('oldPictureKey')
        console.log(oldPictureKey);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        const response = await del(oldPictureKey);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        console.log('response')
        console.log(response);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        const user = await User.updateProfilePicture(req.file.url, req.user)
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')
        console.log('user')
        console.log(user);
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0')

        res.send(user)

        User
            .findByEmail(req.user)
            .then(user => del(user.profilePicture.slice('com/')[1]))
            .then(User.updateProfilePicture(req.file.url, req.user))
            .then(user => res.send(user))
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
