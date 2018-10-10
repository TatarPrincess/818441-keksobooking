'use strict';

(function () {
  var MAX_PIN_QUANTITY = 5;
  var advtItems = [];
  var responseArr;

  // генератор случайных целых чисел
  var getRandomIntInclusive = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomArrIndex = function (arr) {
    var randomItem = arr[getRandomIntInclusive(0, arr.length - 1)];
    var randomItemIdx = arr.indexOf(randomItem);
    if (randomItemIdx) {
      responseArr = arr.splice(randomItemIdx, 1);
    }
    return randomItem;
  };

  var onLoad = function (response) {
    // создание массива объектов карточек
    for (var i = 0; i < MAX_PIN_QUANTITY; i++) {
      responseArr = response;
      var dataArrItem = getRandomArrIndex(responseArr);
      advtItems[i] = {
        author: {
          avatar: dataArrItem.author.avatar
        },
        location: {
          x: dataArrItem.location.x,
          y: dataArrItem.location.y
        },
        offer: {
          title: dataArrItem.offer.title,
          address: dataArrItem.offer.address,
          price: dataArrItem.offer.price,
          type: dataArrItem.offer.type,
          rooms: dataArrItem.offer.rooms,
          guests: dataArrItem.offer.guests,
          checkin: dataArrItem.offer.checkin,
          checkout: dataArrItem.offer.checkout,
          features: dataArrItem.offer.features,
          description: dataArrItem.offer.description,
          photos: dataArrItem.offer.photos
        },
      };
    }
    window.pin.draw();

  };

  var onError = function (errMsg) {
    var template = document.querySelector('#error').content.querySelector('.error');
    var domEl = template.cloneNode(true);
    var el = domEl.querySelector('.error__message');
    var btnEl = domEl.querySelector('.error__button');
    el.textContent = errMsg;
    var parentEl = document.querySelector('main');
    parentEl.insertAdjacentElement('afterbegin', domEl);

    var onBtnErrorClick = function () {
      window.location.reload();
      btnEl.removeEventListener('click', onBtnErrorClick);
    };
    btnEl.addEventListener('click', onBtnErrorClick);

    var onErrorClick = function () {
      window.location.reload();
      document.removeEventListener('click', onErrorClick);
    };
    document.addEventListener('click', onErrorClick);

    var onErrorKeydown = function (evt) {
      var processErrorKeydown = function () {
        window.location.reload();
        document.removeEventListener('keydown', onErrorKeydown);
      };
      window.util.processIfEscEvent(evt, processErrorKeydown);
    };

    document.addEventListener('keydown', onErrorKeydown);
  };

  window.data = {
    onLoad: onLoad,
    onError: onError,
    advtItems: advtItems
  };

})();


