'use strict';

var COUNT_REAL_ESATE = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_COUNT_ROOMS = 1;
var MAX_COUNT_ROOMS = 5;
var MIN_COUNT_GUESTS = 2;
var MAX_COUNT_GUESTS = 11;
var COORDINATE_PIN_X = 31;
var COORDINATE_PIN_Y = 84;
var MIN_COORDINATE_Y = 130 + COORDINATE_PIN_Y;
var MAX_COORDINATE_Y = 630 - COORDINATE_PIN_Y;
var MIN_COORDINATE_X = 0 + COORDINATE_PIN_X;
var MAX_COORDINATE_X = document.querySelector('.map').clientWidth - COORDINATE_PIN_X;
var HALF_WIDTH_MAIN_PIN = 31;
var HALF_HEIGHT_MAIN_PIN = 31;
var realEstates = [];
var MAX_ROOMS = 100;
var MAX_GUESTS = 0;
var MESSAGE_ERROR_VALIDATION = 'Количество гостей не соответствует количеству комнат: 1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей';


var titlesResidence = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var listFeatures = [
  'wifi',
  'dishwasher',
  'washer',
  'parking',
  'elevator',
  'conditioner'
];

var listPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var listCheckInOut = ['12:00', '13:00', '14:00'];

var typeResidence = {
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало',
  'flat': 'Квартира'
};

var typeResidencePrice = {
  'palace': 10000,
  'house': 5000,
  'bungalo': 0,
  'flat': 1000
};

// Функция перемешивания массива, благополучно взятая из харбра, по совету, чтобы не изобретать велосипед :)
var shuffle = function (arr) {
  var j;
  var temp;
  var newArr = arr.slice();
  for (var i = newArr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = newArr[j];
    newArr[j] = newArr[i];
    newArr[i] = temp;
  }
  return newArr;
};

// Функция получения случайного числа из положительного диапазона целых чисел
var getRandomNumberRange = function (firstNumber, lastNumber) {
  return Math.round(Math.random() * (lastNumber - firstNumber) + firstNumber);
};

// Функция получения случайного элемента из массива
var getRandomElementOfArray = function (listElements) {
  return Math.floor(Math.random() * listElements.length);
};

// Функция, которая ищет в названии тип недвижимости и возвращает его в удобочитаемом виде
var getTypeResidence = function (titleTypeResidence) {
  for (var key in typeResidence) {
    if ((titleTypeResidence.toLowerCase().indexOf(typeResidence[key].toLowerCase())) !== -1) {
      return key;
    }
  }
  return 'unknown';
};

var getPathImageAvatar = function (numberImage) {
  if ((numberImage < 10) && (numberImage > 0)) {
    numberImage = '0' + numberImage;
  }
  return 'img/avatars/user' + numberImage + '.png';
};

var createRealEstates = function (count) {
  var listRealEstate = [];
  for (var i = 0; i < count; i++) {
    var realEstate = {
      'author': {
        'avatar': getPathImageAvatar(i + 1)
      },
      'offer': {
        'title': titlesResidence[i],
        'price': getRandomNumberRange(MIN_PRICE, MAX_PRICE),
        'type': getTypeResidence(titlesResidence[i]),
        'rooms': getRandomNumberRange(MIN_COUNT_ROOMS, MAX_COUNT_ROOMS),
        'guests': getRandomNumberRange(MIN_COUNT_GUESTS, MAX_COUNT_GUESTS),
        'checkin': listCheckInOut[getRandomElementOfArray(listCheckInOut)],
        'checkout': listCheckInOut[getRandomElementOfArray(listCheckInOut)],
        'features': shuffle(listFeatures).slice(Math.round(Math.random() * (listFeatures.length - 1))),
        'description': '',
        'photos': shuffle(listPhotos)
      },
      'location': {
        'x': getRandomNumberRange(MIN_COORDINATE_X, MAX_COORDINATE_X),
        'y': getRandomNumberRange(MIN_COORDINATE_Y, MAX_COORDINATE_Y)
      },
    };
    realEstate['offer']['address'] = realEstate['location']['x'] + ', ' + realEstate['location']['y'];
    listRealEstate.push(realEstate);
  }
  return listRealEstate;
};

