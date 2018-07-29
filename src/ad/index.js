'use strict';

const db = require('../db');
const dateformat = require('date-format');

const now = () => {
  return dateformat('yyyy-MM-dd hh:mm:ss', new Date());
}

exports.getActiveAds = () => {
  let _now = now();

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        title, content, type, start_time AS startTime, end_time AS endTime 
      FROM ad_plan
      WHERE active  = 1 
      AND ( start_time is null or start_time <= ?)
      AND ( end_time is null or end_time >= ?)
    `;

    db.query(sql, [_now, _now], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (!rows || !rows.length) {
        return reject('no ads found');
      }
      return resolve(rows);
    });
  });
};