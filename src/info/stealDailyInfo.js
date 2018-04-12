'use strict';

const http = require('http');
const htmlparser = require('htmlparser2');

const infoParser = (html) => {
  let isTableOpen = false;  
  let isTdOpen = false;
  let count = 0;
  const keys = ['location', 'name', 'price', 'status'];
  const datas = [];

  const _paser = new htmlparser.Parser({
    onopentag: function(name, attrs) {      
      if (name === 'table' && attrs.class === 'f1_tbl f_12 clr_3') {
        isTableOpen = true;
      }

      if (isTableOpen && name === 'td') {
        isTdOpen = true;
      }
    },
    ontext: function(text) {
      if (isTdOpen) {
        const key = keys[count % 4];
        const index = count / 4 | 0;       
        if (!datas[index]) {
          datas[index] = {};
        }
        datas[index][key] = text;
        count++;
      }      
    },
    onclosetag: function(name) {
      if (name === 'td') {
        isTdOpen = false;
      } else if (name === 'table') {
        isTableOpen = false;
      }
    }
  });

  _paser.write(html);
  _paser.end();

  return datas;
};

exports.get = () => {
  return new Promise((resolve, reject) => {
    http.get('http://www.feigang.net/', res => {
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        resolve(infoParser(rawData));
      });
    });
  });
};
