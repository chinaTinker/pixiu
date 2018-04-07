'use strict';

const path = require('path');
const express = require('express');
const app = express();

app.set('views', __dirname +'/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.listen(7001);
