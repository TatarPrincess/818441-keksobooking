'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var formEl = window.pageForm.element;
  var fileName;
  var matches;

  var createDomElImg = function (objectItem, srcValue) {
    var newImgEl = document.createElement('img');
    newImgEl.src = srcValue;
    return newImgEl;
  };

  var changeUserAvatar = function () {
    var fileChooserEl = formEl.querySelector('.ad-form__field input[type=file]');
    var previewImgEl = window.pageForm.adHeaderImgEl;

    fileChooserEl.addEventListener('change', function () {
      var file = fileChooserEl.files[0];
      fileName = file.name.toLowerCase();

      matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewImgEl.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  };

  changeUserAvatar();

  var uploadAccomodationPhotos = function () {
    var fileChooserEl = formEl.querySelector('.ad-form__upload input[type=file]');
    var previewImgContainerEl = window.pageForm.adPhotoEl;

    fileChooserEl.addEventListener('change', function () {
      var fileList = fileChooserEl.files;
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
            previewImgContainerEl.appendChild(domElementFinal);
          });

          reader.readAsDataURL(item);
        }
      });
    });
  };

  uploadAccomodationPhotos();

})();
