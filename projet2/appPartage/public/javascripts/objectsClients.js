const socket = io();

socket.on('welcome', () => console.log('Connected to server'));
socket.on('upgrade', () =>{
  UpdateObject();
  console.log('upgrade completed')
});


let objectDescription;
let ownerName;
let ownerId;

setTimeout(function () {
  displayBorrowedObjects();
}, 1000);

const updateListSocket = () =>{
  socket.emit('update');
}

const setupObj = () => {
  objectDescription = document.getElementById('item-name');
  objectsList = document.getElementById('available-items-list');

  document.getElementById('add').addEventListener('click', addObject);

  const ownerId = document.getElementById('userID').textContent;

  UpdateObject();


}
window.addEventListener('DOMContentLoaded', setupObj);

const addObject = async () => {
  event.preventDefault();
  //on affect owner ici car avant on ne connait pas encore le nom, la page n'est pas completement chargé
  ownerName = document.getElementById('username');
  ownerId = document.getElementById('userID');

  const objectData = { description: objectDescription.value, owner: ownerId.innerText };
  const body = JSON.stringify(objectData);

  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: body
  };
  const response = await fetch(`/obj/add`, requestOptions);

  if (response.ok) {
    const object = await response.json();
    objectDescription.textContent = object.description || '';
    UpdateObject();
  }
  else {
    const error = await response.json();
    handleErrorObj(error);
  }
  UpdateObject();
};

const borrowObject = async (idObject) => {
  const ownerId = document.getElementById('userID');
  const objectData = { idObj: idObject, borrowedBy: ownerId.innerText };
  const body = JSON.stringify(objectData);

  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: body
  };

  const sendBorrowedBy = await fetch(`/obj/update`, requestOptions);
  if (sendBorrowedBy.ok) {

  } else {
    const error = await sendBorrowedBy.json();
    handleErrorObj(error);
  }
  UpdateObject();
};

const returnObject = async (idObject) => {
  ownerId = document.getElementById('userID');


  const objectData = { idObj: idObject, borrowedBy: ownerId.innerHTML };
  const body = JSON.stringify(objectData);
  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: body
  };

  const sendBorrowedBy = await fetch(`/obj/return`, requestOptions);
  if (sendBorrowedBy.ok) {

  } else {
    const error = await sendBorrowedBy.json();
    handleErrorObj(error);
  }
};

const deleteObject = async (idObject) => {
  const objectData = { id: idObject };
  const body = JSON.stringify(objectData);

  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: body
  };
  const response = await fetch(`/obj/del`, requestOptions);

  if (response.ok) {
    const object = await response.json();
  }
  else {
    const error = await response.json();
    handleErrorObj(error);
  }


  if (response.ok) {
    UpdateObject(); // mise à jour de la liste des objets
  } else {
    const error = await response.json();
    handleErrorObj(error);
  }
  UpdateObject();
};

const displayBorrowedObjects = async () => {

  const ownerId = document.getElementById('userID').textContent;

  const borrowedObjectsList = document.getElementById('borrowed-items-list');


  const requestOptions = {
    method: 'GET',
  };

  const response = await fetch('/obj/list', requestOptions);

  if (response.ok) {
    const objects = await response.json();
    let itemsHtml = '<table style="border-collapse: collapse">';
    itemsHtml += '<tr><th style="border: 1px solid black">Description</th><th style="border: 1px solid black">Action</th></tr>';

    for (const obj of objects.borrowBy) {
      if (obj.borrowedBy && obj.borrowedBy._id === ownerId) {

        const idObject = obj._id;
        itemsHtml += (`<tr>
                          <td width="100" height="50" style="border: 1px solid black">${obj.description}</td>

                          <td width="100" height="50" style="border: 1px solid black"> 
                            <button class="return-button" data-id="${idObject}">Rendre</button> 
                          </td>
                        </tr>`);
      }
    }

    itemsHtml += '</table>';
    borrowedObjectsList.innerHTML = itemsHtml;

    // écouteur d'événements bouton Rendre
    const returnButtons = document.getElementsByClassName('return-button');
    for (let i = 0; i < returnButtons.length; i++) {
      const idObject = returnButtons[i].getAttribute('data-id');
      returnButtons[i].addEventListener('click', () => { returnObject(idObject); displayBorrowedObjects(); updateListSocket() });
    }
  } else {
    const error = await response.json();
    handleError(error);
  }
};

