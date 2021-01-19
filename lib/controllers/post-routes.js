const { Router } = require('express');
const Post = require('../models/Post.js');
const User = require('../models/User.js')
const ensureAuth = require('../auth/ensure-auth.js');
const upload = require('../middleware/s3-middleware.js');


module.exports = Router()

    .post('/', ensureAuth, (req, res, next) => {
        Post
            .insert(req.body)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/', ensureAuth, (req, res, next) => {
        Post
            .find()
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/:id', ensureAuth, (req, res, next) => {
        Post
            .findById(req.params.id)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        Post
            .update(req.params.id, req.body)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Post
            .delete(req.params.id)
            .then(posts => res.send(posts))
            .catch(next)
    })

    .post('/media/:id', ensureAuth, upload.single('mediaFile'), async (req, res, next) => {

        const oldPostInfo = await Post.findById(req.params.id);
        if (oldPostInfo.mediaUrl) {
            const oldPictureKey = await oldPostInfo.mediaUrl.split('com/')[1];
            await del(oldPictureKey);
        }
        const updatedPost = await Post.updateMedia(req.file.url, req.params.type, req.params.id)
        res.send(updatedPost)

    })

    .get('/subscriptions', ensureAuth, async (req, res, next) => {
        console.log(req.user)
        const postArray = await User.findSubscriptionsByEmail(req.user);
        res.send(postArray)

    })