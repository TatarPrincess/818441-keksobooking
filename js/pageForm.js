'use strict';

(function () {
  var ROOM_NUMBER_OPTION_DEFAULT = '1';
  var CHECKIN_OPTION_DEFAULT = '12:00';
  var HOUSE_TP_OPTION_DEFAULT = 'flat';
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var MAX_PRICE_PER_NIGHT = 1000000;
  var TYPE_OF_HOUSE_MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var ROOM_CAPACITY_OBJ = {
    0: [1],
    1: [1, 2],
    2: [1, 2, 3],
    3: [0]
  };
  var mapEl = window.card.mapEl;
  var adFormEl = document.querySelector('.ad-form');
  var adFormHeaderEl = adFormEl.querySelector('.ad-form-header');
  var adFormElCollection = adFormEl.querySelectorAll('.ad-form__element');
  var adFormElColArr = Array.from(adFormElCollection);
  var mapFiltersElCollection = mapEl.querySelectorAll('.map__filter');
  var mapFiltersElColArr = Array.from(mapFiltersElCollection);
  var mapPinMainCoordsEl = adFormEl.querySelector('#address');
  var formHouseTypeEl = adFormEl.querySelector('#type');
  var formHouseTypeElCollection = formHouseTypeEl.querySelectorAll('option');
  var formHouseTypeElCollArr = Array.from(formHouseTypeElCollection);
  var formHouseTypePriceEl = adFormEl.querySelector('#price');
  var adFormResetEl = adFormEl.querySelector('.ad-form__reset');
  var adFormCheckInEl = adFormEl.querySelector('#timein');
  var adFormCheckInElCollection = adFormCheckInEl.querySelectorAll('option');
  var adFormCheckInElCollArr = Array.from(adFormCheckInElCollection);
  var adFormCheckOutEl = adFormEl.querySelector('#timeout');
  var adFormCheckOutElCollection = adFormCheckOutEl.querySelectorAll('option');
  var roomNumberEl = adFormEl.querySelector('#room_number');
  var roomNumberElCollection = roomNumberEl.querySelectorAll('option');
  var roomNumberCollArr = Array.from(roomNumberElCollection);
  var capacityParentEl = adFormEl.querySelector('#capacity');
  var capacityElCollection = adFormEl.querySelectorAll('#capacity option');
  var formTitleEl = document.querySelector('#title');
  var featureElCollection = adFormEl.querySelectorAll('.feature__checkbox');
  var featureCollArr = Array.from(featureElCollection);
  var descriptionEl = adFormEl.querySelector('#description');
  var previewContainer = adFormEl.querySelector('.ad-form__photo');
  var preview = adFormEl.querySelector('.ad-form-header__preview img');

  // PAGE

  var onPageFirstLoad = function () {
    pageDeactivate(false);
  };

  var pageActivate = function () {
    mapEl.classList.remove('map--faded');
    changeFormOnPageActivate();
    if (window.data.advtItems.length) {
      window.pin.draw();
    } else {
      window.backend.load(window.data.onLoad, window.data.onError);
    }
  };

  var pageDeactivate = function (isReset) {
    setAddrCoords();
    window.pin.restyle();
    mapEl.classList.add('map--faded');
    changeFormOnPageDeactivate();
    if (isReset) {
      window.filter.resetForm();
      window.card.remove();
      window.pin.hide();
    }
    document.removeEventListener('DOMContentLoaded', onPageFirstLoad);
  };

  // FORM

  var createDomElementCapacity = function (arrEl) {
    var template = arrEl;
    var domElement = template.cloneNode(true);
    return domElement;
  };

  var addCapacityOptions = function (arr) {
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item, i) {
      var domElementFinal = createDomElementCapacity(arr[i]);
      fragment.appendChild(domElementFinal);
    });
    capacityParentEl.appendChild(fragment);
  };

  var getRidOfLetters = function (str) {
    var result = Number(str.replace(/\D+/g, ''));
    return result;
  };
  var setAddrCoords = function (coordX, coordY) {
    var defaultCoords = getRidOfLetters(window.pin.mainX) + ',' + getRidOfLetters(window.pin.mainY);
    var mainPinCoords = coordX + ', ' + coordY;
    // проставляем в input address value переданных координат
    mapPinMainCoordsEl.value = coordX ? mainPinCoords : defaultCoords;

    return mapPinMainCoordsEl.value;
  };

  var fillArr = function (idx) {
    var capacityEls = [];
    var arrIdxSelCapacity = ROOM_CAPACITY_OBJ[idx];
    arrIdxSelCapacity.forEach(function (item, i) {
      var arrItemValue = arrIdxSelCapacity[i];
      capacityEls[i] = capacityElCollection[arrItemValue];
    });
    return capacityEls;

  };

  var setCapacityElOption = function (optionIndex) {
    capacityParentEl.innerHTML = '';
    var capacityEls = fillArr(optionIndex);
    addCapacityOptions(capacityEls);
    return capacityParentEl;
  };

  var clearPreviewPhotos = function () {
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }
    preview.src = DEFAULT_AVATAR_SRC;
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
    formHouseTypePriceEl.min = TYPE_OF_HOUSE_MIN_PRICE[formHouseTypeEl.value];
    formHouseTypeEl.addEventListener('change', onSelectOptionChange);
  };

  var changeFormOnPageDeactivate = function () {
    adFormEl.classList.add('ad-form--disabled');
    adFormHeaderEl.disabled = true;
    formTitleEl.value = '';
    formHouseTypePriceEl.value = '';
    descriptionEl.value = '';
    formHouseTypeElCollArr.forEach(function (item, i) {
      if (item.value === HOUSE_TP_OPTION_DEFAULT) {
        setElAttr(formHouseTypeElCollArr[i]);
      }
    });
    adFormCheckInElCollArr.forEach(function (item, i) {
      if (item.value === CHECKIN_OPTION_DEFAULT) {
        setElAttr(adFormCheckInElCollArr[i]);
        setElAttr(adFormCheckOutElCollection[i]);
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
    adFormElColArr.forEach(function (item, i) {
      adFormElColArr[i].disabled = true;
    });
    mapFiltersElColArr.forEach(function (item, i) {
      mapFiltersElColArr[i].disabled = true;
    });
    clearPreviewPhotos();
    formHouseTypeEl.removeEventListener('change', onSelectOptionChange);
  };

  var onSelectOptionChange = function () {
    formHouseTypePriceEl.placeholder = TYPE_OF_HOUSE_MIN_PRICE[formHouseTypeEl.value];
    formHouseTypePriceEl.min = TYPE_OF_HOUSE_MIN_PRICE[formHouseTypeEl.value];
  };

  var checkPriceValidity = function () {
    var priceValue = formHouseTypePriceEl.value;

    if (isNaN(priceValue) && priceValue === '') {
      return false;
    }
    if (formHouseTypePriceEl.value > MAX_PRICE_PER_NIGHT) {
      return false;
    }

    var selectedOptionIdx = formHouseTypeEl.selectedIndex;
    var selected = formHouseTypeEl.options[selectedOptionIdx];
    if (priceValue < TYPE_OF_HOUSE_MIN_PRICE[selected.value]) {
      return false;
    }

    return true;
  };

  var checkFormValidity = function () {
    if (String(formTitleEl.value).length < MIN_TITLE_LENGTH) {
      return false;
    }
    if (String(formTitleEl.value).length > MAX_TITLE_LENGTH) {
      return false;
    }
    if (!checkPriceValidity()) {
      return false;
    }
    return true;
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

  var onBtnResetKeydown = function (evt) {
    if (window.util.processIfEnterEvent(evt)) {
      evt.preventDefault();
      pageDeactivate(true);
    }
  };
  adFormResetEl.addEventListener('keydown', onBtnResetKeydown);

  // choosing checkIn
  var onCheckInSelectChange = function () {
    if (adFormCheckOutEl.selectedIndex !== -1) {
      adFormCheckOutEl.selectedIndex = adFormCheckInEl.selectedIndex;
    }
  };
  adFormCheckInEl.addEventListener('change', onCheckInSelectChange);
  // choosing checkOut
  var onCheckOutSelectChange = function () {
    if (adFormCheckInEl.selectedIndex !== -1) {
      adFormCheckInEl.selectedIndex = adFormCheckOutEl.selectedIndex;
    }
  };
  adFormCheckOutEl.addEventListener('change', onCheckOutSelectChange);
  // capacity
  var onRoomNumberSelectChange = function () {
    setCapacityElOption(roomNumberEl.selectedIndex);
  };
  roomNumberEl.addEventListener('change', onRoomNumberSelectChange);


  var setElAttr = function (targetEl) {
    targetEl.selected = true;
    return targetEl;
  };

  var onLoad = function () {
    pageDeactivate(true);
    var template = document.querySelector('#success').content.querySelector('.success');
    var domEl = template.cloneNode(true);
    var parentEl = window.data.mainEl;
    parentEl.insertAdjacentElement('afterbegin', domEl);

    var onSuccessSubmitClick = function () {
      var successBtnClick = document.querySelector('.success');
      if (successBtnClick) {
        successBtnClick.remove();
        document.removeEventListener('click', onSuccessSubmitClick);
      }
    };

    var onSuccessSubmitKeydown = function (evt) {
      window.util.processIfEscEvent(evt, onSuccessSubmitClick);
      document.removeEventListener('keydown', onSuccessSubmitKeydown);
    };

    document.addEventListener('click', onSuccessSubmitClick);
    document.addEventListener('keydown', onSuccessSubmitKeydown);
  };

  document.addEventListener('DOMContentLoaded', onPageFirstLoad);

  featureCollArr.forEach(function (item) {
    item.addEventListener('keydown', window.filter.onFeatureCheckboxClick);
  });

  var onSubmitClick = function () {
    if (checkFormValidity()) {
      window.backend.save(new FormData(adFormEl), onLoad, window.data.onError);
    }
  };
  adFormEl.addEventListener('submit', function (evt) {
    evt.preventDefault();
    onSubmitClick();
  });

  window.pageForm = {
    setAddrCoords: setAddrCoords,
    activate: pageActivate,
    onLoad: onLoad,
    element: adFormEl,
    adPhotoEl: previewContainer,
    adHeaderImgEl: preview
  };
})();
