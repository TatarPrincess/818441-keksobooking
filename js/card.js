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
  var articleEl = '';

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
    var photosArr = objectItem.offer.photos;
    for (var n = 0; n < photosArr.length; n++) {
      var domElement = template.cloneNode(true);
      domElement.src = photosArr[n];
      parentElement.appendChild(domElement);
    }
    return elementCard;
  };

  var createDomElementCard = function (objectItem) {
  // клонирую всю карточку
    var template = document.querySelector('#card').content.querySelector('article');
    var domElement = template.cloneNode(true);
    // переопределяю классы элементам склонированного куска дом-дерева
    // title
    var element = domElement.querySelector('.popup__title');
    element.textContent = objectItem.offer.title;
    // address
    element = domElement.querySelector('.popup__text--address');
    element.textContent = objectItem.offer.address;
    // price
    var elementSpan = domElement.querySelector('.popup__text--price').querySelector(':first-child');
    element = domElement.querySelector('.popup__text--price');
    var price = new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'}).format(objectItem.offer.price);
    element.textContent = price + elementSpan.textContent;
    // type
    element = domElement.querySelector('.popup__type');
    element.textContent = homeTypeNames[objectItem.offer.type];
    // capacity, guests
    element = domElement.querySelector('.popup__text--capacity');
    element.textContent = objectItem.offer.rooms + ' комнаты для ' + objectItem.offer.guests + ' гостей';
    // checkin, checkout
    element = domElement.querySelector('.popup__text--time');
    element.textContent = 'Заезд после ' + objectItem.offer.checkin + ', выезд до ' + objectItem.offer.checkout;
    // features
    removeCardFeatures(objectItem, domElement);

    // description
    element = domElement.querySelector('.popup__description');
    element.textContent = objectItem.offer.description;

    // photos
    createDomElementCardImg(objectItem, domElement);

    // аватарка пользователя на карточке
    element = domElement.querySelector('.popup__avatar');
    element.src = objectItem.author.avatar;

    return domElement;
  };

  // ОТРИСОВКА DOM-ЭЛЕМЕНТА на странице
  var drawCard = function (objItem) {
    var parentDomElementMap = document.querySelector('.map');
    var childDomElement = parentDomElementMap.querySelector('.map__filters-container');
    var fragmentMap = document.createDocumentFragment();
    var domElementFinalMap = createDomElementCard(objItem);
    fragmentMap.appendChild(domElementFinalMap);
    parentDomElementMap.insertBefore(fragmentMap, childDomElement);
    articleEl = mapEl.querySelector('article');
  };

  // скрытие карточки
  var hideCard = function () {
    if (articleEl) {
      articleEl.setAttribute('hidden', 'true');
    }
  };

  window.card = {
    draw: drawCard,
    hide: hideCard
  };
})();
