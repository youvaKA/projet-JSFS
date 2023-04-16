
const socket = io();

socket.on('welcome', () => console.log('Connected to server'));

//socket.on('nomDuJoueur1', () => displayMessage('connection with server done') );

//interdi l'accés aux joueurs < 3
socket.on('gameFull', () => {

  //Masque des elements 
  document.getElementById("nom").remove();
  document.getElementById("okOnline").remove();
  document.getElementById("okBot").remove();
  
  //affiche un message 
  document.getElementById("msg").className = "options message";
  document.getElementById("messageContent").innerHTML = "Message "
  document.getElementById("messageContent2").innerHTML = " 2 Joueurs sont déja connectés ! <br> Re-essayez plus tard <br>"
  document.getElementById("messageContent3").innerHTML = " Vous allez être redirigez dans 5 secondes <br>"

  let myInterval;
  let timer = 5;

  //Deconnect le client aprés 5 secondes
  myInterval = setInterval(() => {
      timer -= 1 
      if (timer == 0) {
          clearInterval(myInterval);}
      document.location.replace('/')
      }, 3000);



});

//Affiche le nom du jour 2 chez le joueur 1
socket.on('AffichenomDuJoueur1', function (data) {
  console.log("nom joueur 2 reçu", data);
  document.getElementById("nomJoueur2").innerHTML = data;
});

//Affiche le nom du joueur 1 chez le joueur 2
socket.on('nomJoueur1', function (data) {
  console.log("nom joueur 1 reçu", data);
  document.getElementById("nomJoueur1").innerHTML = data;
});

//Desactive les buttons du joueur 1
function disableButtonJ1() {

  console.log("disableButtonJ1 FONCTIONNE");
  document.getElementById("j1Pierre").disabled = true;
  document.getElementById("j1Pierre").className = "btn-hover color-0";

  document.getElementById("j1Feuille").disabled = true;
  document.getElementById("j1Feuille").className = "btn-hover color-0";

  document.getElementById("j1Ciseaux").disabled = true;
  document.getElementById("j1Ciseaux").className = "btn-hover color-0";

}

//Desactive les buttons du joueur 2
function disableButtonJ2() {

  console.log("disableButtonJ2 FONCTIONNE");
  document.getElementById("j2Pierre").disabled = true;
  document.getElementById("j2Pierre").className = "btn-hover color-0";

  document.getElementById("j2Feuille").disabled = true;
  document.getElementById("j2Feuille").className = "btn-hover color-0";

  document.getElementById("j2Ciseaux").disabled = true;
  document.getElementById("j2Ciseaux").className = "btn-hover color-0";

}

//active les buttons du joueur 1
function enableButtonJ1() {

  document.getElementById("j1Pierre").disabled = false;
  document.getElementById("j1Pierre").className = "btn-hover color-1";

  document.getElementById("j1Feuille").disabled = false;
  document.getElementById("j1Feuille").className = "btn-hover color-2";

  document.getElementById("j1Ciseaux").disabled = false;
  document.getElementById("j1Ciseaux").className = "btn-hover color-3";

}

//active les buttons du joueur 2
function enableButtonJ2() {

  document.getElementById("j2Pierre").disabled = false;
  document.getElementById("j2Pierre").className = "btn-hover color-1";

  document.getElementById("j2Feuille").disabled = false;
  document.getElementById("j2Feuille").className = "btn-hover color-2";

  document.getElementById("j2Ciseaux").disabled = false;
  document.getElementById("j2Ciseaux").className = "btn-hover color-3";

}


function hibeButtonJ1(){
  document.getElementById("j1Pierre").remove();
  document.getElementById("j1Feuille").remove();
  document.getElementById("j1Ciseaux").remove();
}

function hibeButtonJ2(){
  document.getElementById("j2Pierre").remove();
  document.getElementById("j2Feuille").remove();
  document.getElementById("j2Ciseaux").remove();
}

// lorsque je recois l'ordre du serveur j'active les buttons du joeur 1
socket.on('ActiverButtonJ1'  , () => {
  enableButtonJ1();
  hibeButtonJ2();

});
 // la meme chose pour le joueur2
