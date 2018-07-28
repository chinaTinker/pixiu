'use strict';

const db = require('../db');

const checkData = data => {
  if (!data) {
    return Promise.reject('data is null');
  }

  const valueArr = [];

  for (let key of ['name', 'phoneNo', 'dayFlow', 'address']) {
    let crrValue = data[key];
    if (!crrValue) {
      return Promise.reject(`data[${key}] is null`);
    }

    valueArr.push(crrValue);
  }

  return Promise.resolve(valueArr);
}

exports.saveInfo = (data) => {
  return checkData(data)
    .then(valueArr => {
      const sql = `
        insert into dispath_info(name, phone, day_flow, address)
        value(?, ?, ?, ?)
      `;

      db.query(sql, valueArr, (err, res) => {
        if (err) {
          throw new Error('failed to save db');
        }

        return true;
      });
    });
};  