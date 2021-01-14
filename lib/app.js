const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/v1/pets', require('./controllers/pet-routes'));
app.use('/api/v1/users', require('./controllers/user-routes'));
app.use('/api/v1/posts', require('./controllers/post-routes'))
app.use('/api/v1/comments', require('./controllers/comment-routes'))


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
