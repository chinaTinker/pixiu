'use strict';

const db = require('../db');
const simple = require('./simple');
const daily = require('./daily');

exports.simple = simple.report;
exports.daily = daily.report;

exports.simpleBySql = (fromDate, endDate) => {
  if (!fromDate) {
    fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
  }

  if (!endDate) {
    endDate = new Date();
  }

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        goods_name AS name ,
        format(sum(amount), 2) AS total_count,
        format(sum(amount * price), 2) AS total_anount,
        format(sum(amount * price)  / sum(amount), 2) AS avg_price
      FROM 
        income_record
      WHERE 
        date >= ? AND date < ? AND price > 0
      GROUP BY goods_name
    `;

    db.query(sql, [fromDate, endDate], (err, row) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        fromDate: fromDate,
        endDate: endDate,
        data: row,
      });
    });
  });
};