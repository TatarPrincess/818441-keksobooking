'use strict';

(function () {

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
  var adFormElColArr = Array.from(adFormElCollection);
  var mapFiltersElCollection = mapEl.querySelectorAll('.map__filter');
  var mapFiltersElColArr = Array.from(mapFiltersElCollection);
  var MAIN_PIN_SIZE = 156;
  var mapPinMainCoordsEl = adFormEl.querySelector('#address');
  var formHouseTypeEl = adFormEl.querySelector('#type');
  var formHouseTypeColl = formHouseTypeEl.querySelectorAll('option');
  var formHouseTypeCollArr = Array.from(formHouseTypeColl);
  var formHouseTypePriceEl = adFormEl.querySelector('#price');
  var adFormResetEl = adFormEl.querySelector('.ad-form__reset');
  var adFormCheckInEl = adFormEl.querySelector('#timein');
  var adFormCheckInColl = adFormCheckInEl.querySelectorAll('option');
  var adFormCheckInCollArr = Array.from(adFormCheckInColl);
  var adFormCheckOutEl = adFormEl.querySelector('#timeout');
  var adFormCheckOutColl = adFormCheckOutEl.querySelectorAll('option');
  var roomNumberEl = adFormEl.querySelector('#room_number');
  var roomNumberColl = roomNumberEl.querySelectorAll('option');
  var roomNumberCollArr = Array.from(roomNumberColl);
  var capacityParentEl = adFormEl.querySelector('#capacity');
  var capacityCollection = adFormEl.querySelectorAll('#capacity option');
  var submitFormEl = adFormEl.querySelector('.ad-form__submit');
  var formTitle = document.querySelector('#title');
  var featureColl = adFormEl.querySelectorAll('.feature__checkbox');
  var featureCollArr = Array.from(featureColl);
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
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var createDomElementCapacity = function (arrEl) {
    var template = arrEl;
    var domElement = template.cloneNode(true);
    return domElement;
  };

  // capacity
  var addCapacityOptions = function (arr) {
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item, i) {
      var domElementFinal = createDomElementCapacity(arr[i]);
      fragment.appendChild(domElementFinal);
    });
    capacityParentEl.appendChild(fragment);
  };

  var setAddrCoords = function (coordX, coordY) {
    var defaultCoords = window.pin.mainPinX + ',' + window.pin.mainPinY;
    var mainPinCoords = (coordX - MAIN_PIN_SIZE) + 'px' + ', ' + (coordY - MAIN_PIN_SIZE) + 'px';
    // проставляем в input address value переданных координат
    mapPinMainCoordsEl.value = coordX ? mainPinCoords : defaultCoords;

    return mapPinMainCoordsEl.value;
  };

  var fillArr = function (idx) {
    var capacityEls = [];
    var arrIdxSelCapacity = ROOM_CAPACITY_OBJ[idx];
    arrIdxSelCapacity.forEach(function (item, i) {
      var arrItemValue = arrIdxSelCapacity[i];
      capacityEls[i] = capacityCollection[arrItemValue];
    });
    return capacityEls;

  };

  var setCapacityElOption = function (optionIndex) {
    capacityParentEl.innerHTML = '';
    var capacityEls = fillArr(optionIndex);
    addCapacityOptions(capacityEls);
    return adFormEl.querySelector('#capacity');
  };

  var changeFormOnPageActivate = function () {
    adFormEl.classList.remove('ad-form--disabled');
    adFormHeaderEl.removeAttribute('disabled');
    adFormElColArr.forEach(function (item, i) {
      adFormElColArr[i].removeAttribute('disabled');
    });
    mapFiltersElColArr.forEach(function (item, i) {
      mapFiltersElColArr[i].removeAttribute('disabled');
    });
    // pricePlaceHolder changing
    formHouseTypeEl.addEventListener('change', onSelectOptionChange);
  };

  var clearPreviewPhotos = function () {
    var previewContainer = adFormEl.querySelector('.ad-form__photo');
    var preview = adFormEl.querySelector('.ad-form-header__preview img');
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }
    preview.src = DEFAULT_AVATAR_SRC;
  };

  var changeFormOnPageDeactivate = function () {
    adFormEl.classList.add('ad-form--disabled');
    adFormHeaderEl.setAttribute('disabled', 'disabled');
    formTitle.value = '';
    adFormElColArr.forEach(function (item, i) {
      adFormElColArr[i].setAttribute('disabled', 'disabled');
    });
    mapFiltersElColArr.forEach(function (item, i) {
      mapFiltersElColArr[i].setAttribute('disabled', 'disabled');
    });
    clearPreviewPhotos();
    formHouseTypeEl.removeEventListener('change', onSelectOptionChange);
    adFormCheckInEl.removeEventListener('change', onCheckInSelectChange);
    roomNumberEl.removeEventListener('change', onRoomNumberSelectChange);
  };

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
  var onCheckInSelectChange = function () {
    if (adFormCheckOutEl.selectedIndex !== -1) {
      adFormCheckOutEl.selectedIndex = adFormCheckInEl.selectedIndex;
    }
  };
  adFormCheckInEl.addEventListener('change', onCheckInSelectChange);
  // capacity
  var onRoomNumberSelectChange = function () {
    setCapacityElOption(roomNumberEl.selectedIndex);
  };
  roomNumberEl.addEventListener('change', onRoomNumberSelectChange);


  // PAGE
  var onPageFirstLoad = function () {
    pageDeactivate(false);
  };

  var pageActivate = function () {
    mapEl.classList.remove('map--faded');
    changeFormOnPageActivate();
    window.backend.load(window.data.onLoad, window.data.onError);
  };

  var pageDeactivate = function (isReset) {
    setAddrCoords();
    window.pin.restylePin();
    mapEl.classList.add('map--faded');
    changeFormOnPageDeactivate();
    if (isReset) {
      window.filter.resetFilterForm();
      window.card.remove();
      window.pin.hidePins();
    }
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
    formHouseTypeCollArr.forEach(function (item, i) {
      if (item.value === HOUSE_TP_OPTION_DEFAULT) {
        setElAttr(formHouseTypeCollArr[i]);
      }
    });
    adFormCheckInCollArr.forEach(function (item, i) {
      if (item.value === CHECKIN_OPTION_DEFAULT) {
        setElAttr(adFormCheckInCollArr[i]);
        setElAttr(adFormCheckOutColl[i]);
      }
    });
    roomNumberCollArr.forEach(function (item, i) {
      if (item.value === ROOM_NUMBER_OPTION_DEFAULT) {
        setElAttr(roomNumberCollArr[i]);
        setCapacityElOption(roomNumberEl.selectedIndex);
      }
    });
    featureCollArr.forEach(function (item, i) {
      featureCollArr[i].checked = false;
    });

    clearPreviewPhotos();
    descriptionEl.value = '';
    window.pin.restylePin();
  };

  var onLoad = function () {
    changeFormOnSubmit();
    var template = document.querySelector('#success').content.querySelector('.success');
    var domElement = template.cloneNode(true);
    var parentElement = document.querySelector('main');
    parentElement.insertAdjacentElement('afterbegin', domElement);

    var onSuccessSubmitClick = function () {
      var successBtnClick = document.querySelector('.success');
      if (successBtnClick) {
        successBtnClick.remove();
        document.removeEventListener('click', onSuccessSubmitClick);
      }
      document.removeEventListener('keydown', onSuccessSubmitKeydown);
    };

    var onSuccessSubmitKeydown = function (evt) {
      window.util.isEscEvent(evt, onSuccessSubmitClick);
    };

    document.addEventListener('click', onSuccessSubmitClick);
    document.addEventListener('keydown', onSuccessSubmitKeydown);
  };

  document.addEventListener('DOMContentLoaded', onPageFirstLoad);

  submitFormEl.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adFormEl), onLoad, window.data.onError);
  });

  window.pageForm = {
    setAddrCoords: setAddrCoords,
    pageActivate: pageActivate,
    onLoad: onLoad,
    formEl: adFormEl
  };
})();
