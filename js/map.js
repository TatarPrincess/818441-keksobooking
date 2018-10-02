'use strict';

(function () {
  var mapEl = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');

  // ДОБАВЛЯЕМ СОБЫТИЯ
  mapPinMain.addEventListener('mousedown', function (evt) {
  // запоминаем первые стартовые координаты после нажатия мыши
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // функция обновляет стили перетаскивааемому элементу и обновляет адрес на форме
    var renewCoordsAddress = function (newX, newY) {
      var result = newX ? window.pageForm.setAddrCoords(newX, newY) : window.pageForm.setAddrCoords();
      window.pin.restylePin(newX, newY);
      return result;
    };
    var dragged = false;

    var getNewCoords = function (obj) {
    // накладываем границы перетаскивания на вычисленные новые координаты
      var applyLimits = function (rawNewCoordsObj) {
        var limits = {
          top: mapPinMain.offsetHeight,
          right: mapEl.offsetWidth - mapPinMain.offsetWidth,
          bottom: mapEl.offsetHeight - mapPinMain.offsetHeight,
          left: 1
        };
        if (rawNewCoordsObj.x > limits.right) {
          rawNewCoordsObj.x = limits.right;
        } else if (rawNewCoordsObj.x < limits.left) {
          rawNewCoordsObj.x = limits.left;
        }
        if (rawNewCoordsObj.y > limits.bottom) {
          rawNewCoordsObj.y = limits.bottom;
        } else if (rawNewCoordsObj.y < limits.top) {
          rawNewCoordsObj.y = limits.top;
        }
        return rawNewCoordsObj;
      };

      var shift = {
        x: startCoords.x - obj.clientX,
        y: startCoords.y - obj.clientY
      };

      startCoords = {
        x: obj.clientX,
        y: obj.clientY
      };

      var newMapPinCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };
      applyLimits(newMapPinCoords);
      renewCoordsAddress(newMapPinCoords.x, newMapPinCoords.y);
    };

    var onMouseMove = function (moveEvt) {
      getNewCoords(moveEvt);
      dragged = true;
    };
    var onMouseUp = function (upEvt) {
      if (dragged) {
        window.pageForm.pageActivate();
      } else {
        getNewCoords(upEvt);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    mapEl: mapEl
  };
})();