// Создаем шаблон для отображения метки на карте
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (realEstatePin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinPointerCoordinateX = Number(realEstatePin['location']['x']) - COORDINATE_PIN_X;
  var pinPointerCoordianteY = Number(realEstatePin['location']['y']) - COORDINATE_PIN_Y;
  pinElement.style = 'left: ' + pinPointerCoordinateX + 'px; top: ' + pinPointerCoordianteY + 'px;';
  pinElement.querySelector('img').src = realEstatePin['author']['avatar'];
  pinElement.querySelector('img').alt = realEstatePin['offer']['title'];
  return pinElement;
};

var renderPins = function (realEstatesPin) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < realEstatesPin.length; j++) {
    var newPinElement = renderPin(realEstatesPin[j]);
    newPinElement.setAttribute('data-index', j);
    fragment.appendChild(newPinElement);
  }
  return fragment;
};

// Создаем шаблон для отображения карточки объекта недвижимости
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция отображения карточки
var renderCard = function (realEstateCard) {
  var cardElement = cardTemplate.cloneNode(true);
  var closePopup = cardElement.querySelector('.popup__close');
  cardElement.querySelector('.popup__title').textContent = realEstateCard['offer']['title'];
  cardElement.querySelector('.popup__text--address').textContent = realEstateCard['offer']['address'];
  cardElement.querySelector('.popup__text--price').innerHTML = realEstateCard['offer']['price'] + '&#x20bd;' + '<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = typeResidence[realEstateCard['offer']['type']];
  cardElement.querySelector('.popup__text--capacity').textContent = realEstateCard['offer']['rooms'] + ' комнаты для ' + realEstateCard['offer']['guests'] + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + realEstateCard['offer']['checkin'] + ', выездо до ' + realEstateCard['offer']['checkout'];
  // В разметке находим блок предоставления услуг
  var popupFeatures = cardElement.querySelector('.popup__features');
  // Удаляем все виды услуг из разметки
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  // Добавляем нужные услуги в разметку
  for (var i = 0; i < realEstateCard['offer']['features'].length; i++) {
    var elementFeature = document.createElement('li');
    elementFeature.className = 'popup__feature popup__feature--' + realEstateCard['offer']['features'][i];
    popupFeatures.appendChild(elementFeature);
  }
  cardElement.querySelector('.popup__description').textContent = realEstateCard['offer']['description'];
  // Добавляем фотографии в карточку объекта недвижимости
  var popupPhotos = cardElement.querySelector('.popup__photos');
  for (var j = 0; j < realEstateCard['offer']['photos'].length; j++) {
    var popupPhoto = popupPhotos.querySelector('img').cloneNode(true);
    popupPhoto.src = realEstateCard['offer']['photos'][j];
    popupPhotos.appendChild(popupPhoto);
  }
  popupPhotos.removeChild(popupPhotos.children[0]);
  cardElement.querySelector('.popup__avatar').src = realEstateCard['author']['avatar'];
  closePopup.addEventListener('click', function () {
    cardElement.classList.add('hidden');
  });
  return cardElement;
};

/*
var renderCards = function (realEstatesCard) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < realEstatesCard.length; j++) {
    fragment.appendChild(renderCard(realEstatesCard[j]));
  }
  return fragment;
};
*/

// Отображаем первую карточку
/*
mapAdverts.insertBefore(renderCard(realEstates[0]), mapAdverts.children[1]);
*/

var formAd = document.querySelector('.ad-form');
var formFilters = document.querySelector('.map__filters');

for (var i = 0; i < formAd.children.length; i++) {
  formAd.children[i].setAttribute('disabled', 'disabled');
}

