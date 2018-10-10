'use strict';

(function () {
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var homeTypeNames = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var mapEl = document.querySelector('.map');
  var articleEl;
  var popupCloseEl;
  var photos;
  var domEl;

  // создание элементов в DOM-дереве

  var removeCardFeatures = function (objectItem, cardEl) {
    var objArr = objectItem.offer.features;
    var objArrLength = objArr.length;
    var initArrLength = features.length;
    var parentEl = cardEl.querySelector('ul');
    if (initArrLength - objArrLength) {
      for (var m = 0; m < initArrLength; m++) {
        if (!objArr.includes(features[m])) {
          var toRemoveEl = cardEl.querySelector('li[class$="' + features[m] + '"]');
          parentEl = cardEl.querySelector('ul');
          parentEl.removeChild(toRemoveEl);
        }
      }
    }
    return cardEl;
  };


  var createDomElementCardImg = function (objectItem, elementCard) {
    var parentElement = elementCard.querySelector('div');
    var template = elementCard.querySelector('div img');
    parentElement.innerHTML = '';
    photos.forEach(function (item, i) {
      var domElement = template.cloneNode(true);
      domElement.src = photos[i];
      parentElement.appendChild(domElement);
    });
    return elementCard;
  };

  var setTextContent = function (element, content) {
    if (!content) {
      element.hidden = true;
    } else {
      element.textContent = content;
    }
  };

  var createDomElementCard = function (objectItem) {
  // клонирую всю карточку
    var template = document.querySelector('#card').content.querySelector('article');
    domEl = template.cloneNode(true);

    var spanEl = domEl.querySelector('.popup__text--price').querySelector(':first-child');
    var formattedPrice = new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'}).format(objectItem.offer.price);
    // переопределяю классы элементам склонированного куска дом-дерева

    var mapaDomEl = {
      title: domEl.querySelector('.popup__title'),
      address: domEl.querySelector('.popup__text--address'),
      price: domEl.querySelector('.popup__text--price'),
      type: domEl.querySelector('.popup__type'),
      capacity: domEl.querySelector('.popup__text--capacity'),
      checkin: domEl.querySelector('.popup__text--time'),
      description: domEl.querySelector('.popup__description')
    };

    var mapaContent = {
      title: objectItem.offer.title,
      address: objectItem.offer.address,
      price: formattedPrice + spanEl.textContent,
      type: homeTypeNames[objectItem.offer.type],
      capacity: (objectItem.offer.rooms) ? objectItem.offer.rooms + ' комнаты для ' + objectItem.offer.guests + ' гостей' : '',
      checkin: 'Заезд после ' + objectItem.offer.checkin + ', выезд до ' + objectItem.offer.checkout,
      description: objectItem.offer.description
    };

    for (var key in mapaDomEl) {
      if (key) {
        var content = mapaContent[key];
        setTextContent(mapaDomEl[key], content);
      }
    }
    // features
    var featuresEl = domEl.querySelector('.popup__features');
    var featValues = objectItem.offer.features;
    if (featValues.length > 0) {
      removeCardFeatures(objectItem, domEl);
    } else {
      featuresEl.hidden = true;
    }

    // photos
    var photosEl = domEl.querySelector('.popup__photo');
    photos = objectItem.offer.photos;
    if (photos.length > 0) {
      createDomElementCardImg(objectItem, domEl);
    } else {
      photosEl.hidden = true;
    }

    // avatar
    var el = domEl.querySelector('.popup__avatar');
    el.src = objectItem.author.avatar;

    return domEl;
  };

  var onCardPopupKeydown = function (evt) {
    window.util.processIfEscEvent(evt, removeCard);
  };

  var onCardPopupCloseClick = function () {
    removeCard();
  };

  var removeCard = function () {
    if (articleEl) {
      articleEl.remove();
      popupCloseEl.removeEventListener('click', onCardPopupCloseClick);
      document.removeEventListener('keydown', onCardPopupKeydown);
    }
  };
  // отрисовка карточки
  var drawCard = function (objItem) {
    removeCard();
    var childEl = mapEl.querySelector('.map__filters-container');
    var fragmentMap = document.createDocumentFragment();
    var mapElementFinal = createDomElementCard(objItem);
    fragmentMap.appendChild(mapElementFinal);
    mapEl.insertBefore(fragmentMap, childEl);
    articleEl = mapEl.querySelector('article');
    popupCloseEl = articleEl.querySelector('.popup__close');

    // закрытие карточки
    document.addEventListener('keydown', onCardPopupKeydown);
    popupCloseEl.addEventListener('click', onCardPopupCloseClick);
  };

  window.card = {
    draw: drawCard,
    remove: removeCard,
    mapEl: mapEl
  };
})();
