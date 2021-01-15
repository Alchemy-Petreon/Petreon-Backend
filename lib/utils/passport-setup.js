const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User.js')

passport.serializeUser(function (user, done) {
    console.log('serialize!')
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserialize!')
    done(null, user)
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {

        if (await User.findByEmail(profile.email)) {
            return done(null, {
                email: profile.email,
                exisiting: true,
                firstName: profile.given_name,
            })
        } else {
            return done(null, {
                email: profile.email,
                exisiting: false,
                firstName: profile.given_name,
            })
        }
        // console.log('/----------------------')
        // console.log('profile')
        // console.log(profile)
        // console.log('/----------------------')

        // return done(null, profile);
    }
));
