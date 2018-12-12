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

// Создаем шаблон для отображения карточки объекта недвижимости
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция перевода типа жилья на русский язык
var getTranslateNameType = function (offerType) {
  switch (offerType) {
    case 'flat': return 'Квартира';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
    case 'bungalo': return 'Бунгало';
    default: return 'unknown';

  }
};

// Функция отображения карточки
var renderCard = function (realEstateCard) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = realEstateCard['offer']['title'];
  cardElement.querySelector('.popup__text--address').textContent = realEstateCard['offer']['address'];
  cardElement.querySelector('.popup__text--price').innerHTML = realEstateCard['offer']['price'] + '&#x20bd;' + '<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = getTranslateNameType(realEstateCard['offer']['type']);
  cardElement.querySelector('.popup__text--capacity').textContent = realEstateCard['offer']['rooms'] + ' комнаты для ' + realEstateCard['offer']['guests'] + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + realEstateCard['offer']['checkin'] + ', выездо до ' + realEstateCard['offer']['checkout'];
  // В разметке есть все виды услуг. В массиве могут быть не все
  // Чтобы отобразить нужные, необходимо перебрать элементы в разметке,
  // если в разметке есть элемент, и такой элемент есть в массиве, то оставляем пункт разметки
  // если в разметке есть элемент, а в массиве нет, то удаляем узел разметки
  var popupFeatures = cardElement.querySelector('.popup__features');
  var deleteFeatures = [];
  for (var indexOne = 0; indexOne < popupFeatures.children.length; indexOne++) {
    var isFeature = false;
    for (var indexTwo = 0; indexTwo < realEstateCard['offer']['features'].length; indexTwo++) {
      if ((popupFeatures.children[indexOne].className.indexOf('--' + realEstateCard['offer']['features'][indexTwo])) !== -1) {
        isFeature = true;
      }
    }
    if (!isFeature) {
      deleteFeatures.push(popupFeatures.children[indexOne]);
    }
  }
  // Удаляем ненужные виды услуг
  for (var indexDeleteFeature = 0; indexDeleteFeature < deleteFeatures.length; indexDeleteFeature++) {
    popupFeatures.removeChild(deleteFeatures[indexDeleteFeature]);
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
mapAdverts.insertBefore(renderCard(realEstates[0]), mapAdverts.children[1]);