var mapAdverts = document.querySelector('.map');
var mapPin = document.querySelector('.map__pin--main');

// Создание объектов JS на основе созданных данных
realEstates = createRealEstates(COUNT_REAL_ESATE);

var buttonMouseUpHandlerCreatePins = function () {
  // Находим блок, где будем отображать метки и отображаем их
  var blockPins = document.querySelector('.map__pins');
  blockPins.appendChild(renderPins(realEstates));
  // Удаляем блокировку полей формы
  mapAdverts.classList.remove('map--faded');
  formAd.classList.remove('ad-form--disabled');
  formFilters.classList.remove('ad-form--disabled');
  for (var j = 0; j < formAd.children.length; j++) {
    formAd.children[j].removeAttribute('disabled');
  }
  mapPin.removeEventListener('mouseup', buttonMouseUpHandlerCreatePins);
};

// Обработка события 'mouseup' на главной метке: создание меток на карте и разблокировки полей формы
mapPin.addEventListener('mouseup', buttonMouseUpHandlerCreatePins);

//  Функция обработка события drag-and-drop
var buttonMouseDownHandler = function (evt) {
  evt.preventDefault();
  // Начальные координаты во время нажатия на метку
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  // Обработка события move
  var buttonMouseMoveHandler = function (moveEvt) {
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
    mapPin.style.top = (mapPin.offsetTop - shift.y) + 'px';
    mapPin.style.left = (mapPin.offsetLeft - shift.x) + 'px';
  };
  // Обработка события mouseup
  var buttonMouseUpHandler = function (upEvt) {
    // ? Необходимо разделить координаты меток(если не было движения, то координаты центра)
    // ? Если было движение, то коордианты указателя.
    // ----------------------------------------------
    // ? Также надо учесть выход за пределы карты метки.
    // ----------------------------------------------
    // ? Когда метка наезжает на действующую метку, то фокус передается в нее. Так и должно быть?
    // ? Иногда метка начинает себя странно вести, улетает за пределы экрана(не совсем понял, как это можно отловить).
    upEvt.preventDefault();
    // Узнать координаты первой метки
    // Вычислить координаты ее центра
    var leftMapPin = mapPin.offsetLeft + HALF_WIDTH_MAIN_PIN;
    var topMapPin = mapPin.offsetTop + HALF_HEIGHT_MAIN_PIN;
    // Записать данные координат в форму объявления
    formAd.querySelector('#address').setAttribute('value', leftMapPin + ', ' + topMapPin);
    mapPin.removeEventListener('mousemove', buttonMouseMoveHandler);
    mapPin.removeEventListener('mouseup', buttonMouseUpHandler);
  };
  // ? Вопросы: метка передвигается хорошо, если ее медленно передвигать
  // ? Если резко дернуть мышь, то фокус уйдет, а метка остановится
  // ? Но если вернутся на метку, то она опять начинает передвигаться
  // ? Если резко уйти из фокуса и отпустить кнопку мыши, то при наведении на метку она опять к ней "приклеивается.
  mapPin.addEventListener('mousemove', buttonMouseMoveHandler);
  mapPin.addEventListener('mouseup', buttonMouseUpHandler);
};

mapPin.addEventListener('mousedown', buttonMouseDownHandler);

// Обработка события 'click' на карте - если попали на метку, то отображем карточку метки(если уже есть карточка метки, то удаляем ее).
mapAdverts.addEventListener('click', function (evt) {
  var target = evt.target;
  if (target.tagName === 'IMG') {
    target = target.parentNode;
  }
  if ((target.classList.contains('map__pin')) && (!target.classList.contains('map__pin--main'))) {
    if (mapAdverts.querySelector('.map__card')) {
      mapAdverts.removeChild(mapAdverts.querySelector('.map__card'));
    }
    mapAdverts.insertBefore(renderCard(realEstates[target.dataset.index]), mapAdverts.children[1]);
  }
});

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

