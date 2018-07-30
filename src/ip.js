'use strict';

const http = require('http');

const API_URL = 'http://ip.taobao.com/service/getIpInfo.php';

exports.getLocation = (ip) => {
  if (!ip || ip === '') {
    return Promise.resolve('UNKNOW');
  }

  return new Promise((resolve, reject) => {
    http.get(`${API_URL}?ip=${ip}`, res => {
      let rawData = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
          console.log(rawData);
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>');

          let jsonData = JSON.parse(rawData);
          let data = jsonData.data;
          if (!data) {
            return resolve('UNKNOW');
          }

          resolve(`${data.country}${data.area}${data.region}${data.city}${data.county}${data.isp}`);
        } catch(ex) {
          reject(ex);
        }
      });
    });  
  });  
}
