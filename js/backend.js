'use strict';
(function () {
  var SUCCESSFUL_XHR_REQUEST_CODE = 200;
  var ILL_XHR_REQUEST_CODE = 400;
  var XHR_TIMEOUT = 10000;
  var err;
  var xhr;

  var setXhrAndHandleReqErr = function (onError) {
    xhr = new XMLHttpRequest();
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = XHR_TIMEOUT;
    return xhr;
  };
  var getReaction = function (obj, onLoad, onError) {
    switch (obj.status) {
      case SUCCESSFUL_XHR_REQUEST_CODE:
        onLoad(obj.response);
        break;

      case ILL_XHR_REQUEST_CODE:
        err = 'Неверный запрос';
        break;

      default:
        err = 'Статус ответа: ' + obj.status + ' ' + obj.statusText;
        break;
    }
    if (err) {
      onError(err);
    }
  };

  var load = function (onLoad, onError) {

    setXhrAndHandleReqErr(onError);
    xhr.responseType = 'json';
    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');

    xhr.addEventListener('load', function () {
      try {
        getReaction(xhr, onLoad, onError);
      } catch (error) {
        onError(error.message);
      }
    });

    xhr.send();
  };

  var save = function (data, onLoad, onError) {

    setXhrAndHandleReqErr(onError);
    xhr.responseType = 'json';
    xhr.open('POST', 'https://js.dump.academy/keksobooking');

    xhr.addEventListener('load', function () {
      try {
        getReaction(xhr, onLoad, onError);
      } catch (error) {
        onError(error.message);
      }
    });

    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
