'use strict';

const db = require('../db');

const counter = (arr, key) => {
  if (!arr || !arr.length) {
    return 0;
  }

  let total = 0;
  for (let data of arr) {
    total += data[key];
  }

  return total;
}

const income = (date) => {
  return new Promise((resolve, reject) => {
    const sql = 'select * from income_record where date = ?';
    db.query(sql, [date], (err, rows) => {
      if (err) {
        return (err);
      }      

      return resolve({
        in: rows,
        in_total_amount: counter(rows, 'amount')
      });
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

      rows = rows || [];
      return resolve({
        out: rows,
        out_total_amount: counter(rows, 'amont')
      });
    });
  });
};

exports.report = (date) => {
  return Promise
    .all([income(date), outcome(date)])
    .then(datas => {      
      return Object.assign({}, datas[0], datas[1]);
    })
    .catch(ex => {
      console.log(ex);
      return {in: [], out: []};
    });
};
