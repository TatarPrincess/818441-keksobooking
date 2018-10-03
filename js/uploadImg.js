'use strict';

(function () {
  var formEl = window.pageForm.formEl;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileName;
  var matches;

  var createDomElImg = function (objectItem, srcValue) {
    var newImg = document.createElement('img');
    newImg.src = srcValue;
    return newImg;
  };

  var changeUserAvatar = function () {
    var fileChooser = formEl.querySelector('.ad-form__field input[type=file]');
    var preview = formEl.querySelector('.ad-form-header__preview img');

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      fileName = file.name.toLowerCase();

      matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          preview.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  };

  changeUserAvatar();

  var uploadAccomodationPhotos = function () {
    var fileChooser = formEl.querySelector('.ad-form__upload input[type=file]');
    var previewContainer = formEl.querySelector('.ad-form__photo');

    fileChooser.addEventListener('change', function () {
      var fileList = fileChooser.files;
      var fileListToArr = Array.from(fileList);

      fileListToArr.forEach(function (item) {
        fileName = item.name.toLowerCase();
        matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });
        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var domElementFinal = createDomElImg(item, reader.result);
            previewContainer.appendChild(domElementFinal);
          });

          reader.readAsDataURL(item);
        }
      });
    });
  };

  uploadAccomodationPhotos();

})();
