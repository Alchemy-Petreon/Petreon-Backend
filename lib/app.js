const express = require('express');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./utils/passport-setup.js')

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    domain: 'petreon-api.herokuapp.com',
    expires: '24h',
    secure: 'true'
}))

const isLoggedIN = (req, res, next) => {
    try {
        console.log('/----------------------')
        console.log('req.params')
        console.log(req.params)
        console.log('/----------------------')

        if (req.session) {
            next()
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send(e)
    }
}

app.use('/api/v1/pets', require('./controllers/pet-routes'));
app.use('/api/v1/users', require('./controllers/user-routes'));
app.use('/api/v1/posts', require('./controllers/post-routes'))
app.use('/api/v1/comments', require('./controllers/comment-routes'))

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure'
    }),
    function (req, res) {
        try {
            console.log('/----------------------')
            console.log('req.body.session.user in success')
            console.log(req._passport.session.user)
            console.log('/----------------------')

            res.redirect(`/auth/google/success?:${req._passport.session.user.email}`)

        } catch (err) {
            res.send(err)
        }
    }

);

app.get('/auth/google/failure', (req, res) =>
    res.send('You FAILED!'))

app.get('/auth/google/success:email', isLoggedIN, (req, res) =>
    res.send(`You GOT IN! ${req.body.email}`))

app.get('/logout', (req, res) => {
    req.session = null
    req.logout();
    res.redirect('/');
})


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
