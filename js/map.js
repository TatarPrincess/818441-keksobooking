'use strict';

(function () {
  var MIN_TOP_COORDINATE = 130;
  var MAX_BOTTOM_COORDINATE = 630;
  var mapEl = window.pin.mapEl;
  var mapPinMainEl = window.pin.mainEl;

  // ДОБАВЛЯЕМ СОБЫТИЯ
  mapPinMainEl.addEventListener('mousedown', function (evt) {
  // запоминаем первые стартовые координаты после нажатия мыши
    var dragged = false;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // функция обновляет стили перетаскивааемому элементу и обновляет адрес на форме
    var renewCoordsAddress = function (newX, newY) {
      var result = newX ? window.pageForm.setAddrCoords(newX, newY) : window.pageForm.setAddrCoords();
      window.pin.restyle(newX, newY);
      return result;
    };

    var getNewCoords = function (obj) {
    // накладываем границы перетаскивания на вычисленные новые координаты
      var applyLimits = function (rawNewCoordsObj) {
        var limits = {
          top: MIN_TOP_COORDINATE,
          right: mapEl.offsetWidth - mapPinMainEl.offsetWidth,
          bottom: MAX_BOTTOM_COORDINATE,
          left: 1
        };
        if (rawNewCoordsObj.x > limits.right) {
          rawNewCoordsObj.x = limits.right;
        }
        if (rawNewCoordsObj.x < limits.left) {
          rawNewCoordsObj.x = limits.left;
        }
        if (rawNewCoordsObj.y > limits.bottom) {
          rawNewCoordsObj.y = limits.bottom;
        }
        if (rawNewCoordsObj.y < limits.top) {
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

      var NewMapPinCoords = {
        x: mapPinMainEl.offsetLeft - shift.x,
        y: mapPinMainEl.offsetTop - shift.y
      };
      applyLimits(NewMapPinCoords);
      renewCoordsAddress(NewMapPinCoords.x, NewMapPinCoords.y);
    };

    var onMouseMove = function (moveEvt) {
      getNewCoords(moveEvt);
      dragged = true;
    };
    var onMouseUp = function (upEvt) {
      if (dragged) {
        window.pageForm.activate();
      } else {
        getNewCoords(upEvt);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();
