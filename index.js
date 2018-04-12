'use strict';

const path = require('path');
const express = require('express');
const app = express();

const reporter = require('./src/reporter');
const info = require('./src/info/stealDailyInfo');

app.set('views', __dirname +'/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/report', (req, res) => {
  const query = req.query;  

  reporter
    .simple(query.startDate, query.endDate)
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


app.get('/info/daily', (req, res) => {
  info
    .get()
    .then(data => {
      res.json(data);
    })
    .catch(ex => {
      res.json(ex);
    });
});

app.listen(7001);
