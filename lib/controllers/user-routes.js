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

    .get(`/subscriptions/:id`, ensureAuth, async (req, res, next) => {
        const subscribed = await User.findOneSubscription(req.user, req.params.id)
        res.send(subscribed);
    })

    .get('/username/:username', ensureAuth, (req, res, next) => {
        User
            .checkUserName(req.params.username)
            .then(response => res.send(response))
            .catch(next)
    })

    .post('/picture', ensureAuth, upload.single('profilePicture'), async (req, res, next) => {
        const oldUserInfo = await User.findByEmail(req.user);
        const oldPictureKey = await oldUserInfo.profilePicture.split('com/')[1];
        await del(oldPictureKey);
        const user = await User.updateProfilePicture(req.file.url, req.user)
        res.send(user)

    })

    .get('/subscribe/:id', ensureAuth, async (req, res, next) => {
        const userInfo = await User.findByEmail(req.user)
        await User.addSubscription(userInfo.id, req.params.id)
        res.send(200)

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
