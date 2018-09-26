'use strict';
(function () {
  var err;

  var getReaction = function (obj, onLoad, onError) {
    switch (obj.status) {
      case 200:
        onLoad(obj.response);
        break;

      case 400:
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
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;

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
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 1000;

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
