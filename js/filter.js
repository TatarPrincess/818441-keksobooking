'use strict';

(function () {

  var mapEl = document.querySelector('.map');
  var filterForm = document.querySelector('.map__filters');
  var type = mapEl.querySelector('#housing-type');
  var price = mapEl.querySelector('#housing-price');
  var rooms = mapEl.querySelector('#housing-rooms');
  var guests = mapEl.querySelector('#housing-guests');
  var featuresWifi = mapEl.querySelector('#filter-wifi');
  var featuresDishwasher = mapEl.querySelector('#filter-dishwasher');
  var featuresParking = mapEl.querySelector('#filter-parking');
  var featuresWasher = mapEl.querySelector('#filter-washer');
  var featuresElevator = mapEl.querySelector('#filter-elevator');
  var featuresConditioner = mapEl.querySelector('#filter-conditioner');
  var objArr = window.data.advtItems;
  var PRICE_BOTTOM_MARGIN = 10000;
  var PRICE_TOP_MARGIN = 50000;
  var objFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var inputFeatures = [featuresWifi, featuresDishwasher, featuresParking, featuresWasher, featuresElevator, featuresConditioner];

  var DEBOUNCE_INTERVAL = 500; // миллисекунды

  var debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var resetSelect = function (selectEl) {
    selectEl.selectedIndex = 0;
  };
  var resetInput = function (inputEl) {
    inputEl.checked = false;
  };
  var filterSelectEls = [type, price, rooms, guests];

  var resetFilterForm = function () {
    filterSelectEls.forEach(function (item) {
      resetSelect(item);
    });
    inputFeatures.forEach(function (item) {
      resetInput(item);
    });

  };

  var onFormChange = function () {

    var getCheckedInputValue = function (inputEl) {
      var result;
      if (inputEl.checked) {
        result = inputEl.value;
      }
      return result;
    };

    var value = {
      type: type.options[type.selectedIndex].value,
      price: price.options[price.selectedIndex].value,
      rooms: rooms.options[rooms.selectedIndex].value,
      guests: guests.options[guests.selectedIndex].value,
      wifi: getCheckedInputValue(featuresWifi),
      dishwasher: getCheckedInputValue(featuresDishwasher),
      parking: getCheckedInputValue(featuresParking),
      washer: getCheckedInputValue(featuresWasher),
      elevator: getCheckedInputValue(featuresElevator),
      conditioner: getCheckedInputValue(featuresConditioner)
    };

    var filteredBy = objArr.slice(0);
    // тип жилья
    if (value.type !== 'any') {
      filteredBy = filteredBy.filter(function (item) {
        return item.offer.type === value.type;
      });
    }

    // цена
    if (value.price !== 'any') {
      filteredBy = filteredBy.filter(
          function (item) {
            if (value.price === 'low') {
              return item.offer.price < PRICE_BOTTOM_MARGIN;
            } else if (value.price === 'high') {
              return item.offer.price > PRICE_TOP_MARGIN;
            } else {
              return item.offer.price <= PRICE_TOP_MARGIN && item.offer.price >= PRICE_BOTTOM_MARGIN;
            }

          });
    }

    // комнаты
    if (value.rooms !== 'any') {
      filteredBy = filteredBy.filter(function (item) {
        return item.offer.rooms === Number(value.rooms);
      });
    }

    // гости
    if (value.guests !== 'any') {
      filteredBy = filteredBy.filter(function (item) {
        return item.offer.guests === value.guests;
      });
    }

    // удобства


    var checkedFeatures = objFeatures.filter(function (itm) {
      return Boolean(value[itm]) === true;
    });

    checkedFeatures.forEach(function (it) {
      filteredBy = filteredBy.filter(function (item) {
        var currenctObjFeaturesArr = item.offer.features;
        return currenctObjFeaturesArr.includes(it) === true;
      });
    });

    window.card.hide();
    window.pin.clearPins();
    window.pin.drawPins(filteredBy);
  };

  filterForm.addEventListener('change', debounce(onFormChange));

  window.filter = {
    mapEl: mapEl,
    resetFilterForm: resetFilterForm
  };

})();
