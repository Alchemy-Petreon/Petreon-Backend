const { Router } = require('express');
const passport = require('passport');
const authServices = require('../auth/auth-services.js')


const attachCookie = (res, user) => {
    res.cookie('session', authServices.authToken(user), {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
        secure: true,
        // domain: 'petreon.netlify.com'
        // secure: true,
    });
};

module.exports = Router()

    .get('/google',
        passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
        ))

    .get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/auth/google/failure'
        }),
        async function (req, res) {
            try {
                attachCookie(res, req._passport.session.user.email)

                res.redirect(
                    `${process.env.CLIENT_SIDE_REDIRECT}${req._passport.session.user.email}/${req._passport.session.user.firstName}/${req._passport.session.user.exisiting}`)

            } catch (err) {
                res.send(err)
            }
        }

    )

    .get('/logout', ensureAuth, (req, res) => {
        req.session = null
        req.logout();
        res.redirect(process.env.LOGOUT_REDIRECT);
    })

    .get('/test', (req, res) => {
        console.log('test-route')
        attachCookie(res, "test");
        res.send(200)
    })
