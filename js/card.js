'use strict';

// Создаем шаблон для отображения карточки объекта недвижимости
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Функция отображения карточки
var renderCard = function (realEstateCard) {
  var cardElement = cardTemplate.cloneNode(true);
  var closePopup = cardElement.querySelector('.popup__close');
  cardElement.querySelector('.popup__title').textContent = realEstateCard['offer']['title'];
  cardElement.querySelector('.popup__text--address').textContent = realEstateCard['offer']['address'];
  cardElement.querySelector('.popup__text--price').innerHTML = realEstateCard['offer']['price'] + '&#x20bd;' + '<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = window.data.typeResidence[realEstateCard['offer']['type']];
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