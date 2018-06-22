'use strict';

const db = require('../db');

let maxOrder = 0;

exports.random = () => {
  const query = `
    select * from jok 
      where id > (select rand()*max(id) from jok)
      and enable = 1
    order by id limit 1
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        return reject(err);
      }

      return resolve(rows);
    });
  });
};

