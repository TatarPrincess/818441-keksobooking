'use strict';

(function () {
  // генератор случайных целых чисел
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var getRandomArrIndex = function (arr) {
    var randomItem = arr[getRandomIntInclusive(0, arr.length - 1)];
    return randomItem;
  };

  var advtItems = [];

  var onLoad = function (response) {
    // создание массива объектов карточек
    for (var i = 0; i <= 7; i++) {
      var dataArrItem = getRandomArrIndex(response);
      advtItems[i] = {
        author: {
          avatar: dataArrItem.author.avatar
        },
        advItemLocation: {
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
          description: dataArrItem.description,
          photos: dataArrItem.offer.photos
        },
      };
    }
  };

  var onError = function (errMsg) {
    var template = document.querySelector('#error').content.querySelector('.error');
    var domElement = template.cloneNode(true);
    var element = domElement.querySelector('.error__message');
    var btnEl = domElement.querySelector('.error__button');
    element.textContent = errMsg;
    var parentElement = document.querySelector('main');
    parentElement.insertAdjacentElement('afterbegin', domElement);
    btnEl.addEventListener('click', function () {
      window.location.reload();
    });
  };

  window.data = {
    onLoad: onLoad,
    onError: onError,
    advtItems: advtItems
  };

})();


