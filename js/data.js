'use strict';

(function () {
  var avatars = [1, 2, 3, 4, 5, 6, 7, 8];
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var typesOfAccomodation = ['palace', 'flat', 'house', 'bungalo'];
  var checkins = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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

  window.data = {
    advtItems: advtItems
  };
})();