const UpdateObject2 = async () => {
  const ownerId = document.getElementById('userID');
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/obj/list', requestOptions);
  let itemsHtml = '<table style="border-collapse: collapse">';
  if (response.ok) {
    const objects = await response.json();

    itemsHtml += '<tr><th class="col col-1">Description</th><th class="col col-2">Créateur</th><th class="col col-3">Loueur</th><th class="col col-4">Action</th></tr>';

    for (const obj of objects.description) {
      const idObject = obj._id;
      let borrowedBy = '/';

      if (obj.borrowedBy != ownerId.innerText) {
        for (let article of objects.borrowBy) {
          if (article._id === idObject && article.borrowedBy !== null) {
            borrowedBy = article.borrowedBy.name;
            break;
          }
        }

        // Vérifier si l'utilisateur connecté est le créateur de l'objet
        if (obj.owner._id === ownerId.innerText) {
          // Afficher le bouton Supprimer uniquement pour le créateur de l'objet
          itemsHtml += (`<tr>
                            <td width="100" height="50" style="border: 1px solid black">${obj.description}</td>
                            <td width="100" height="50" style="border: 1px solid black">${obj.owner.name}</td>
                            <td width="100" height="50" style="border: 1px solid black">${borrowedBy}</td>
                            <td style="border: 1px solid black"> 
                            <button class="delete-button" data-id="${idObject}" >Supprimer</button> 
                            <button class="borrow-button" data-id="${idObject}" >Emprunter</button> 
                            </td>
                        </tr>`);
        } else {
          // Ne pas afficher le bouton Supprimer pour les autres utilisateurs
          itemsHtml += (`<tr>
                            <td width="100" height="50" style="border: 1px solid black">${obj.description}</td>
                            <td width="100" height="50" style="border: 1px solid black">${obj.owner.name}</td>
                            <td width="100" height="50" style="border: 1px solid black">${borrowedBy}</td>
                            <td style="border: 1px solid black"> 
                            <button class="borrow-button" data-id="${idObject}" >Emprunter</button> 
                            </td>
                        </tr>`);
        }
      }
    }

    itemsHtml += '</table>';
    objectsList.innerHTML = itemsHtml;

    // écouteur d'événements bouton Supprimer
    const deleteButtons = document.getElementsByClassName('delete-button');
    for (let i = 0; i < deleteButtons.length; i++) {
      const idObject = deleteButtons[i].getAttribute('data-id');
      deleteButtons[i].addEventListener('click', () => { deleteObject(idObject) });
    }

    // écouteur d'événements bouton Emprunter
    const borrowButtons = document.getElementsByClassName('borrow-button');
    for (let i = 0; i < borrowButtons.length; i++) {
      const idObject = borrowButtons[i].getAttribute('data-id');
      borrowButtons[i].addEventListener('click', () => { borrowObject(idObject);  displayBorrowedObjects(); UpdateObject() });
    }

  } else {
    const error = await response.json();
    handleError(error);
  }
}

const UpdateObject = async () => {
  const ownerId = document.getElementById('userID');
  const requestOptions = {
    method: 'GET',
  };
  const response = await fetch('/obj/list', requestOptions);
  let itemsHtml = '<table style="border-collapse: collapse">';
  if (response.ok) {
    const objects = await response.json();

    itemsHtml += '<tr><th class="col col-1">Description</th><th class="col col-2">Créateur</th><th class="col col-3">Loueur</th><th class="col col-4">Action</th></tr>';

    for (const obj of objects.description) {
      const idObject = obj._id;
      let borrowedBy = '/';

      if (obj.borrowedBy != ownerId.innerText) {
        for (let article of objects.borrowBy) {
          if (article._id === idObject && article.borrowedBy !== null) {
            borrowedBy = article.borrowedBy.name;
            break;
          }
        }

        let emprunterButtonHtml = '';
        let supprimerButtonHtml = '';

        if (borrowedBy.includes('/')) {
          emprunterButtonHtml = `<button class="borrow-button" data-id="${idObject}" >Emprunter</button>`;
          if (obj.owner._id === ownerId.innerText) {
            supprimerButtonHtml = `<button class="delete-button" data-id="${idObject}" >Supprimer</button>`;
          }
        }

        itemsHtml += (`<tr>
                        <td width="100" height="50" style="border: 1px solid black">${obj.description}</td>
                        <td width="100" height="50" style="border: 1px solid black">${obj.owner.name}</td>
                        <td width="100" height="50" style="border: 1px solid black">${borrowedBy}</td>
                        <td style="border: 1px solid black"> 
                          ${supprimerButtonHtml}
                          ${emprunterButtonHtml}
                        </td>
                      </tr>`);
      }
    }

    itemsHtml += '</table>';
    objectsList.innerHTML = itemsHtml;

    // écouteur d'événements bouton Supprimer
    const deleteButtons = document.getElementsByClassName('delete-button');
    for (let i = 0; i < deleteButtons.length; i++) {
      const idObject = deleteButtons[i].getAttribute('data-id');
      deleteButtons[i].addEventListener('click', () => { deleteObject(idObject); updateListSocke() });
    }

    // écouteur d'événements bouton Emprunter
    const borrowButtons = document.getElementsByClassName('borrow-button');
    for (let i = 0; i < borrowButtons.length; i++) {
      const idObject = borrowButtons[i].getAttribute('data-id');
      borrowButtons[i].addEventListener('click', () => { borrowObject(idObject);  displayBorrowedObjects(); updateListSocket() });
    }

  } else {
    const error = await response.json();
    handleError(error);
  }
}