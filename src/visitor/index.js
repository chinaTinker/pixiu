'use strict';

const db = require('../db');
const ipLocation = require('../ip');

exports.saveInfo = (req) => {
  const ip = req.ip;
  const para = req.query;
  
  return ipLocation
    .getLocation(ip)
    .catch(ex => {
      console.log(ex);
      return 'UNKNOW';
    })
    .then(location => {
      const sql = `
        insert into visit_record
          (ip, longtitude, latitude, location)
        value
          (?, ?, ?, ?)
      `;

      db.query(sql, [ip, para.longitude || '', para.latitude || '', location], (err, res) => {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
      })
      return 1;
    });
};

exports.getVisitCount = () => {
  return new Promise((resolve, reject) => {
    const sql = `select count(id) as visitCount from visit_record`;
    db.query(sql, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (!res || !res.length) {
        return resolve({visitCount: 0});
      }
      return resolve(res[0]);
    });
  });
};
