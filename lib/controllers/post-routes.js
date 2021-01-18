const { Router } = require('express');
const Post = require('../models/Post.js');
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

    .post('/media/:id', ensureAuth, upload.single('mediaUrl'), async (req, res, next) => {
        const oldPostInfo = await Post.findById(req.params.id);
        if (oldPostInfo.mediaUrl) {
            const oldPictureKey = await oldPostInfo.mediaUrl.split('com/')[1];
            await del(oldPictureKey);
        }
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')
        console.log('oldPictureKey')
        console.log(oldPictureKey)
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')
        const updatedPost = await Post.updateMedia(req.file.url, req.params.type, req.params.id)
        res.send(updatedPost)

    })
