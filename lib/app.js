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


app.use('/api/v1/pets', require('./controllers/pet-routes'));
app.use('/api/v1/users', require('./controllers/user-routes'));
app.use('/api/v1/posts', require('./controllers/post-routes'))
app.use('/api/v1/comments', require('./controllers/comment-routes'))

app.use('/api/v1/auth', require('./controllers/auth-routes.'))


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
