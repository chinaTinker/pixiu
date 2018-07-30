'use strict';

const path = require('path');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

const reporter = require('./src/reporter');
const info = require('./src/info/stealDailyInfo');
const jok = require('./src/jok')
const visitor = require('./src/visitor');
const dispath = require('./src/dispath');
const ad = require('./src/ad');


const getDate = (year, month, day) => {
  const now = new Date();
  
  year = year || now.getFullYear();
  month = month || now.getMonth() + 1;
  day = day || now.getDate();

  return `${year}-${month}-${day}`;
};

app.set('trust proxy', true);
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
  ad
    .getActiveAds()
    .then(ads => {
      return {view: 'ad', ad: ads[0]};
    })
    .catch(ex => {      
      console.log(ex);

      return jok.get().then(joks => {
        return {view: 'joks', jok: joks[0]};
      });
    })
    .then(data => {      
      res.render(data.view, data);
    })
    .catch(ex => {
      res.json({error: 1});
    });
});

app.get('/jok/random', (req, res) => {
  jok
    .random()
    .then(arr => {
      res.json(arr[0]);
    })
    .catch(ex => {
      res.json({error: 1});
    });
});

app.get('/jok/:id', (req, res) => {
  jok
    .get(req.params.id)
    .then(arr => {
      if (arr.length > 0) {
        res.json(arr[0]);
      } else {
        res.json({error: 1});
      }
    })
    .catch(ex => {
      res.json({error: 1});
    });
});

app.get('/visit', (req, res) => {
  visitor.saveInfo(req);
  res.json({success: 1});
});

// 分发信息
app.get('/dispath', (req, res) => {

  // TODO

  res.render('dispath', {});
});

// 保存分发信息
app.get('/dispath/info', (req, res) => {
  dispath
    .saveInfo(req.query)
    .then(result => {
      res.json({success: 1});
    })
    .catch(ex => {
      res.json({success: 0});
    });
});

app.get('/dispath/info/summary', (req, res) => {
  Promise
    .all([dispath.getInfo(), visitor.getVisitCount()])
    .then(result => {
      let data = result[0];
      data.visitCount = result[1].visitCount || 0;
      return data;
    })
    .then(data => {
      res.json({success: 1, data: data})
    })
    .catch(ex => {
      res.json({success: 0, error: ex});
    });
});

app.listen(7001);

console.log('app listen on 7001');
