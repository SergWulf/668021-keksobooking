'use strict';

(function () {
  // Создаем шаблон для отображения метки на карте
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Функция создание и добавления метки в pinElement
  var renderPin = function (realEstatePin) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinPointerCoordinateX = Number(realEstatePin['location']['x']) - window.data.COORDINATE_PIN_X;
    var pinPointerCoordianteY = Number(realEstatePin['location']['y']) - window.data.COORDINATE_PIN_Y;
    pinElement.style = 'left: ' + pinPointerCoordinateX + 'px; top: ' + pinPointerCoordianteY + 'px;';
    pinElement.querySelector('img').src = realEstatePin['author']['avatar'];
    pinElement.querySelector('img').alt = realEstatePin['offer']['title'];
    return pinElement;
  };

  // Функция добавления всех меток в fragment
  var renderPins = function (realEstatesPin) {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < realEstatesPin.length; j++) {
      var newPinElement = renderPin(realEstatesPin[j]);
      newPinElement.setAttribute('data-index', j);
      fragment.appendChild(newPinElement);
    }
    return fragment;
  };

  // Экспорт функции
  window.pin = {
    renderPins: renderPins
  };
})();
