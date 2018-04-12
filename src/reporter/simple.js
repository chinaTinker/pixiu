'use strict';

const db = require('../db');

const cal = (rows) => {
  const data = {};
  for (let row of rows) {    
    const crrName = row.goods_name;
    data[crrName] = data[crrName] || {count: 0, total_amount: 0, price: 1500};
    data[crrName].count += row.amount;

    if (row.price > 0) {
      data[crrName].price = row.price;
    }

    data[crrName].total_amount += row.amount * data[crrName].price;
    data[crrName].avg_price = data[crrName].total_amount / data[crrName].count;
  }

  const dataArray = [];
  for (let key of Object.keys(data)) {
    let crrData = data[key];
    crrData.name = key;
    crrData.count = crrData.count.toFixed(2);
    crrData.total_amount = crrData.total_amount.toFixed(2);
    crrData.avg_price = crrData.avg_price.toFixed(2);
    dataArray.push(crrData);
  }

  return dataArray;
};

exports.report = (fromDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.query(`
      select * from income_record where date >= ? and date < ?
      `,
      [fromDate, endDate],
      (err, rows) => {
        if (err) {
          return reject(err);
        }

        return resolve(cal(rows));
      });
  });
};