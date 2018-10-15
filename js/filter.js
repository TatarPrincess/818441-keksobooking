'use strict';

(function () {
  var PRICE_BOTTOM_MARGIN = 10000;
  var PRICE_TOP_MARGIN = 50000;
  var DEBOUNCE_INTERVAL = 500; // миллисекунды

  var mapEl = window.pin.mapEl;
  var filterFormEl = document.querySelector('.map__filters');
  var typeEl = mapEl.querySelector('#housing-type');
  var priceEl = mapEl.querySelector('#housing-price');
  var roomsEl = mapEl.querySelector('#housing-rooms');
  var guestsEl = mapEl.querySelector('#housing-guests');
  var featuresWifiEl = mapEl.querySelector('#filter-wifi');
  var featuresDishwasherEl = mapEl.querySelector('#filter-dishwasher');
  var featuresParkingEl = mapEl.querySelector('#filter-parking');
  var featuresWasherEl = mapEl.querySelector('#filter-washer');
  var featuresElevatorEl = mapEl.querySelector('#filter-elevator');
  var featuresConditionerEl = mapEl.querySelector('#filter-conditioner');
  var objArr = window.data.advtItems;
  var objFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var inputFeatures = [featuresWifiEl, featuresDishwasherEl, featuresParkingEl, featuresWasherEl, featuresElevatorEl, featuresConditionerEl];

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
  var filterSelectEls = [typeEl, priceEl, roomsEl, guestsEl];

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

    var valueOf = {
      type: typeEl.options[typeEl.selectedIndex].value,
      price: priceEl.options[priceEl.selectedIndex].value,
      rooms: roomsEl.options[roomsEl.selectedIndex].value,
      guests: guestsEl.options[guestsEl.selectedIndex].value,
      wifi: getCheckedInputValue(featuresWifiEl),
      dishwasher: getCheckedInputValue(featuresDishwasherEl),
      parking: getCheckedInputValue(featuresParkingEl),
      washer: getCheckedInputValue(featuresWasherEl),
      elevator: getCheckedInputValue(featuresElevatorEl),
      conditioner: getCheckedInputValue(featuresConditionerEl)
    };

    var filter = {
      type: function (item) {
        return item.offer.type === valueOf.type;
      },
      price: function (item) {
        if (valueOf.price === 'low') {
          return item.offer.price < PRICE_BOTTOM_MARGIN;
        }
        if (valueOf.price === 'high') {
          return item.offer.price > PRICE_TOP_MARGIN;
        }
        return item.offer.price <= PRICE_TOP_MARGIN && item.offer.price >= PRICE_BOTTOM_MARGIN;
      },
      rooms: function (item) {
        return item.offer.rooms === Number(valueOf.rooms);
      },
      guests: function (item) {
        return String(item.offer.guests) === valueOf.guests;
      }
    };

    var filteredBy = objArr.slice(0);
    for (var key in filter) {
      if (valueOf[key] !== 'any') {
        filteredBy = filteredBy.filter(filter[key]);
      }
    }

    // удобства
    var checkedFeatures = objFeatures.filter(function (itm) {
      return (Boolean(valueOf[itm]));
    });

    checkedFeatures.forEach(function (it) {
      filteredBy = filteredBy.filter(function (item) {
        var currenctObjFeaturesArr = item.offer.features;
        return (currenctObjFeaturesArr.includes(it));
      });
    });

    window.card.remove();
    window.pin.clear();
    window.pin.draw(filteredBy);
  };

  var onFeatureCheckboxClick = function (evt) {
    if (window.util.processIfEnterEvent(evt)) {
      evt.preventDefault();
      evt.target.click();
    }
  };

  inputFeatures.forEach(function (item) {
    item.addEventListener('keydown', onFeatureCheckboxClick);
  });

  filterFormEl.addEventListener('change', debounce(onFormChange));

  window.filter = {
    resetForm: resetFilterForm,
    onFeatureCheckboxClick: onFeatureCheckboxClick
  };

})();
