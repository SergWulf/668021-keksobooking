'use strict';

(function () {
  // Данные для создание объектов недвижимости
  var COUNT_REAL_ESATE = 8;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_COUNT_ROOMS = 1;
  var MAX_COUNT_ROOMS = 5;
  var MIN_COUNT_GUESTS = 2;
  var MAX_COUNT_GUESTS = 11;

  // Координаты указателя метки мелких меток
  var COORDINATE_PIN_X = 25;
  var COORDINATE_PIN_Y = 70;
  var MIN_MAP_Y = 130;
  var MAX_MAP_Y = 630;
  var MIN_COORDINATE_Y = MIN_MAP_Y + COORDINATE_PIN_Y;
  var MAX_COORDINATE_Y = MAX_MAP_Y - COORDINATE_PIN_Y;
  var MIN_COORDINATE_X = 0 + COORDINATE_PIN_X;
  var MAX_COORDINATE_X = document.querySelector('.map').clientWidth - COORDINATE_PIN_X;

  var realEstates = [];

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

  // Функция, для создания ссылок для аватара
  var getPathImageAvatar = function (numberImage) {
    if ((numberImage < 10) && (numberImage > 0)) {
      numberImage = '0' + numberImage;
    }
    return 'img/avatars/user' + numberImage + '.png';
  };

  // Создание объекта недвижимости
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

  // Создание объектов JS на основе созданных данных
  realEstates = createRealEstates(COUNT_REAL_ESATE);

  // Экспорт переменных для других модулей
  window.data = {
    realEstates: realEstates,
    COORDINATE_PIN_X: COORDINATE_PIN_X,
    COORDINATE_PIN_Y: COORDINATE_PIN_Y,
    titlesResidence: titlesResidence
  };
})();
