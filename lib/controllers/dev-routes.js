const { Router } = require('express');
const ensureAuth = require('../auth/ensure-auth.js');
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
const Post = require('../models/Post.js');
const { petArray, postArray } = require('../sql/seed-data/seed-data.js')

module.exports = Router()
    .get('/seed/', ensureAuth, async (req, res, next) => {
        try {
            const user = await User.getByEmail(req.user);
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('user')
            console.log(user)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            const newPetArray = petArray.map(pet =>
                await Pet.insert({ ...pet, userId: user.id }))
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('newPetArray')
            console.log(newPetArray)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            const newPostArray = postArray.map(post =>
                newPetArray.map(pet =>
                    await Post.insert({ ...post, petId: pet.id })
                )
            )
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            console.log('newPostArray')
            console.log(newPostArray)
            console.log('-1-2-1-1-1-1-1-1-1-1-1-1-1-1-')
            res.send(200)
        } catch (e) {
            res.send(e.message)
        }
    
    )