socket.on('ActiverButtonJ2' , () => {
  console.log("Jactive les button de J2")
  enableButtonJ2();
  hibeButtonJ1();

});



//Le serveur nous envoie confimation qu'il à bien reçus le nom du joeurs.
// il nous envoie aussi sa position 1er ou 2em connecté 
socket.on('nomDuJoueur', function (nom, position) {

  console.log("position : ", position);

  if (position == 0) {
    document.getElementById("nomJoueur1").innerHTML = nom;

    document.getElementById("nom").remove();
    document.getElementById("okOnline").remove();
    document.getElementById("okBot").remove();

  } else {
    document.getElementById("nomJoueur2").innerHTML = nom;


    //enableButtonJ2();

    document.getElementById("nom").remove();
    document.getElementById("okOnline").remove();
    document.getElementById("okBot").remove();

  }
});


socket.on('j2Win', function (data) {
  // Met à jour l'élément HTML avec le score du joeur, reçus par le server
  document.getElementById("scoreJ2").innerHTML = data

});

socket.on('j1Win', function (data) {
  // Met à jour l'élément HTML avec le score du joeur, reçus par le server
  document.getElementById("scoreJ1").innerHTML = data

});


socket.on('noWinner', function (data) {
  // Met à jour l'élément HTML avec le score du joeur, reçus par le server
  //document.getElementById("scoreJ1").innerHTML = data

});

function choixJoueur1(button) {
  document.getElementById(button).addEventListener("click", function () {
    socket.emit('choixJoueur', button)
    disableButtonJ1();
  });

}

function choixJoueur2(button) {
  document.getElementById(button).addEventListener("click", function () {
    socket.emit('choixJoueur', button)
    disableButtonJ2();
});
}

// A utiliser plus tard
function choixJoueurs(choixJ1, choixJ2) {
  document.getElementById(choixJ1).addEventListener("click", function () {
    socket.emit('choixJoueur', choixJ1)
    disableButtonJ1();
  });

  document.getElementById(choixJ2).addEventListener("click", function () {
    socket.emit('choixJoueur', choixJ2)
    disableButtonJ2();
  });


}

/*   socket.on('choixRecus', () => {

    console.log('choix biens Recus');


  }); */


socket.on('NextRoundj1', () => {
  enableButtonJ1();

});

/* socket.on('NextRound', () => {
  enableButtonJ1();
  enableButtonJ2();

}); */

socket.on('NextRoundj2', () => {
  enableButtonJ2();

});

socket.on('OkOnline?', () => {

  document.getElementById("okOnline").addEventListener("click", function () {

    socket.emit("sendNameBotGame");
    var nom = document.getElementById("nom").value;
    socket.emit('sendNameForOnlineGame', nom);

    choixJoueur1("j1Pierre");
    choixJoueur1("j1Feuille");
    choixJoueur1("j1Ciseaux");

    choixJoueur2("j2Pierre");
    choixJoueur2("j2Feuille");
    choixJoueur2("j2Ciseaux");


  });

  socket.on("FinGame", (Winner) =>{

    document.getElementById("msg").className = "options message";
    document.getElementById("messageContent").innerHTML = "Message "
    document.getElementById("messageContent2").innerHTML = " Match terminé; " + Winner + " à gagné" 
    document.getElementById("messageContent3").innerHTML = " Vous allez être redirigez dans 5 secondes <br>"

    let myInterval;
    let timer = 5;
  
    //Deconnect le client aprés 5 secondes
    myInterval = setInterval(() => {
        timer -= 1 
        if (timer == 0) {
            clearInterval(myInterval);}
        document.location.replace('/')
        }, 3000);
  
  });

  document.getElementById("okBot").addEventListener("click", function () {

    socket.emit("BotGame");
    var nom = document.getElementById("nom").value;
    socket.emit('BotGame', nom);

    choixJoueur("j1Pierre");
    choixJoueur("j1Feuille");
    choixJoueur("j1Ciseaux");


  });


});
