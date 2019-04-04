'use strict';

(function () {
  // Функция отображения координат метки
  var showCoordinatesMapPin = function (pin, drag) {
    var leftMapPin = pin.offsetLeft + window.data.COORDINATE_HALF_PIN_MAIN_X_Y;
    var topMapPin = pin.offsetTop + window.data.COORDINATE_HALF_PIN_MAIN_X_Y;
    if (drag) {
      topMapPin = pin.offsetTop + window.data.HEIGHT_PIN_MAIN;
    }
    // Записать данные координат в форму объявления
    return String(leftMapPin + ', ' + topMapPin);
  };

  // Изначальные координаты метки
  window.data.formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(window.data.mapPin, false));


  var buttonMouseDownHandlerCreatePins = function (evtDoc) {
    evtDoc.preventDefault();
    // Изменяем первоначальный вид главной метки: добавляем указатель и убираем анимацию
    window.data.mapAdverts.classList.remove('map--faded');
    window.data.formFilters.classList.remove('ad-form--disabled');
    var buttonMouseUpHandlerCreatePins = function (evt) {
      // Находим блок, где будем отображать метки и отображаем их
      evt.preventDefault();
      var blockPins = document.querySelector('.map__pins');
      blockPins.appendChild(window.pin.renderPins(window.data.realEstates));
      // Удаляем блокировку полей формы
      window.blockingFormFields(false);
      document.removeEventListener('mouseup', buttonMouseUpHandlerCreatePins);
    };
    document.addEventListener('mouseup', buttonMouseUpHandlerCreatePins);
    window.data.mapPin.removeEventListener('mousedown', buttonMouseDownHandlerCreatePins);
  };

  // Обработка события 'mouseup' через 'mousedown' на главной метке: создание меток на карте и разблокировки полей формы
  window.data.mapPin.addEventListener('mousedown', buttonMouseDownHandlerCreatePins);

  //  Функция обработка события drag-and-drop
  var buttonMouseDownHandler = function (evt) {
    evt.preventDefault();
    // Начальные координаты во время нажатия на метку
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var dragged = false;
    // Обработка события move
    var buttonMouseMoveHandler = function (moveEvt) {
      dragged = true;
      moveEvt.preventDefault();
      // Сохраняем разницу координат между начальной и текущей позицией метки
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      // Пересохраняем начальные координаты, на текущие
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      // Изменяем координаты метки
      // Если по горизонтали влево значение координаты Х равно или меньше нуля, то перестаем изменять координату X
      // Если по горизонтали вправо значение координаты Х равно или больше размера блока карты с учётом вычета ширины метки, то перестаем изменять координату X
      // Если по вертикали сверху значение координаты Y равно или меньше 130, то перестаем изменять координату Y
      // Если по вертикали снизу значение коорданаты Y больше 630 (с учетом вычета высоты метки), то перестаем изменять координату Y.
      var newOffsetLeft = Number(window.data.mapPin.offsetLeft - shift.x);
      var newOffsetTop = Number(window.data.mapPin.offsetTop - shift.y);
      var minCoordinateX = 0;
      var maxCoordinateX = document.querySelector('.map').clientWidth - window.data.WIDTH_PIN_MAIN;
      var minCoordinateY = window.data.MIN_MAP_Y - window.data.HEIGHT_PIN_MAIN;
      var maxCoordinateY = window.data.MAX_MAP_Y - window.data.HEIGHT_PIN_MAIN;
      if ((newOffsetLeft >= minCoordinateX) && (newOffsetLeft <= maxCoordinateX)) {
        window.data.mapPin.style.left = (window.data.mapPin.offsetLeft - shift.x) + 'px';
      }
      if (((newOffsetTop >= minCoordinateY)) && (newOffsetTop <= maxCoordinateY)) {
        window.data.mapPin.style.top = (window.data.mapPin.offsetTop - shift.y) + 'px';
      }
      // Запись координат в форму объявления
      window.data.formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(window.data.mapPin, dragged));
    };
    // Обработка события mouseup
    var buttonMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      // Запись координат в форму объявления
      window.data.formAd.querySelector('#address').setAttribute('value', showCoordinatesMapPin(window.data.mapPin, dragged));
      document.removeEventListener('mousemove', buttonMouseMoveHandler);
      document.removeEventListener('mouseup', buttonMouseUpHandler);
    };
    document.addEventListener('mousemove', buttonMouseMoveHandler);
    document.addEventListener('mouseup', buttonMouseUpHandler);
  };

  window.data.mapPin.addEventListener('mousedown', buttonMouseDownHandler);

  // Обработка события 'click' на карте - если попали на метку, то отображем карточку метки(если уже есть карточка метки, то удаляем ее).
  window.data.mapAdverts.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.tagName === 'IMG') {
      target = target.parentNode;
    }
    if ((target.classList.contains('map__pin')) && (!target.classList.contains('map__pin--main'))) {
      if (window.data.mapAdverts.querySelector('.map__card')) {
        window.data.mapAdverts.removeChild(window.data.mapAdverts.querySelector('.map__card'));
      }
      window.data.mapAdverts.insertBefore(window.card.renderCard(window.data.realEstates[target.dataset.index]), window.data.mapAdverts.children[1]);
    }
  });

  window.map = {
    showCoordinatesMapPin: showCoordinatesMapPin,
    buttonMouseDownHandlerCreatePins: buttonMouseDownHandlerCreatePins
  };
})();
