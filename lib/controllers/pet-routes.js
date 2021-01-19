const { Router } = require('express');
const Pet = require('../models/Pet');
const ensureAuth = require('../auth/ensure-auth.js');
const upload = require('../middleware/s3-middleware.js');
const { del } = require('../utils/s3-storage');


module.exports = Router()
    .post('/', ensureAuth, (req, res, next) => {
        Pet
            .create(req.body)
            .then(pet => res.send(pet))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Pet
            .find()
            .then(posts => res.send(posts))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Pet
            .findById(req.params.id)
            .then(posts => res.send(posts))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Pet
            .update(req.params.id, req.body)
            .then(user => res.send(user))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Pet
            .update(req.params.id, req.body)
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Pet
            .delete(req.params.id)
            .then(pet => res.send(pet))
            .catch(next);
    })

    .get('/user/:id', (req, res, next) => {
        Pet
            .findByUser(req.params.id)
            .then(petArray => res.send(petArray))
            .catch(next);
    })

    .post('/picture/:id', ensureAuth, upload.single('petProfilePicture'), async (req, res, next) => {
        const oldPetInfo = await Pet.findById(req.params.id);
        const oldPictureKey = await oldPetInfo.petProfilePicture.split('com/')[1];
        await del(oldPictureKey);
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')
        console.log('oldPictureKey')
        console.log(oldPictureKey)
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')

        const pet = await Pet.updateProfilePicture(req.file.url, req.params.id)
        res.send(pet)
    })

    .post('/banner/:id', ensureAuth, upload.single('bannerPicture'), async (req, res, next) => {
        console.log('--------------------------')
        const oldPetInfo = await Pet.findById(req.params.id);
        const oldPictureKey = await oldPetInfo.bannerPicture.split('com/')[1];
        await del(oldPictureKey);
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')
        console.log('oldPictureKey')
        console.log(oldPictureKey)
        console.log(')_)_)_)_)_)_)_)_)_)_)_)_)_)')

        const pet = await Pet.updateBannerPicture(req.file.url, req.params.id)
        res.send(pet)
    })

