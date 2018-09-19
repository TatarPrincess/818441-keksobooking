'use strict';

var avatars = [1, 2, 3, 4, 5, 6, 7, 8];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var typesOfAccomodation = ['palace', 'flat', 'house', 'bungalo'];
var checkins = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var homeTypeNames = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

// генератор случайных целых чисел
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// сортировка массива в случайном порядке (спасибо, Кнут)
function shuffle(array) {
  var currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    var randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    var temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

var getFeaturesArr = function (featuresArr) {
  var newArrLength = getRandomIntInclusive(1, featuresArr.length);
  var newFeaturesArr = [];
  for (var i = 0; i < featuresArr.length; i++) {
    if (i <= newArrLength - 1) {
      newFeaturesArr[i] = featuresArr[i];
    }
  }
  return newFeaturesArr;
};

avatars = shuffle(avatars);
titles = shuffle(titles);
photos = shuffle(photos);

// создание массива объектов карточек
var advtItems = [];
for (var i = 0; i <= 7; i++) {
  var locationX = getRandomIntInclusive(0, 1200);
  var locationY = getRandomIntInclusive(130, 630);

  advtItems[i] = {
    author: {
      avatar: 'img/avatars/user0' + avatars[i] + '.png'
    },
    advItemLocation: {
      x: locationX,
      y: locationY
    },
    offer: {
      title: titles[i],
      address: locationX + ', ' + locationY,
      price: getRandomIntInclusive(1000, 1000000),
      type: typesOfAccomodation[getRandomIntInclusive(0, typesOfAccomodation.length - 1)],
      rooms: getRandomIntInclusive(1, 5),
      guests: getRandomIntInclusive(1, 30),
      checkin: checkins[getRandomIntInclusive(0, checkins.length - 1)],
      checkout: checkins[getRandomIntInclusive(0, checkins.length - 1)],
      features: getFeaturesArr(features),
      description: '',
      photos: photos
    },
  };
}

// создание элементов в DOM-дереве

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
    drawCard(objectItem);
  });

  return domElement;
};

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


// отрисовка и вставка DOM-элемента на странице
// pins
var drawPins = function () {
  var parentDomElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var k = 0; k < advtItems.length; k++) {
    var domElementFinal = createDomElementPin(advtItems[k]);
    fragment.appendChild(domElementFinal);
  }
  parentDomElement.appendChild(fragment);
};

// cards
var drawCard = function (objItem) {
  var parentDomElementMap = document.querySelector('.map');
  var childDomElement = parentDomElementMap.querySelector('.map__filters-container');
  var fragmentMap = document.createDocumentFragment();
  var domElementFinalMap = createDomElementCard(objItem);
  fragmentMap.appendChild(domElementFinalMap);
  parentDomElementMap.insertBefore(fragmentMap, childDomElement);
};

// События
var mapEl = document.querySelector('.map');
var adFormEl = document.querySelector('.ad-form');
var adFormHeaderEl = adFormEl.querySelector('.ad-form-header');
var adFormElCollection = adFormEl.querySelectorAll('.ad-form__element');
var mapPinMain = document.querySelector('.map__pin--main');
var mapFiltersElCollection = mapEl.querySelectorAll('.map__filter');
var MAIN_PIN_SIZE = 156;
var mainPinX = mapPinMain.style.left;
var mainPinY = mapPinMain.style.top;
var mapPinMainCoordsEl = adFormEl.querySelector('#address');

var setAddrCoords = function (isDefault) {
  mapPinMainCoordsEl.value = isDefault ? mainPinX + ',' + mainPinY : (parseInt(mainPinX, 10) - MAIN_PIN_SIZE) + 'px' + ', ' + (parseInt(mainPinY, 10) - MAIN_PIN_SIZE) + 'px';
  return mapPinMainCoordsEl;
};

// переводим в неактивный режим
var onPageFirstLoad = function () {
  mapEl.classList.add('map--faded');
  adFormEl.classList.add('ad-form--disabled');
  adFormHeaderEl.setAttribute('disabled', 'disabled');
  for (var d = 0; d < adFormElCollection.length; d++) {
    adFormElCollection[d].setAttribute('disabled', 'disabled');
  }
  for (var t = 0; t < mapFiltersElCollection.length; t++) {
    mapFiltersElCollection[t].setAttribute('disabled', 'disabled');
  }
  setAddrCoords(true);
  document.removeEventListener('DOMContentLoaded', onPageFirstLoad);
};

document.addEventListener('DOMContentLoaded', onPageFirstLoad);

// переводим в активный режим
var onPageFirstLoadReverse = function () {
  mapEl.classList.remove('map--faded');
  adFormEl.classList.remove('ad-form--disabled');
  adFormHeaderEl.removeAttribute('disabled');
  for (var d = 0; d < adFormElCollection.length; d++) {
    adFormElCollection[d].removeAttribute('disabled');
  }
  for (var t = 0; t < mapFiltersElCollection.length; t++) {
    mapFiltersElCollection[t].removeAttribute('disabled');
  }
  drawPins();
  setAddrCoords(false);
};

mapPinMain.addEventListener('mouseup', onPageFirstLoadReverse);
