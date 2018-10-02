'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var mainPinX = mapPinMain.style.left;
  var mainPinY = mapPinMain.style.top;
  var pinDomElCollection;

  // создаем dom-элемент пина
  var createDomElementPin = function (objectItem) {

    var template = document.querySelector('#pin').content.querySelector('button');
    var domElement = template.cloneNode(true);
    var pinHeigth = domElement.querySelector('img').height;
    var pinWidth = domElement.querySelector('img').width;

    domElement.style.left = (objectItem.advItemLocation.x - pinWidth) + 'px';
    domElement.style.top = (objectItem.advItemLocation.y - pinHeigth) + 'px';

    var element = domElement.querySelector(':first-child');
    element.src = objectItem.author.avatar;
    element.alt = objectItem.offer.title;

    domElement.addEventListener('click', function () {
      window.card.draw(objectItem);
    });

    return domElement;
  };

  var restylePin = function (x, y) {
    mapPinMain.style.left = mainPinX;
    mapPinMain.style.top = mainPinY;
    if (x) {
      mapPinMain.style.left = x + 'px';
      mapPinMain.style.top = y + 'px';
    }
  };

  // отрисовываем dom-элемент пина
  var pinParentDomEl = document.querySelector('.map__pins');
  var drawPins = function (array) {
    var arrayToDraw = (array) ? array : window.data.advtItems;
    var fragment = document.createDocumentFragment();
    for (var k = 0; k < arrayToDraw.length; k++) {
      var domElementFinal = createDomElementPin(arrayToDraw[k]);
      fragment.appendChild(domElementFinal);
    }
    pinParentDomEl.appendChild(fragment);
    pinDomElCollection = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  // скрытие и удаление dom-элемента пина
  var hidePins = function () {
    for (var c = 0; c < pinDomElCollection.length; c++) {
      pinDomElCollection[c].setAttribute('hidden', 'true');
    }
  };

  var clearPins = function () {
    for (var q = 0; q < pinDomElCollection.length; q++) {
      pinDomElCollection[q].remove();
    }
  };
  // экспорт в глобальную область видимости
  window.pin = {
    drawPins: drawPins,
    hidePins: hidePins,
    restylePin: restylePin,
    clearPins: clearPins,
    mainPinX: mainPinX,
    mainPinY: mainPinY
  };
})();
