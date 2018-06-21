'use strict';

const path = require('path');
const express = require('express');
const app = express();

const reporter = require('./src/reporter');
const info = require('./src/info/stealDailyInfo');
const jok = require('./src/jok')

const getDate = (year, month, day) => {
  const now = new Date();
  
  year = year || now.getFullYear();
  month = month || now.getMonth() + 1;
  day = day || now.getDate();

  return `${year}-${month}-${day}`;
};

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

app.get('/report/monthly', (req, res) => {
  const month = parseInt(req.query.month || new Date().getMonth() + 1);
  const startDate = getDate(null, month, 1);
  const endDate = getDate(null, month + 1, 1);

  reporter
    .simple(startDate, endDate)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/report/annual', (req, res) => {
  const startDate = getDate(null, 1, 1);
  const endDate = getDate();

  reporter
    .simple(startDate, endDate)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/report/daily', (req, res) => {
  let date = req.query.date || getDate();

  reporter
    .daily(date)
    .then(data => {
      res.json(data)
    })
    .catch(ex => {
      res.json(ex);
    });
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

app.get('/joks', (req, res) => {
  jok
    .random()
    .then(data => {
      res.render('joks', {jok: data[0]});
    })
    .catch(ex => {
      res.json({error: 1});
    });
});

app.listen(7001);
