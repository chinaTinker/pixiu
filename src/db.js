'use strict';

/*
 * mysql db helper
 *
 * boniu.xyf@alibaba-inc.com
 * 2018-4-7
 */
const settings = require('../conf/db-mysql-conf.js');
const mysql = require('mysql');
const pool = mysql.createPool(settings);

module.exports = pool;