'use strict';

var COUNT_REAL_ESATE = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_COUNT_ROOMS = 1;
var MAX_COUNT_ROOMS = 5;
var MIN_COUNT_GUESTS = 1;
var MAX_COUNT_GUESTS = 10;
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
var listPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var realEstates = [];
var realEstate = {
  'author': {
    'avatar': ''
  },
  'offer': {
    'title': '',
    'address': '',
    'price': '',
    'type': '',
    'rooms': '',
    'guests': '',
    'checkin': '',
    'checkout': '',
    'features': '',
    'description': '',
    'photos': ''
  },
  'location': {
    'x': '',
    'y': ''
  }
};


var randomLengthArray = function (array) {
  var newArray = [];
  var countElements = Math.round(Math.random() * array.length);
  if (countElements === 0) {
    countElements = 1;
  }
  for (var i = 0; i < countElements; i++) {
    newArray[i] = array[i];
  }
  return newArray;
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
  if (titleTypeResidence.indexOf('дворец') !== -1) {
    return 'palace';
  }
  if (titleTypeResidence.indexOf('домик') !== -1) {
    return 'house';
  }
  if (titleTypeResidence.indexOf('квартира') !== -1) {
    return 'flat';
  }
  if (titleTypeResidence.indexOf('бунгало') !== -1) {
    return 'bungalo';
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
    realEstate['author']['avatar'] = getPathImageAvatar(i + 1);
    realEstate['offer']['title'] = titlesResidence[i];
    realEstate['offer']['price'] = getRandomNumberRange(MIN_PRICE, MAX_PRICE);
    realEstate['offer']['address'] = 'dumbum';
    realEstate['offer']['type'] = getTypeResidence(titlesResidence[i]);
    realEstate['offer']['rooms'] = getRandomNumberRange(MIN_COUNT_ROOMS, MAX_COUNT_ROOMS);
    realEstate['offer']['guests'] = getRandomNumberRange(MIN_COUNT_GUESTS, MAX_COUNT_GUESTS);
    realEstate['offer']['checkin'] = listCheckInOut[getRandomElementOfArray(listCheckInOut)];
    realEstate['offer']['checkout'] = listCheckInOut[getRandomElementOfArray(listCheckInOut)];
    realEstate['offer']['features'] = randomLengthArray(shuffle(listFeatures));
    realEstate['offer']['description'] = '';
    realEstate['offer']['photos'] = shuffle(listPhotos);
    realEstate['location']['x'] = getRandomNumberRange(MIN_COORDINATE_X, MAX_COORDINATE_X);
    realEstate['location']['y'] = getRandomNumberRange(MIN_COORDINATE_Y, MAX_COORDINATE_Y);
    realEstate['offer']['address'] = realEstate['location']['x'] + ', ' + realEstate['location']['y'];
    listRealEstate.push(JSON.parse(JSON.stringify(realEstate)));
  }
  return listRealEstate;
};
// Создание объектов JS на основе созданных данных
realEstates = createRealEstates(COUNT_REAL_ESATE);

var mapAdverts = document.querySelector('.map');
mapAdverts.classList.remove('map--faded');

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

// Находим блок, где будем отображать метки и отображаем их
var blockPins = document.querySelector('.map__pins');
blockPins.appendChild(renderPins(realEstates));

