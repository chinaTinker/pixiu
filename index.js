'use strict';

const path = require('path');
const express = require('express');
const app = express();

const reporter = require('./src/reporter');

app.set('views', __dirname +'/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/report', (req, res) => {
  reporter
    .simple()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/', (req, res) => {
  res.render('index', {});
});


app.listen(7001);
