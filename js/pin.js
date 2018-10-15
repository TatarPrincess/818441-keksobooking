'use strict';

(function () {
  var MAX_PIN_QUANTITY = 5;
  var mapPinMainEl = document.querySelector('.map__pin--main');
  var mainPinX = mapPinMainEl.style.left;
  var mainPinY = mapPinMainEl.style.top;
  var pinElCollection;
  var pinElCollArr;
  var mapEl = document.querySelector('.map');

  // создаем dom-элемент пина
  var createDomElementPin = function (objectItem) {

    var template = document.querySelector('#pin').content.querySelector('button');
    var domEl = template.cloneNode(true);
    var pinHeigth = domEl.querySelector('img').height;
    var pinWidth = domEl.querySelector('img').width;

    domEl.style.left = (objectItem.location.x - pinWidth) + 'px';
    domEl.style.top = (objectItem.location.y - pinHeigth) + 'px';

    var el = domEl.querySelector(':first-child');
    el.src = objectItem.author.avatar;
    el.alt = objectItem.offer.title;

    domEl.addEventListener('click', function () {
      pinElCollArr = Array.from(pinElCollection);
      pinElCollArr.forEach(function (item) {
        if (item.classList.contains('map__pin--active')) {
          item.classList.remove('map__pin--active');
        }
      });
      domEl.classList.add('map__pin--active');

      window.card.draw(objectItem);
    });

    return domEl;
  };

  var restylePin = function (x, y) {
    mapPinMainEl.style.left = mainPinX;
    mapPinMainEl.style.top = mainPinY;
    if (x) {
      mapPinMainEl.style.left = x + 'px';
      mapPinMainEl.style.top = y + 'px';
    }
  };

  // отрисовываем dom-элемент пина
  var pinParentEl = document.querySelector('.map__pins');
  var drawPins = function (array) {

    var initialArr = window.data.advtItems.slice(0);

    var reduceArray = function (arr) {
      var dataReducedArr = arr.slice(0, MAX_PIN_QUANTITY);
      return dataReducedArr;
    };

    var arrayToDraw = (array) ? reduceArray(array) : reduceArray(initialArr);
    var fragment = document.createDocumentFragment();
    arrayToDraw.forEach(function (item, i) {
      var pinElementFinal = createDomElementPin(arrayToDraw[i]);
      fragment.appendChild(pinElementFinal);
    });
    pinParentEl.appendChild(fragment);
    pinElCollection = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  // скрытие и удаление dom-элемента пина
  var hidePins = function () {
    pinElCollArr = Array.from(pinElCollection);
    pinElCollArr.forEach(function (item, i) {
      pinElCollArr[i].hidden = true;
    });
  };

  var clearPins = function () {
    pinElCollArr = Array.from(pinElCollection);
    pinElCollArr.forEach(function (item, i) {
      pinElCollArr[i].remove();
    });
  };
  // экспорт в глобальную область видимости
  window.pin = {
    draw: drawPins,
    hide: hidePins,
    restyle: restylePin,
    clear: clearPins,
    mainX: mainPinX,
    mainY: mainPinY,
    mainEl: mapPinMainEl,
    mapEl: mapEl
  };
})();
