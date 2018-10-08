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
  var popupClose;
  var photos;

  // создание элементов в DOM-дереве

  var removeCardFeatures = function (objectItem, elementCard) {
    var objArrLength = objectItem.offer.features.length;
    var initArrLength = features.length;
    var parentEl = elementCard.querySelector('ul');
    if (initArrLength - objArrLength) {
      for (var m = objArrLength; m < initArrLength; m++) {
        var elToRemove = elementCard.querySelector('li[class$="' + features[m] + '"]');
        parentEl = elementCard.querySelector('ul');
        parentEl.removeChild(elToRemove);
      }
    }
    return elementCard;
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

  var createDomElementCard = function (objectItem) {
  // клонирую всю карточку
    var template = document.querySelector('#card').content.querySelector('article');
    var domElement = template.cloneNode(true);
    // переопределяю классы элементам склонированного куска дом-дерева
    // title
    var element = domElement.querySelector('.popup__title');
    var title = objectItem.offer.title;
    if (title === '') {
      element.hidden = true;
    } else {
      element.textContent = title;
    }

    // address
    element = domElement.querySelector('.popup__text--address');
    var address = objectItem.offer.address;
    if (address === '') {
      element.hidden = true;
    } else {
      element.textContent = address;
    }
    // price
    var price = objectItem.offer.price;
    var elementSpan = domElement.querySelector('.popup__text--price').querySelector(':first-child');
    element = domElement.querySelector('.popup__text--price');
    if (price === undefined) {
      element.hidden = true;
    } else {
      var formattedPrice = new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'}).format(objectItem.offer.price);
      element.textContent = formattedPrice + elementSpan.textContent;
    }
    // type
    element = domElement.querySelector('.popup__type');
    var type = homeTypeNames[objectItem.offer.type];
    if (type === '') {
      element.hidden = true;
    } else {
      element.textContent = type;
    }
    // capacity, guests
    element = domElement.querySelector('.popup__text--capacity');
    var capacity = objectItem.offer.rooms;
    if (capacity === undefined) {
      element.hidden = true;
    } else {
      element.textContent = capacity + ' комнаты для ' + objectItem.offer.guests + ' гостей';
    }
    // checkin, checkout
    element = domElement.querySelector('.popup__text--time');
    var checkin = objectItem.offer.checkin;
    if (checkin === '') {
      element.hidden = true;
    } else {
      element.textContent = 'Заезд после ' + checkin + ', выезд до ' + objectItem.offer.checkout;
    }
    // features
    var featuresEl = domElement.querySelector('.popup__features');
    var featValues = objectItem.offer.features;
    if (featValues.length > 0) {
      removeCardFeatures(objectItem, domElement);
    } else {
      featuresEl.hidden = true;
    }

    // description
    element = domElement.querySelector('.popup__description');
    var description = objectItem.offer.description;
    if (description === '') {
      element.hidden = true;
    } else {
      element.textContent = description;
    }

    // photos
    var photosEl = domElement.querySelector('.popup__photo');
    photos = objectItem.offer.photos;
    if (photos.length > 0) {
      createDomElementCardImg(objectItem, domElement);
    } else {
      photosEl.hidden = true;
    }

    // аватарка пользователя на карточке
    element = domElement.querySelector('.popup__avatar');
    element.src = objectItem.author.avatar;

    return domElement;
  };

  var onCardPopupKeydown = function (evt) {
    evt.preventDefault();
    window.util.processIfEnterEvent(evt, removeCard);

  };
  var onCardPopupCloseClick = function () {
    removeCard();
  };

  var removeCard = function () {
    if (articleEl) {
      popupClose.removeEventListener('keydown', onCardPopupKeydown);
      popupClose.removeEventListener('click', onCardPopupCloseClick);
      articleEl.remove();
    }
  };
  // отрисовка карточки
  var drawCard = function (objItem) {
    removeCard();
    var parentDomElementMap = document.querySelector('.map');
    var childDomElement = parentDomElementMap.querySelector('.map__filters-container');
    var fragmentMap = document.createDocumentFragment();
    var domElementFinalMap = createDomElementCard(objItem);
    fragmentMap.appendChild(domElementFinalMap);
    parentDomElementMap.insertBefore(fragmentMap, childDomElement);
    articleEl = mapEl.querySelector('article');
    popupClose = articleEl.querySelector('.popup__close');

    // закрытие карточки
    popupClose.addEventListener('keydown', onCardPopupKeydown);
    popupClose.addEventListener('keypress', function (evt) {
      evt.preventDefault();
    });
    popupClose.addEventListener('click', onCardPopupCloseClick);
  };

  window.card = {
    draw: drawCard,
    remove: removeCard
  };
})();
