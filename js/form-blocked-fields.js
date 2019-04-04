'use strict';

(function () {
  // Функция блокировки/разблокировки полей формы
  window.blockingFormFields = function (block) {
    window.data.formAd.classList.toggle('ad-form--disabled');
    for (var j = 0; j < window.data.formAd.children.length; j++) {
      if (!block) {
        window.data.formAd.children[j].removeAttribute('disabled');
      } else {
        window.data.formAd.children[j].setAttribute('disabled', 'disabled');
      }
    }
  };
})();
