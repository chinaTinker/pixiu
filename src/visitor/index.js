'use strict';

const db = require('../db');

exports.saveInfo = (req) => {
  const ip = req.ip;
  const para = req.query;
  
  return new Promise((resolve, reject) => {
    const sql = `
      insert into visit_record
        (ip, longtitude, latitude, location)
      value
        (?, ?, ?, ?)
    `;

    db.query(sql, [ip, para.longitude || '', para.latitude || '', 'HangZhou'], (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(1);
    })
  });
};
