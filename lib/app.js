const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/v1/pets', require('./controllers/pets'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
