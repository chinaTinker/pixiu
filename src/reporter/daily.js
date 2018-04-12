'use strict';

const db = require('../db');

const income = (date) => {
  return new Promise((resolve, reject) => {
    const sql = 'select * from income_record where date = ?';
    db.query(sql, [date], (err, rows) => {
      if (err) {
        return (err);
      }      

      return resolve(rows);
    });
  });
};

const outcome = (date) => {
  return new Promise((resolve, reject) => {
    const sql = 'select * from out_record where date = ?';
    db.query(sql, [date], (err, rows) => {
      if (err) {
        return reject(err);
      }

      return resolve(rows);
    });
  });
};

exports.report = (date) => {
  return Promise
    .all([income(date), outcome(date)])
    .then(datas => {      
      return {
        in: datas[0],
        out: datas[1],
      };
    })
    .catch(ex => {
      console.log(ex);
      return {in: [], out: []};
    });
};
