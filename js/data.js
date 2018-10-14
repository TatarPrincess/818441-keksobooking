'use strict';

(function () {
  var advtItems = [];
  var parentEl = document.querySelector('main');

  var onLoad = function (response) {
    // создание массива объектов карточек
    [].forEach.call(response, function (item, i) {
      advtItems[i] = {
        author: {
          avatar: item.author.avatar
        },
        location: {
          x: item.location.x,
          y: item.location.y
        },
        offer: {
          title: item.offer.title,
          address: item.offer.address,
          price: item.offer.price,
          type: item.offer.type,
          rooms: item.offer.rooms,
          guests: item.offer.guests,
          checkin: item.offer.checkin,
          checkout: item.offer.checkout,
          features: item.offer.features,
          description: item.offer.description,
          photos: item.offer.photos
        }
      };
    });
    window.pin.draw();
  };

  var onError = function (errMsg) {
    var template = document.querySelector('#error').content.querySelector('.error');
    var domEl = template.cloneNode(true);
    var el = domEl.querySelector('.error__message');
    var btnEl = domEl.querySelector('.error__button');
    el.textContent = errMsg;
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
    advtItems: advtItems,
    mainEl: parentEl
  };

})();


