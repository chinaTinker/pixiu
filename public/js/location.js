// 记录用户的访问记录
// 包括经纬度
(function() {
  function keepVisit(longitude, latitude) {
    const data = {
      longitude: longitude,
      latitude: latitude
    };
    $.get('visit', data, res => {
      // do nothing
    });
  }

  function uploadInfo(position) {
    const coords = position.coords || {};    
    keepVisit(coords.longitude, coords.latitude);
  };

  function onerror(err) {        
    err = err || {};

    let errInfo = 'unknown';
    switch(err.code) {
      case err.PERMISSION_DENIED:
        errInfo = 'PERMISSION_DENIED';
        break;
      case err.POSITION_UNAVAILABLE:
        errInfo = 'POSITION_UNAVAILABLE';
        break;          
    }

    keepVisit(errInfo, errInfo);
  }
  
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(uploadInfo, onerror);
  } else {
    keepVisit('NOT_SUPPORTED', 'NOT_SUPPORTED');
  }

})();
