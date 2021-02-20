(() => {

  'use strict';

  const bodyTable = document.querySelector('.tbody');
  const table = document.querySelector('.table');
  const buttonAddClient = document.querySelector('.button-add-client');
  const tHead = document.querySelector('.thead');
  const mainContainer = document.querySelector('.main__container');
  const body = document.querySelector('.body');
  const inputSearch = document.querySelector('.header__input');
  const theadId = document.querySelector('.thead__th[data-title="id"]');
  let timerId = null;
  let doingResearch = false;
  let currentClientId = null;

  buttonAddClient.addEventListener('click', () => {
    mainContainer.insertAdjacentHTML('beforeend', templateBackgroundLayer);
    mainContainer.insertAdjacentHTML('beforeend', templateModalAddContact);

    let buttonAddContact = document.querySelector('.btn-add-contact')
    let buttonCloseModal = document.querySelector('.close-modal');
    let buttonCancelCreation = document.querySelector('.cancel-creation');
    let containerModal = document.querySelector('.container-modal');

    buttonCloseModal.addEventListener('click', closeWindowModal);
    buttonCancelCreation.addEventListener('click', closeWindowModal);
    containerModal.addEventListener('click', closeWindowModal);
    containerModal.addEventListener('click', closeSelect);

    const inputName = document.querySelector('.form__input[data-type="name"]');
    const inputSurname = document.querySelector('.form__input[data-type="surname"]');
    inputName.addEventListener('input', removeInputErrorHighlighting);
    inputSurname.addEventListener('input', removeInputErrorHighlighting);

    checkForEmptinessInput();

    document.querySelector('.modal__form').addEventListener('submit', async (ev) => {

      ev.preventDefault();
      if (checkingValidityForm()) {
        const inputName = document.querySelector('.form__input[data-type="name"]');
        const inputSurname = document.querySelector('.form__input[data-type="surname"]');
        const inputLastName = document.querySelector('.form__input[data-type="lastName"]');
        let inputContactsArray = [];
        if (document.querySelector('.container-contact__input')) {
          const inputContactElements = document.querySelectorAll('.container-contact__input');
          inputContactElements.forEach(input => {
            inputContactsArray.push({ type: input.getAttribute('data-type'), value: input.value });
          });
        }
        const response = await createClient(inputName.value, inputSurname.value, inputLastName.value, inputContactsArray);
        checkingErrorRequest(response)
        outputDataToTable(true);
        automaticallyСloseWindowModal();
      }
    });
    buttonAddContact.addEventListener('click', addInputContact);
  });

  function checkingValidityForm() {
    const inputName = document.querySelector('.form__input[data-type="name"]');
    const inputSurname = document.querySelector('.form__input[data-type="surname"]');
    const inputContactElements = document.querySelectorAll('.container-contact__input');
    let errors = [];

    if (inputName.value.trim() == '') {
      inputName.classList.add('input-error');
      errors.push('Необходимо заполнить поле с именем клиента');
    }
    if (inputSurname.value.trim() == '') {
      inputSurname.classList.add('input-error');
      errors.push('Необходимо заполнить поле с фамилией клиента');
    }
    if (inputContactElements.length > 0) {
      inputContactElements.forEach(input => {
        if (input.value.trim() == '') {
          input.classList.add('input-error');
          let contactTitle = null;

          switch (input.getAttribute('data-type')) {
            case 'phone':
              contactTitle = 'Телефон';
              break;
            case 'vk':
              contactTitle = 'Vk';
              break;
            case 'facebook':
              contactTitle = 'Facebook';
              break;
            case 'mail':
              contactTitle = 'Почта';
              break;
            case 'additional-contact':
              contactTitle = 'Доп.контакт';
              break;
          }
          errors.push(`Поле "${contactTitle}" не должно быть пустым`);
        }
      });
    }
    if (errors.length !== 0) {
      let wrapperAddingContacts = document.querySelector('.wrapper-adding-contacts');
      removeMessageError();
      errors.forEach(error => {
        let template = `<span class="error-message">${error}</span>`;
        wrapperAddingContacts.insertAdjacentHTML('afterend', template);
      })
      return false;
    } else {
      removeMessageError();
    }
    return true;
  };

  function closeSelect(ev) {
    if (document.querySelector('.list-active') && ev.target !== document.querySelector('.list-active')) {
      document.querySelector('.list-active').classList.remove('list-active');
    } else if (document.querySelector('.list-active') && document.querySelectorAll('.list-active').length > 1) {
      selectArr = document.querySelectorAll('.list-active');
      selectArr.forEach(select => {
        if (select !== ev.target) {
          select.classList.remove('list-active');
        }
      })
    }
  }

  function removeMessageError() {
    let pastMistakes = document.querySelectorAll('.error-message');
    if (pastMistakes) {
      pastMistakes.forEach(pastMistake => {
        pastMistake.remove();
      })
    }
  }

  function removeInputErrorHighlighting(ev) {
    if (ev.target.classList.contains('input-error')) {
      ev.target.classList.remove('input-error');
    }
  }

  function addInputContact(ev, contacts) {
    if (contacts == undefined) {
      ev.preventDefault();
      buildInputContact(ev);
      let inputArr = document.querySelectorAll('.container-contact__input');
      inputArr[inputArr.length - 1].addEventListener('input', removeInputErrorHighlighting);
      countInputContact();
    } else {
      contacts.forEach((contact) => {
        buildInputContact(ev, contact);
        let inputArr = document.querySelectorAll('.container-contact__input');
        inputArr[inputArr.length - 1].addEventListener('input', removeInputErrorHighlighting);
        countInputContact();
      })
    }
  }

  function countInputContact() {
    let inputContactElements = document.querySelectorAll('.container-contact__input');
    if (inputContactElements.length >= 20) {
      document.querySelector('.btn-add-contact').classList.add('display-none');
    } else if (inputContactElements.length < 20 && document.querySelector('.btn-add-contact').classList.contains('display-none')) {
      document.querySelector('.btn-add-contact').classList.remove('display-none');
    }
  }

  function buildInputContact(ev, contact) {
    if (contact == undefined) {
      ev.target.insertAdjacentHTML('beforebegin', templateSelect);
    } else {
      document.querySelector('.btn-add-contact').insertAdjacentHTML('beforebegin', templateSelect);
    }

    let wrapperSelectNodeList = document.querySelectorAll('.wrapper-select');
    let wrapperSelectNew = wrapperSelectNodeList[wrapperSelectNodeList.length - 1];

    if (contact !== undefined) {
      if (contact.type == 'phone') {
        wrapperSelectNew.parentElement.children[1].setAttribute('type', 'number');
      } else {
        wrapperSelectNew.parentElement.children[1].setAttribute('type', 'text');
      }

      wrapperSelectNew.parentElement.children[1].value = contact.value;
      wrapperSelectNew.parentElement.children[1].setAttribute('data-type', contact.type);

      for (let i = 0; wrapperSelectNew.children[1].childElementCount > i; i++) {
        if (wrapperSelectNew.children[1].children[i].getAttribute('data-type') == contact.type && !wrapperSelectNew.children[1].children[i].classList.contains('active')) {
          wrapperSelectNew.children[1].children[i].classList.add('active');
          wrapperSelectNew.children[0].textContent = wrapperSelectNew.children[1].children[i].textContent;
        } else if (wrapperSelectNew.children[1].children[i].getAttribute('data-type') !== contact.type && wrapperSelectNew.children[1].children[i].classList.contains('active')) {
          wrapperSelectNew.children[1].children[i].classList.remove('active');
        } else if (wrapperSelectNew.children[1].children[i].getAttribute('data-type') == contact.type && wrapperSelectNew.children[1].children[i].classList.contains('active')) {
          wrapperSelectNew.children[0].textContent = wrapperSelectNew.children[1].children[i].textContent;
        }
      }
    }
    wrapperSelectNew.addEventListener('click', function (ev) {

      if (ev.target.classList.contains('wrapper-select__selected-contact')) {
        ev.target.classList.toggle('list-active');
      } else if (ev.target.classList.contains('select-list__item')) {
        for (let i = 0; ev.target.parentElement.childElementCount > i; i++) {
          ev.target.parentElement.children[i].classList.remove('active');
        }
        ev.target.classList.add('active');
        this.children[0].textContent = ev.target.textContent;
        this.children[0].classList.remove('list-active');

        let dataAttribute = ev.target.getAttribute('data-type');
        this.parentElement.children[1].setAttribute('data-type', dataAttribute);

        if (dataAttribute == 'phone') {
          this.parentElement.children[1].setAttribute('type', 'number');
        } else {
          this.parentElement.children[1].setAttribute('type', 'text');
        }
      }
    });
    wrapperSelectNew.parentElement.children[2].addEventListener('click', function () {
      wrapperSelectNew.parentElement.remove();
      countInputContact();
    })
  }

  async function createClient(nameValue, surnameValue, lastNameValue, inputContactsArray) {
    let response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'aplication/json' },
      body: JSON.stringify({
        name: nameValue,
        surname: surnameValue,
        lastName: lastNameValue,
        contacts: inputContactsArray,
      })
    });

    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      let data = await response.json();
      return data;
    }
  }

  function automaticallyСloseWindowModal() {
    const backgroundLayerElement = document.querySelector('.background-layer');
    const ModalAddContactElement = document.querySelector('.container-modal');
    body.classList.remove('overflow-hidden');
    backgroundLayerElement.remove();
    ModalAddContactElement.remove();
  };

  function closeWindowModal(ev) {
    if (ev.target == this || (document.querySelector('.btn-remove-client') && ev.target.classList.contains('btn-remove-client'))) {
      ev.preventDefault();
      automaticallyСloseWindowModal();
    }
  }

  function addTableLoadingIndicator() {
    document.querySelector('.main__container').classList.add('main__container_position-relative');
    let divLoad = `<div class="load-table"></div>`
    table.insertAdjacentHTML('afterend', divLoad);
  }

  function removeTableLoadindocator() {
    document.querySelector('.load-table').remove();
    document.querySelector('.main__container').classList.remove('main__container_position-relative');
  }

  function addloadIndicatorRemove(target) {
    target.classList.add('td-delete-load');
  }

  function removeLoadIndicatorRemove(target) {
    target.classList.remove('td-delete-load');
  }

  function addloadIndicatorEdit(target) {
    target.classList.add('td-edit-load');
  }

  function removeloadIndicatorEdit(target) {
    target.classList.remove('td-edit-load');
  }

  async function getAllClients() {
    let response = await fetch('http://localhost:3000/api/clients');
    addTableLoadingIndicator();

    let responseClone = await response.clone().json();
    const reader = response.body.getReader();

    while (true) {
      const { done } = await reader.read();
      if (done) {
        removeTableLoadindocator();
        break;
      }
    }
    if (response.ok) {
      let data = responseClone;
      return data;
    } else {
      let data = responseClone;
      return data;
    }
  }

  async function getClient(id) {
    let response = await fetch(`http://localhost:3000/api/clients/${id}`);
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      let data = await response.json();
      return data;
    }
  }

  async function removeClient(target, id) {
    let response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'aplication/json' }
    });
    addloadIndicatorRemove(target);

    const reader = response.body.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) {
        removeLoadIndicatorRemove(target);
        break;
      }
    }
  }

  let buttonEditElem = null;

  async function editClientData(ev) {

    currentClientId = ev.target.parentElement.cells[0].textContent;

    let data = await getClient(currentClientId);
    let name = data.name == undefined ? '' : data.name;
    let surname = data.surname == undefined ? '' : data.surname;
    let lastName = data.lastName == undefined ? '' : data.lastName;
    let contacts = data.contacts == undefined ? '' : data.contacts;
    buttonEditElem = ev.target;

    const modalTemplateEdit = `<div class="container-modal">
      <div class="wrapper-modal modal">
        <div class="flex-container">
          <h2 class="modal__title title-edit-data">Изменить данные</h2>
          <span class="modal__span-id">ID:${currentClientId}</span>
          <button class="close-modal"></button>
        </div>
      
        <form class="modal__form form">
          <div class="form__wrapper-input">
            <input id="surname" class="form__input" type="text" data-type="surname" value="${surname}">
            <label for="surname" class="form__label">Фамилия</label>
          </div>
          <div class="form__wrapper-input">
            <input id="name" class="form__input" type="text" data-type="name" value="${name}">
            <label for="name" class="form__label">Имя</label>
          </div>
          <div class="form__wrapper-input">
            <input id="lastName" class="form__input" type="text" data-type="lastName" value="${lastName}">
            <label for="lastName" class="form__label">Отчество</label>
          </div>
          <div class="wrapper-adding-contacts"><button class="btn-add-contact">Добавить контакт</button></div>
          <button class="btn-save-client" type="submit">Сохранить</button>
          <button class="form__btn-remove-client">Удалить клиента</button>
        </form>
      </div>
    </div>`;

    mainContainer.insertAdjacentHTML('beforeend', templateBackgroundLayer);
    mainContainer.insertAdjacentHTML('beforeend', modalTemplateEdit);

    let buttonAddContact = document.querySelector('.btn-add-contact')
    let buttonCloseModal = document.querySelector('.close-modal');
    let buttonDeleteClient = document.querySelector('.form__btn-remove-client');
    let containerModal = document.querySelector('.container-modal');

    buttonCloseModal.addEventListener('click', closeWindowModal);
    containerModal.addEventListener('click', closeWindowModal);
    buttonAddContact.addEventListener('click', addInputContact);
    containerModal.addEventListener('click', closeSelect);

    checkForEmptinessInput();
    checkingErrorRequest(data);

    if (contacts.length !== 0) {
      addInputContact(ev, contacts);
    }

    const inputName = document.querySelector('.form__input[data-type="name"]');
    const inputSurname = document.querySelector('.form__input[data-type="surname"]');
    inputName.addEventListener('input', removeInputErrorHighlighting);
    inputSurname.addEventListener('input', removeInputErrorHighlighting);

    buttonDeleteClient.addEventListener('click', () => {
      automaticallyСloseWindowModal();
      confirmDeletion(ev);
    })

    document.querySelector('.modal__form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (checkingValidityForm()) {
        let inputName = document.querySelector('.form__input[data-type="name"]');
        let inputSurname = document.querySelector('.form__input[data-type="surname"]');
        let inputLastName = document.querySelector('.form__input[data-type="lastName"]');
        let inputContactsArray = [];
        if (document.querySelector('.container-contact__input')) {
          let inputContactElements = document.querySelectorAll('.container-contact__input');
          inputContactElements.forEach(input => {
            inputContactsArray.push({ type: input.getAttribute('data-type'), value: input.value });
          });
        }

        let data = await editClient(inputName.value, inputSurname.value, inputLastName.value, inputContactsArray, buttonEditElem);
        checkingErrorRequest(data);
        bodyTable.innerHTML = '';
        outputDataToTable();
        automaticallyСloseWindowModal();
      }
    })
  }

  function checkingErrorRequest(data) {
    let errorReceived = ('message' in data);
    if (errorReceived) {
      checkElementWithError(data.message)
    } else if (!Array.isArray(data) && Object(data) !== data) {
      let message = "Что-то пошло не так...";
      checkElementWithError(message);
    }
  }

  function checkElementWithError(message) {
    let errorElem = `<span class='error-message'>${message}</span>`;
    if (!document.querySelector('.error-message') && document.querySelector('.modal')) {
      document.querySelector('.btn-save-client').insertAdjacentHTML('beforebegin', errorElem);
    } else if (document.querySelector('.error-message')) {
      document.querySelector('.error-message').innerText = message;
    } else {
      document.querySelector('.table').insertAdjacentHTML('afterend', errorElem);
    }
  }

  function checkForEmptinessInput(ev) {
    if (ev == undefined) {
      let formInput = document.querySelectorAll('.form__input');
      formInput = Array.from(formInput);
      formInput.forEach(input => {
        if (input.value !== '') {
          input.classList.add('non-empty');
        } else {
          input.classList.remove('non-empty');
        }
        input.addEventListener('input', checkForEmptinessInput);
      });
    } else {
      if (ev.target.value !== '') {
        ev.target.classList.add('non-empty');
      } else {
        ev.target.classList.remove('non-empty');
      }
    }
  }

  async function editClient(nameValue, surnameValue, lastNameValue, inputContactsArray, buttonEditElem) {
    let response = await fetch(`http://localhost:3000/api/clients/${currentClientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'aplication/json' },
      body: JSON.stringify({
        name: nameValue,
        surname: surnameValue,
        lastName: lastNameValue,
        contacts: inputContactsArray,
      })
    });
    addloadIndicatorEdit(buttonEditElem);

    let responseClone = await response.clone().json();
    const reader = response.body.getReader();

    while (true) {
      const { done } = await reader.read();
      if (done) {
        removeloadIndicatorEdit(buttonEditElem);
        break;
      }
    }

    if (response.ok) {
      let data = responseClone;
      return data;
    } else {
      let data = responseClone;
      return data;
    }
  }

  async function outputDataToTable(flag) {

    const addingNewClient = flag;
    const data = await getAllClients();
    checkingErrorRequest(data);

    if (addingNewClient) {
      const newClient = data[data.length - 1];
      buildingTable(newClient);

      const tdDelete = document.querySelectorAll('.td-delete');
      tdDelete[tdDelete.length - 1].addEventListener('click', confirmDeletion);

      let tdContacts = document.querySelectorAll('.tbody__td[data-type="contacts"]');
      tdContacts = tdContacts[tdContacts.length - 1];

      const tdEdit = document.querySelectorAll('.td-edit');

      tdEdit[tdEdit.length - 1].addEventListener('click', editClientData);

      if (tdContacts.childElementCount > 5) {
        let countHiddenElements = 0;
        for (let i = 4; tdContacts.childElementCount > i; i++) {
          tdContacts.children[i].classList.add('display-none');
          countHiddenElements++;
        }
        const spanTemplate = `<span class="span-contact-more" data-type="more" data-count="${countHiddenElements}"><span class="tooltip">Показать больше контактов</span></span>`;
        tdContacts.insertAdjacentHTML('beforeend', spanTemplate);

        const spanContactMore = document.querySelectorAll('.span-contact-more');
        spanContactMore[spanContactMore.length - 1].addEventListener('click', (ev) => {
          let td = ev.target.parentElement;
          ev.target.remove();
          for (let i = 4; td.childElementCount > i; i++) {
            td.children[i].classList.remove('display-none');
          }
        })
      }
    } else {
      data.forEach((client) => {
        buildingTable(client);
      })
      const tdDelete = document.querySelectorAll('.td-delete');
      tdDelete.forEach((item) => {
        item.addEventListener('click', confirmDeletion);
      });

      const tdEdit = document.querySelectorAll('.td-edit');
      tdEdit.forEach(item => {
        item.addEventListener('click', editClientData);
      })

      const tdContacts = document.querySelectorAll('.tbody__td[data-type="contacts"]');
      tdContacts.forEach(td => {
        if (td.childElementCount > 5) {
          let countHiddenElements = 0;
          for (let i = 4; td.childElementCount > i; i++) {
            td.children[i].classList.add('display-none');
            countHiddenElements++;
          }
          const spanTemplate = `<span class="span-contact-more" data-type="more" data-count="${countHiddenElements}"><span class="tooltip">Показать больше контактов</span></span>`;
          td.insertAdjacentHTML('beforeend', spanTemplate);

          const spanContactMore = document.querySelectorAll('.span-contact-more');
          spanContactMore[spanContactMore.length - 1].addEventListener('click', (ev) => {
            let td = ev.target.parentElement;
            ev.target.remove();
            for (let i = 4; td.childElementCount > i; i++) {
              td.children[i].classList.remove('display-none');
            }
          })
        }
      })
    }
  };

  function confirmDeletion(ev) {
    mainContainer.insertAdjacentHTML('beforeend', templateBackgroundLayer);
    mainContainer.insertAdjacentHTML('beforeend', templateConfirmDeletion);

    const buttonCloseModal = document.querySelector('.close-modal');
    const buttonCancelDeletion = document.querySelector('.form__btn-cancel');
    const containerModal = document.querySelector('.container-modal');
    const buttonRemoveClient = document.querySelector('.btn-remove-client');

    buttonCloseModal.addEventListener('click', closeWindowModal);
    buttonCancelDeletion.addEventListener('click', closeWindowModal);
    containerModal.addEventListener('click', closeWindowModal);
    buttonRemoveClient.addEventListener('click', (e) => {
      return removeClientFromTable(ev, e)
    })
  }

  function removeClientFromTable(ev, e) {
    for (let i = 0; ev.target.parentNode.cells.length > i; i++) {
      if (ev.target.parentNode.cells[i].getAttribute('data-type') == 'id') {
        removeClient(ev.target, ev.target.parentNode.cells[i].innerText);
        ev.target.parentNode.remove();
        break;
      }
    }
    closeWindowModal(ev, e);
  }

  function buildingTable(client) {
    let id = client.id;
    let fullName = `${client.surname} ${client.name} ${client.lastName}`;
    let date = new Date(client.createdAt);
    let dateCreation = convertDateToString(date);
    let timeCreation = convertTimeToString(date);
    date = new Date(client.updatedAt);
    let dateEdit = convertDateToString(date);
    let timeEdit = convertTimeToString(date);
    let contacts = '';
    let contactTitle = null;
    let contactsArray = client.contacts;
    let href = null;
    contactsArray.forEach((contact) => {
      switch (contact.type) {
        case 'phone':
          contactTitle = 'Телефон: ';
          href = `tel:+${contact.value}`;
          break;
        case 'vk':
          contactTitle = 'Vk: ';
          href = `${contact.value}`;
          break;
        case 'facebook':
          contactTitle = 'Facebook: ';
          href = `${contact.value}`;
          break;
        case 'mail':
          contactTitle = 'Почта: ';
          href = `mailto:${contact.value}`;
          break;
        case 'additional-contact':
          contactTitle = 'Доп.контакт: ';
          break;
      }
      contacts += `<span class="span-contact" data-type="${contact.type}" data-info="${contact.value}"><span class="tooltip">${contactTitle}<a class="tooltip-link" href=${href}>${contact.value}</a></span></span>`;
    });
    const templateTableRow = `<tr class="tbody__tr">
      <td class="tbody__td" data-type="id">${id}</td>
      <td class="tbody__td" data-type="fullName">${fullName}</td>
      <td class="tbody__td">${dateCreation} <span class="span-time">${timeCreation}</span></td>
      <td class="tbody__td">${dateEdit} <span class="span-time">${timeEdit}</span></td>
      <td class="tbody__td" data-type="contacts">${contacts}</td>
      <td class="tbody__td td-edit">Изменить</td>
      <td class="tbody__td td-delete">Удалить</td>
    </tr>`;

    bodyTable.insertAdjacentHTML('beforeend', templateTableRow);

  }

  function convertDateToString(date) {
    return `${('0' + date.getDate()).slice(-2)}.${('0' + date.getMonth()).slice(-2)}.${date.getFullYear()}`;
  }

  function convertTimeToString(date) {
    return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
  }

  inputSearch.addEventListener('input', async () => {

    clearTimeout(timerId);
    timerId = setTimeout(async () => {

      let valueInputSearch = inputSearch.value.trim();
      if (valueInputSearch !== '') {
        doingResearch = true;
        let response = await fetch(`http://localhost:3000/api/clients?search=${valueInputSearch}`);
        let data = await response.json();
        bodyTable.innerHTML = '';
        if (data.length !== 0) {
          data.forEach((client) => {
            buildingTable(client);
          })
          let tdDelete = document.querySelectorAll('.td-delete');
          tdDelete.forEach((item) => {
            item.addEventListener('click', confirmDeletion);
          })
        }
      } else if (valueInputSearch == '' && doingResearch) {
        doingResearch = false;
        bodyTable.innerHTML = '';
        outputDataToTable();
      }
    }, 300);
  })

  Array.from(tHead.rows[0].cells).forEach((th) => {
    th.addEventListener('click', function () {
      let columnForSort = this.getAttribute('data-title');
      let sortType = this.getAttribute('data-sort');
      if (columnForSort !== 'contacts' && columnForSort !== 'actions') {
        sortTable(this, sortType)
      }
    });
  })

  function sortTable(columnForSorting, sortType) {

    let arrBodyTable = Array.from(bodyTable.rows);
    let indexCells = columnForSorting !== undefined ? columnForSorting.cellIndex : theadId.cellIndex;
    sortType = sortType == 'unSorted' || sortType == 'uSort' || sortType == undefined ? 'aSort' : 'uSort';

    setSortingState(indexCells);

    arrBodyTable.sort((a, b) => {
      let value1 = a.cells[indexCells].innerText;
      let value2 = b.cells[indexCells].innerText;
      if (tHead.rows[0].cells[indexCells].getAttribute('data-title') == 'id') {
        if (sortType == 'aSort') {
          return value1 - value2;
        } else if (sortType == 'uSort') {
          return value2 - value1;
        }
      } else if (tHead.rows[0].cells[indexCells].getAttribute('data-title') == 'fullName') {
        if (sortType == 'aSort') {
          return value1 > value2 ? 1 : -1;
        } else if (sortType == 'uSort') {
          return value1 < value2 ? 1 : -1;
        }
      } else if (tHead.rows[0].cells[indexCells].getAttribute('data-title') == 'dateСreation' || tHead.rows[0].cells[indexCells].getAttribute('data-title') == 'dateEdit') {
        value1 = convertToDate(value1);
        value2 = convertToDate(value2);
        if (sortType == 'aSort') {
          return value1 > value2 ? 1 : -1;
        } else if (sortType == 'uSort') {
          return value1 < value2 ? 1 : -1;
        }
      }
    })
    bodyTable.append(...arrBodyTable);
    tHead.rows[0].cells[indexCells].setAttribute('data-sort', sortType);
  }

  function convertToDate(value) {
    const arrValue = value.split(' ');
    const arrDateValue = arrValue[0].split('.');
    const arrTime = arrValue[1].split(':')
    return value = new Date(arrDateValue[2], arrDateValue[1], arrDateValue[0], arrTime[0], arrTime[1]);
  }

  function setSortingState(indexCells) {

    for (let i = 0; tHead.rows[0].cells.length > i; i++) {
      if (i == indexCells) {
        tHead.rows[0].cells[i].setAttribute('data-sortState', 'active');
      } else {
        tHead.rows[0].cells[i].setAttribute('data-sortState', 'inactive');
      }
    }
  }

  async function start() {
    await outputDataToTable();
    sortTable();
  }

  start();

})();