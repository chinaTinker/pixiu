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

exports.get = (id) => {
  let query = 'select * from jok where id = ? and enable = 1';
  if (!id) {
    query = 'select * from jok where enable = 1 order by id limit 1';
  }

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, rows) => {
      if (err) {
        return reject(err);
      }

      return resolve(rows);
    });
  });
};

