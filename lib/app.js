const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
require('./utils/passport-setup.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('cookie-parser')());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/pets', require('./controllers/pet-routes'));
app.use('/api/v1/users', require('./controllers/user-routes'));
app.use('/api/v1/posts', require('./controllers/post-routes'));
app.use('/api/v1/comments', require('./controllers/comment-routes'));
app.use('/api/v1/auth', require('./controllers/auth-routes'));
app.use('/api/v1/likes', require('./controllers/like-routes'));
app.use('/api/v1/search', require('./controllers/search-routes'));

app.use('/api/v1/dev', require('./controllers/dev-routes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
