'use strict';

(function () {
// FORM
  var homeTypePrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var mapEl = document.querySelector('.map');
  var adFormEl = document.querySelector('.ad-form');
  var adFormHeaderEl = adFormEl.querySelector('.ad-form-header');
  var adFormElCollection = adFormEl.querySelectorAll('.ad-form__element');
  var mapFiltersElCollection = mapEl.querySelectorAll('.map__filter');
  var MAIN_PIN_SIZE = 156;
  var mapPinMainCoordsEl = adFormEl.querySelector('#address');
  var formHouseTypeEl = adFormEl.querySelector('#type');
  var formHouseTypeColl = formHouseTypeEl.querySelectorAll('option');
  var formHouseTypePriceEl = adFormEl.querySelector('#price');
  var adFormResetEl = adFormEl.querySelector('.ad-form__reset');
  var adFormCheckInEl = adFormEl.querySelector('#timein');
  var adFormCheckInColl = adFormCheckInEl.querySelectorAll('option');
  var adFormCheckOutEl = adFormEl.querySelector('#timeout');
  var adFormCheckOutColl = adFormCheckOutEl.querySelectorAll('option');
  var roomNumberEl = adFormEl.querySelector('#room_number');
  var roomNumberColl = roomNumberEl.querySelectorAll('option');
  var capacityParentEl = adFormEl.querySelector('#capacity');
  var capacityCollection = adFormEl.querySelectorAll('#capacity option');
  var submitFormEl = adFormEl.querySelector('.ad-form__submit');
  var formTitle = document.querySelector('#title');
  var featureColl = adFormEl.querySelectorAll('.feature__checkbox');
  var descriptionEl = adFormEl.querySelector('#description');
  var ROOM_CAPACITY_OBJ = {
    0: [1],
    1: [1, 2],
    2: [1, 2, 3],
    3: [0]
  };
  var ROOM_NUMBER_OPTION_DEFAULT = '1';
  var CHECKIN_OPTION_DEFAULT = '12:00';
  var HOUSE_TP_OPTION_DEFAULT = 'flat';

  // создание элементов в DOM-дереве
  var createDomElementCapacity = function (arrEl) {
    var template = arrEl;
    var domElement = template.cloneNode(true);
    return domElement;
  };

  // ОТРИСОВКА DOM-ЭЛЕМЕНТА на странице

  // capacity
  var addCapacityOptions = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var p = 0; p < arr.length; p++) {
      var domElementFinal = createDomElementCapacity(arr[p]);
      fragment.appendChild(domElementFinal);
    }
    capacityParentEl.appendChild(fragment);
  };

  var setAddrCoords = function (coordX, coordY) {
    var defaultCoords = window.pin.mainPinX + ',' + window.pin.mainPinY;
    var mainPinCoords = (coordX - MAIN_PIN_SIZE) + 'px' + ', ' + (coordY - MAIN_PIN_SIZE) + 'px';
    // проставляем в input address value переданных координат
    mapPinMainCoordsEl.value = coordX ? mainPinCoords : defaultCoords;

    return mapPinMainCoordsEl.value;
  };

  var fillArr = function (idx, obj) {
    var capacityEls = [];
    var arrIdxSelCapacity = obj[idx];

    for (var o = 0; o < arrIdxSelCapacity.length; o++) {
      var arrItemValue = arrIdxSelCapacity[o];
      capacityEls[o] = capacityCollection[arrItemValue];
    }
    return capacityEls;

  };

  var setCapacityElOption = function (optionIndex) {
    capacityParentEl.innerHTML = '';
    var capacityEls = fillArr(optionIndex, ROOM_CAPACITY_OBJ);
    addCapacityOptions(capacityEls);
    return adFormEl.querySelector('#capacity');
  };

  var changeFormOnPageActivate = function () {
    adFormEl.classList.remove('ad-form--disabled');
    adFormHeaderEl.removeAttribute('disabled');
    for (var d = 0; d < adFormElCollection.length; d++) {
      adFormElCollection[d].removeAttribute('disabled');
    }
    for (var t = 0; t < mapFiltersElCollection.length; t++) {
      mapFiltersElCollection[t].removeAttribute('disabled');
    }
    // pricePlaceHolder changing
    formHouseTypeEl.addEventListener('change', onSelectOptionChange);
  };

  var changeFormOnPageDeactivate = function () {
    adFormEl.classList.add('ad-form--disabled');
    adFormHeaderEl.setAttribute('disabled', 'disabled');
    formTitle.value = '';
    for (var d = 0; d < adFormElCollection.length; d++) {
      adFormElCollection[d].setAttribute('disabled', 'disabled');
    }
    for (var t = 0; t < mapFiltersElCollection.length; t++) {
      mapFiltersElCollection[t].setAttribute('disabled', 'disabled');
    }
    formHouseTypeEl.removeEventListener('change', onSelectOptionChange);
  };

  // HANDLERS
  var onSelectOptionChange = function () {
    formHouseTypePriceEl.setAttribute('placeholder', homeTypePrice[formHouseTypeEl.value]);
    formHouseTypePriceEl.setAttribute('min', homeTypePrice[formHouseTypeEl.value]);
  };

  // ДОБАВЛЯЕМ СОБЫТИЯ

  var setCapacityElOption1 = function () {
    if (roomNumberEl.selectedIndex === 0) {
      setCapacityElOption(0);
      document.removeEventListener('DOMContentLoaded', setCapacityElOption1);
    }
  };
  document.addEventListener('DOMContentLoaded', setCapacityElOption1);

  // reset
  adFormResetEl.addEventListener('click', function () {
    pageDeactivate(true);
  });
  // choosing checkIn
  adFormCheckInEl.addEventListener('change', function () {
    if (adFormCheckOutEl.selectedIndex !== -1) {
      adFormCheckOutEl.selectedIndex = adFormCheckInEl.selectedIndex;
    }
  });
  // capacity
  roomNumberEl.addEventListener('change', function () {
    setCapacityElOption(roomNumberEl.selectedIndex);
  });


  // PAGE
  var onPageFirstLoad = function () {
    pageDeactivate(false);
    window.backend.load(window.data.onLoad, window.data.onError);
  };

  var pageActivate = function () {
    mapEl.classList.remove('map--faded');
    // window.backend.load(window.data.onLoad, window.data.onError);
    window.pin.drawPins();
    changeFormOnPageActivate();
  };

  var pageDeactivate = function (isReset) {
    setAddrCoords();
    window.pin.restylePin();
    mapEl.classList.add('map--faded');
    changeFormOnPageDeactivate();
    if (isReset) {
      window.card.hide();
    }
    window.pin.hidePins();
    document.removeEventListener('DOMContentLoaded', onPageFirstLoad);
  };

  var setElAttr = function (targetEl) {
    targetEl.selected = true;
    return targetEl;
  };

  var changeFormOnSubmit = function () {
    formTitle.value = '';
    formHouseTypePriceEl.value = '';
    setAddrCoords();
    for (var k = 0; k < formHouseTypeColl.length; k++) {
      if (formHouseTypeColl[k].value === HOUSE_TP_OPTION_DEFAULT) {
        setElAttr(formHouseTypeColl[k]);
      }
    }
    for (var l = 0; l < adFormCheckInColl.length; l++) {
      if (adFormCheckInColl[l].value === CHECKIN_OPTION_DEFAULT) {
        setElAttr(adFormCheckInColl[l]);
        setElAttr(adFormCheckOutColl[l]);
      }
    }
    for (var m = 0; m < roomNumberColl.length; m++) {
      if (roomNumberColl[m].value === ROOM_NUMBER_OPTION_DEFAULT) {
        setElAttr(roomNumberColl[m]);
        setCapacityElOption(roomNumberEl.selectedIndex);
      }
    }
    for (var i = 0; i < featureColl.length; i++) {
      featureColl[i].checked = false;
    }
    descriptionEl.value = '';
    window.pin.restylePin();
  };

  var onLoad = function () {
    changeFormOnSubmit();
  };

  // события
  document.addEventListener('DOMContentLoaded', onPageFirstLoad);
  submitFormEl.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormEl), onLoad, window.data.onError);
  });

  window.pageForm = {
    setAddrCoords: setAddrCoords,
    pageActivate: pageActivate,
    onLoad: onLoad
  };
})();
