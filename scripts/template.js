const templateModalAddContact = `<div class="container-modal">
<div class="wrapper-modal modal">
<div class="flex-container">
<h2 class="modal__title">Новый клиент</h2>
<button class="close-modal"></button>
</div>
<form class="modal__form form">
<div class="form__wrapper-input">
<input id="surname" class="form__input" type="text" data-type="surname">
<label for="surname" class="form__label">Фамилия</label>
</div>
<div class="form__wrapper-input">
<input id="name" class="form__input" type="text" data-type="name">
<label for="name" class="form__label">Имя</label>
</div>
<div class="form__wrapper-input">
<input id="lastName" class="form__input" type="text" data-type="lastName">
<label for="lastName" class="form__label">Отчество</label>
</div>
<div class="wrapper-adding-contacts">
<button class="btn-add-contact">Добавить контакт</button>
</div>
<button class="btn-save-client" type="submit">Сохранить</button>
<button class="form__btn-cancel cancel-creation">Отмена</button>
</form>
</div>
</div>`;

const templateBackgroundLayer = `<div class="background-layer"></div>`;

const templateSelect = `
<div class="container-contact">
  <div class="wrapper-select">
    <div class="wrapper-select__selected-contact">Телефон</div>
    <ul class="wrapper-select__list select-list">
      <li class="select-list__item active" data-type="phone">Телефон</li>
      <li class="select-list__item" data-type="mail">Email</li>
      <li class="select-list__item" data-type="vk">Vk</li>
      <li class="select-list__item" data-type="facebook">Facebook</li>
      <li class="select-list__item" data-type="additional-contact">Другое</li>
    </ul>
  </div>
  <input class="container-contact__input" data-type="phone" type="number">
  <button class="container-contact__button-remove" data-tooltip="Удалить контакт"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
  </svg></button>
</div>`;

const templateConfirmDeletion = `<div class="container-modal">
<div class="wrapper-modal modal modal-confirm-remove">
<h2 class="modal__title title-confirm-remove">Удалить клиента</h2>
<p class="modal__text">Вы действительно хотите удалить данного клиента?</p>
<button class="btn-remove-client">Удалить</button>
<button class="form__btn-cancel">Отмена</button>
<button class="close-modal close-modal-confirm-remove"></button>
</div>
</div>`;