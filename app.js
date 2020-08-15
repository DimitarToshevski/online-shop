const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true })); // parsing the body (files need different parsers)

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);
