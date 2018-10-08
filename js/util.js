'use strict';


(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var processIfEnterEvent = function (evt) {
    return evt.keyCode === ENTER_KEYCODE;
  };

  var processIfEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };


  window.util = {
    processIfEnterEvent: processIfEnterEvent,
    processIfEscEvent: processIfEscEvent
  };
})();
