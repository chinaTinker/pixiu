'use strict';

const db = require('../db');

const checkData = data => {
  if (!data) {
    return Promise.reject('data is null');
  }

  const valueArr = [];

  for (let key of ['name', 'phoneNo', 'dayFlow', 'address', 'saleAmount']) {
    let crrValue = data[key];
    if (!crrValue) {
      return Promise.reject(`data[${key}] is null`);
    }

    valueArr.push(crrValue);
  }

  return Promise.resolve(valueArr);
}

exports.isExisted = (name, phone, addr) => {  
  return new Promise((resolve, reject) => {
    const sql = `
      select 1 as tag from dispath_info 
      where name = ? and phone = ? and address = ?`;

    db.query(sql, [name, phone, addr], (err, rows) => {
      if (err) {
        return reject(err);
      }

      let row = rows[0] || {}; 
      resolve(!!row.tag);
    });
  });
};

exports.saveInfo = (data) => {
  return this.isExisted(data.name, data.phoneNo, data.address)
    .then(x => {
      if (x) {
        throw new Error('data existed');
      }

      return checkData(data)
        .then(valueArr => {
          const sql = `
            insert into dispath_info(name, phone, day_flow, address, sale_amount)
            value(?, ?, ?, ?, ?)
          `;

          db.query(sql, valueArr, (err, res) => {
            if (err) {
              throw new Error('failed to save db');
            }

            return true;
          });
          return true;
        });
    });
};

exports.getInfo = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        count(DISTINCT NAME, phone) AS merchantCount,
        sum(day_flow) AS summaryDayFlow,
          sum(sale_amount) AS summarySaleAmount
      FROM dispath_info
    `;

    db.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      
      if (!rows || !rows.length) {
        return reject('no record found');
      }

      return resolve(rows[0]);
    });
  });
};


