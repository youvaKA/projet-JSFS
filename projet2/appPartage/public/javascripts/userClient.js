let username;
let userID;

const setup = () => {
  username = document.getElementById('username');
  userID = document.getElementById('userID');
  getUser();
 
}
window.addEventListener('DOMContentLoaded', setup);

const getUser = async () => {
  const requestOptions = {
                           method :'GET',
                         };
  const response = await fetch('/user/me', requestOptions);
  if (response.ok) {
    const user = await response.json();
    username.textContent = user.name || '';
    userID.textContent = user.id || '';
  }
  else {
    const error = await response.json();
    handleError(error);
  }
}

const logout = async () => {
  const requestOptions = {
                         method :'GET',
                       };
  const response = await fetch(`/access/logout`, requestOptions);
  if (response.ok) {
    window.location.href= '/';
  }
}

const handleError = error => {
  if (error.redirectTo)
    window.location.href= error.redirectTo;
  else
    console.log(`erreur : ${error.message}`);
}
