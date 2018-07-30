// 记录用户的访问记录
// 包括经纬度
(function() {
  function uploadInfo(position) {
    const coords = position.coords;
    const data = {
      longitude: coords.longitude,
      latitude: coords.latitude
    };

    $.get('visit', data, res => {
      // do nothing
    });
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

    const data = {
      longitude: errInfo,
      latitude: errInfo
    };

    $.get('visit', data, res => {
      // do nothing
    });
  }
  
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(uploadInfo, onerror);
  }

})();
