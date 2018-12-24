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

var listCheckInOut = ['12:00', '13:00', '14:00'];

var typeResidence = {
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало',
  'flat': 'Квартира'
};

// Функция перемешивания массива, благополучно взятая из харбра, по совету, чтобы не изобретать велосипед :)
var shuffle = function (arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
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
    /* Не смог разобраться, почему определение listPhotos нужно именно здесь, а не "вверху" со всеми остальными
    *  Если объявить со всеми остальными, функция shuffle(listPhotos) перемешивает один раз
    *  Получается, что для всех 8 объектов список фотографий одинаковый
    *  Если вставить определение здесь, то все ок
    * */
    var listPhotos = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];
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
    fragment.appendChild(renderPin(realEstatesPin[j]));
  }
  return fragment;
};

// Создаем шаблон для отображения карточки объекта недвижимости
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция отображения карточки
var renderCard = function (realEstateCard) {
  var cardElement = cardTemplate.cloneNode(true);
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


var realEstates = [];
// Создание объектов JS на основе созданных данных
realEstates = createRealEstates(COUNT_REAL_ESATE);

var buttonMouseUpHandler = function () {
  mapAdverts.classList.remove('map--faded');
  formAd.classList.remove('ad-form--disabled');
  formFilters.classList.remove('ad-form--disabled');
  for (var j = 0; j < formAd.children.length; j++) {
    formAd.children[j].removeAttribute('disabled');
  }
  // Находим блок, где будем отображать метки и отображаем их
  var blockPins = document.querySelector('.map__pins');
  blockPins.appendChild(renderPins(realEstates));
  // Задание 2. Узнать координаты метки.
  console.log('x - ' + mapPin.offsetLeft + ', y - ' + mapPin.offsetTop);
  // Узнать координаты первой метки
  // Вычислить координаты ее центра
  var leftMapPin = mapPin.offsetLeft + 31;
  var topMapPin = mapPin.offsetTop + 31;
  // Записать данные координат в форму объявления
  formAd.querySelector('#address').setAttribute('value', leftMapPin + ', ' + topMapPin);
};

mapPin.addEventListener('mouseup', buttonMouseUpHandler);

// Задание 3.
// При клике на метку, отображать данные в карточке.
// Используем делегирование
// Находим карту, находим метку, по порядковому номеру аватарки находим элемент массива, принадлежащий выбранному объекту
// Отображаем актуальные данные метки

mapAdverts.addEventListener('click', function (evt) {
  if ((evt.target.classList.contains('map__pin')) && (!evt.target.classList.contains('map__pin--main'))) {
    if (mapAdverts.children[1].classList.contains('map__card')) {
      mapAdverts.removeChild(mapAdverts.children[1]);
    }
    var pathImg = evt.target.querySelector('img');
    mapAdverts.insertBefore(renderCard(realEstates[(Number(pathImg.getAttribute('src').slice(16, -4)) - 1)]), mapAdverts.children[1]);
  }
});


