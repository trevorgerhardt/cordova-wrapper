
/**
 * Expose `alert`
 */

module.exports.alert = function(options, callback) {
  callback = callback || function(){};

  if (navigator.notification && navigator.notification.alert) {
    navigator.notification.alert(options.message, callback, options.title || 'Alert', options.buttonName || 'OK');
  } else {
    window.alert(options.message);
    callback();
  }
};

/**
 * Expose `confirm`
 */

module.exports.confirm = function(options, callback) {
  callback = callback || function(){};

  if (navigator.notification && navigator.notification.confirm) {
    navigator.notification.confirm(options.message, function(buttonIndex) {
      callback(buttonIndex === 1);
    }, options.title || 'Confirm', options.buttonNames || 'OK,Cancel');
  } else {
    callback(window.confirm(options.message));
  }
}

/**
 * Position vars
 */

var geolocationWatchId = null
  , defaultOptions = {
      maximumAge: 60000
    , timeout: 10000
    , enableHighAccuracy: true 
  };

/**
 * Expose `watchPosition`
 */

module.exports.watchPosition = function(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = defaultOptions;
  }

  if (navigator.geolocation && navigator.geolocation.getCurrentPosition && navigator.geolocation.watchPosition && navigator.geolocation.clearWatch) {
    if (geolocationWatchId) {
      navigator.geolocation.clearWatch(geolocationWatchId);
    }

    var firstTry = true;
    getCurrentPosition(options, function(err, position) {
      if (!firstTry) { 
        return;
      }
      firstTry = false;

      if (err || !position) {
        position = {
          coords: {
            longitude: 0
          , latitude: 0
          }
        };
      }

      if (callback) {
        callback(null, position);
      }

      geolocationWatchId = navigator.geolocation.watchPosition(function(position) {
        callback(null, position);
      }, callback, options);
    });
  } else {
    callback(new ReferenceError('Geolocation not available on this device.'));
  }
}

/**
 * Expose `getCurrentPosition`
 */

module.exports.getCurrentPosition = getCurrentPosition;
function getCurrentPosition(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = defaultOptions;
  }

  if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
    navigator.geolocation.getCurrentPosition(function(position) {
      callback(null, position);
    }, function(error) {
      callback(error);
    }, options);  
  } else {
    callback(new ReferenceError('Geolocation not available on this device.'));
  }
}
