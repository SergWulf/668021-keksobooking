'use strict';

var MAX_ROOMS = 100;
var MAX_GUESTS = 0;

var typeResidencePrice = {
  'palace': 10000,
  'house': 5000,
  'bungalo': 0,
  'flat': 1000
};

var MESSAGE_ERROR_VALIDATION = 'Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей';

// Функция блокировки/разблокировки полей формы
var blockingFormFields = function (block) {
  formAd.classList.toggle('ad-form--disabled');
  for (var j = 0; j < formAd.children.length; j++) {
    if (!block) {
      formAd.children[j].removeAttribute('disabled');
    } else {
      formAd.children[j].setAttribute('disabled', 'disabled');
    }
  }
};

// Функция валидации соответствия: вид жительста - минимальная цена
//     «Бунгало» — минимальная цена за ночь 0;
//     «Квартира» — минимальная цена за ночь 1 000;
//     «Дом» — минимальная цена 5 000;
//     «Дворец» — минимальная цена 10 000;
// Вместе с минимальным значением цены нужно изменять и плейсхолдер.
var typeOfHouse = document.querySelector('#type');
var inputPrice = document.querySelector('#price');
// Обработка первоначального значения формы
inputPrice.setAttribute('min', typeResidencePrice[typeOfHouse.options[typeOfHouse.selectedIndex].value]);
inputPrice.setAttribute('placeholder', typeResidencePrice[typeOfHouse.options[typeOfHouse.selectedIndex].value]);

typeOfHouse.addEventListener('change', function (evt) {
  inputPrice.setAttribute('min', typeResidencePrice[typeOfHouse.options[evt.currentTarget.selectedIndex].value]);
  inputPrice.setAttribute('placeholder', typeResidencePrice[typeOfHouse.options[evt.currentTarget.selectedIndex].value]);
});

// Валидация полей заезды и выезда
// Поля «Время заезда» и «Время выезда» синхронизированы:
// при изменении значения одного поля, во втором выделяется соответствующее ему.
// Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот.
//
// 1. Обработка события на каждом поле
// 2. Если одно поле принимает определенное значение, то и другое поле, послы выбора значения, принимает тоже значение
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var validationTime = function (evt) {
  if (evt.currentTarget.name === 'timeout') {
    timeIn.options.selectedIndex = timeOut.options.selectedIndex;
  } else {
    timeOut.options.selectedIndex = timeIn.options.selectedIndex;
  }
};

timeIn.addEventListener('change', validationTime, false);
timeOut.addEventListener('change', validationTime, false);

// Функция валидации соответствия: полей "вид жительства" - "кол-во комнат".
//     1 комната — «для 1 гостя»;
//     2 комнаты — «для 2 гостей» или «для 1 гостя»;
//     3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
//     100 комнат — «не для гостей»;
var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

var validationGuestsInRoom = function (evt) {
  // Сразу записываем сообщения об несоответствии комнат и гостей, в дальнейшем эти значения примут истинные значения
  roomNumber.setCustomValidity(MESSAGE_ERROR_VALIDATION);
  capacity.setCustomValidity(MESSAGE_ERROR_VALIDATION);
  var expressionMaxRooms = (Number(roomNumber.options[roomNumber.selectedIndex].value) === MAX_ROOMS);
  var expressionMagGuests = (Number(capacity.options[capacity.selectedIndex].value) === MAX_GUESTS);
  // Записываем значения условия в переменную (здесь условие, проверяющие, что нету не стандартных значений в комнатах и кол-ве гостей
  var expressionWithoutMaxValue = ((!expressionMaxRooms) && (!expressionMagGuests));
  // Здесь условие, что выбраны именно не стандартные значения комнат и гостей: 100 и 0;
  var expressionWithMaxValue = (expressionMagGuests && expressionMaxRooms);
  // Переменная, которая хранит условие проверки соответсвия гостей - комнатам, либо комнат - гостям.
  var currentExpressionCondition = (roomNumber.options[roomNumber.selectedIndex].value >= capacity.options[capacity.selectedIndex].value);
  if ((Boolean(evt)) && (evt.currentTarget.name === 'capacity')) {
    currentExpressionCondition = (capacity.options[capacity.selectedIndex].value <= roomNumber.options[roomNumber.selectedIndex].value);
  }
  // Основная проверка соответствия комнат гостям
  if ((expressionWithoutMaxValue && currentExpressionCondition) || (expressionWithMaxValue)) {
    roomNumber.setCustomValidity('');
    capacity.setCustomValidity('');
  }
};

validationGuestsInRoom(false);
roomNumber.addEventListener('change', validationGuestsInRoom, false);
capacity.addEventListener('change', validationGuestsInRoom, false);