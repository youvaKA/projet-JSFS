export default class ioController {
    #io;
    #clients;
    #nbRound = 4;
    #BotGame = false;

    constructor(io) {
        this.#io = io;
        this.#clients = new Map();

    }


    findPositionByName(clients, name) {
        for (const [key, value] of clients) {
            if (value.nom === name) {
                return Array.from(clients.keys()).indexOf(key);
            }
        }
        return -1;
    }

    whoWinBotGame(JoeurChoix){

        let player1 = Array.from(this.#clients.values())[0];
        let first = player1.id;

        const posibilites = ["j2Pierre", "j2Feuille", "j2Ciseaux"];
        const BotChoix = Math.floor(Math.random() * posibilites.length);


        if (player1.choix == "j1Pierre" && BotChoix == "j2Pierre" ||
            player1.choix == "j1Feuille" && BotChoix == "j2Feuille" ||
            player1.choix == "j1Ciseaux" && BotChoix == "j2Ciseaux") {
            this.#io.emit('noWinner');
            console.log('----------Match Null----------')
        }

        else if (player1.choix == 'j1Pierre' && plBotChoix == 'j2Ciseaux' ||
            player1.choix == 'j1Ciseaux' && BotChoix == 'j2Feuille'||
            player1.choix == 'j1Feuille' && BotChoix == 'j2Pierre') {

            this.#clients.get(first).points += 1;
            this.#io.emit('j1Win', player1.points);
            console.log('----------', player1.nom, ' a gagné', '---------------')
        }  


    }


    whoWin() {

        let player1 = Array.from(this.#clients.values())[0];
        let player2 = Array.from(this.#clients.values())[1];

        console.log("nom player 1 ", player1.nom);

        let first = player1.id;
        let second = player2.id;

        console.log('-------------------')
        console.log("choix de ", player1.nom,  ' : ', player1.choix);
        console.log("choix de ", player2.nom,  ' : ', player2.choix);

        if (player1.choix  != null && player2.choix != null){

        
        // cas ou le match est null
        if (player1.choix == "j1Pierre" && player2.choix == "j2Pierre" ||
            player1.choix == "j1Feuille" && player2.choix == "j2Feuille" ||
            player1.choix == "j1Ciseaux" && player2.choix == "j2Ciseaux") {

            this.#io.emit('noWinner');
            console.log('----------Match Null----------')
            player1.choix = null;
            player2.choix = null;
        }

        //cas ou le joeur 1 a gagné
        else if (player1.choix == 'j1Pierre' && player2.choix == 'j2Ciseaux' ||
                 player1.choix == 'j1Ciseaux' && player2.choix == 'j2Feuille'||
                 player1.choix == 'j1Feuille' && player2.choix == 'j2Pierre') {

                this.#clients.get(first).points += 1;
                this.#io.emit('j1Win', player1.points);
                console.log('----------', player1.nom, ' a gagné', '---------------')
                player1.choix = null;
                player2.choix = null;
            }
        //cas ou le joeur 2 a gagné
        else {

                this.#clients.get(second).points += 1;
                this.#io.emit('j2Win', player2.points);
                console.log('----------', player2.nom, ' a gagné', '---------------');
                player1.choix = null;
                player2.choix = null;
       }           

        //cas ou le joeur 2 a gagné
/*         else if (player1.choix != null) {
            console.log('----------', player2.nom, ' a gagné', '---------------')
            //this.#clients.get(second).points += 1;
            this.#io.emit('j2Win', player2.points);
            player1.choix = null

        } */

        console.log("points ", player1.nom, player1.points);
        console.log("points ", player2.nom, player2.points);

        if (this.#nbRound != 0) {

            this.#nbRound -= 1
            console.log("nb round : " , this.#nbRound);
            this.#io.to(first).emit('NextRoundj1');
            this.#io.to(second).emit('NextRoundj2');

        } else {
            console.log("Game End");
            if (player1.points > player2.points) {
                this.#io.emit('FinGame', player1.nom);
                
            } else {
                this.#io.emit('FinGame' , player2.nom);
            
            }
            
        }
        
        
        this.#io.emit('NextRound');   
    }
    }
    
    manageConnection() {
        
        
        //verifie si un client est connécté 
        this.#io.on('connection', socket => {
            
            //Je dit au client que je suis prêt à a recevoir quelle type de partie il veut jouer
            socket.emit('OkOnline?');
            socket.emit('OkBot?');
            
            //lorsque le client arrive sur la page on l'add a la hmap #clients
            this.#clients.set(socket.id, { nom: null, posision: null, choix: null, points: 0, id: socket.id, socket: socket });
            
            //Debeug
            console.log(`nb client co 1 : ${this.#clients.size}`);
            
            // Je verifie si il y à plus de 2 clients sur la page on retire le droits aux autres de rejoindre
            if (this.#clients.size > 2) {
                socket.emit('gameFull');
                socket.disconnect();
                this.#clients.delete(socket.id);
            }
            
            
            
            //Je récupère les id des clients
            const clientKeys = Array.from(this.#clients.keys());
            const first = clientKeys.filter((socketId, index) => index == 0)[0];
            const second = clientKeys.filter((socketId, index) => index == 1)[0];
            
            //Cas ou le client joue avec un BOT 
            socket.on(("BotGame") , (nom)=>{

                    console.log("Etape 1")

                    this.#clients.get(socket.id).nom = nom;
                    
                    const bot = {
                        nom: "Bot",
                        position: 1,
                        choix: null,
                        points: 0,
                        id: "911",
                        socket: null
                    };
                    // Ajouter le bot à la Map
                    this.#clients.set(bot.id, bot);

                    socket.emit('nomDuJoueur', this.#clients.get(socket.id).nom, this.findPositionByName(this.#clients, nom));

                    socket.emit('AffichenomDuJoueur1', bot.nom);
                    socket.emit('ActiverButtonJ1');

                    socket.on('choixJoueur', (choix) => {

                        console.log("choix joueur DEBEUG : ", choix)

                        this.whoWinBotGame(choix);
                        
                    });
                
            });
            
            //Debeug
            
            //Lorsque je recois le nom du joeur
            socket.on('sendNameForOnlineGame', (nom) => {
                
                //je les rajoutes à ma hashMap
                this.#clients.get(socket.id).nom = nom;
                
                //je lui renvoie son nom ainsi que sa posiion, pour s'assurer que le serveur les à bien recus
                socket.emit('nomDuJoueur', this.#clients.get(socket.id).nom, this.findPositionByName(this.#clients, nom));
                
                try {
                    // j'essai d'envoyer au joeur 1 le nom du joeur 2 si biensur il y a un jouer 2 connecté
                    if (this.#clients.get(second).nom != undefined) {
                        //socket.to(first).emit('ActiverButtonJ1');
                        socket.to(first).emit('AffichenomDuJoueur1', this.#clients.get(second).nom);
                    } 
                    

                    /* Ensuite si les 2 joueurs on rentrés leur noms alors j'active leur buttons pour jouer

                        le code n'est pas trés beau a voir il y a peut-etre une maniere de factoriser, mais comme dans mon htlm 
                        je differencie les button du J1 et ceux du J2. Envoier 1 seul "socket.emit()" active tout les button de la page
                        c'est donc la seul façons que j'ai trouvé pour le moment :( */

                    if (this.#clients.get (second).nom && this.#clients.get (first).nom){
                        socket.to(first).emit('ActiverButtonJ1');
                        
                        //console.log("debeug j'affiche la sockert de second : ", second)

                        /* Et là normalement vous allez vous demander "Mais pourquoi est ce qu'il fait un socket.emit('ActiverButtonJ2')"
                         le plus logique serait de faire un socket.to(second).emit('ActiverButtonJ1'); étant donnés que seul 'second' à 
                         besoins de recevoir cette instruction. et bien meme chatGPT n'a pas réussit à me dire pk est ce que 
                         socket.to(second).emit('ActiverButtonJ1') ne fonctionne pas. 
                         */
                        socket.emit('ActiverButtonJ2');
                    }

                } catch (error) {
                    console.log("En attente de connecte d'un jouer... , plus d'info décomenter la ligne en dessous");
                    //console.log (error);

                }


                console.log(this.#clients.get(socket.id).nom, " est a la posision : ", this.findPositionByName(this.#clients, nom));

                socket.on('choixJoueur', (choix) => {

                    console.log("choix joueur: ", choix)
                    this.#clients.get(socket.id).choix = choix;

                    let otherPlayer = this.#clients.get(second);

                    if (otherPlayer && otherPlayer.choix) {
                        this.whoWin(choix, otherPlayer.choix, socket);
                    }
                });

                try {
                    console.log('jenvoi a : ', this.#clients.get(second).nom, ' ', this.#clients.get(first).nom);
                    socket.emit('nomJoueur1', this.#clients.get(first).nom);

                } catch (error) {
                    console.log(error);
                }

            });
            
            /*Dés lors que first est enregister dans la HashMap j'envoie son nom au prochains joeur qui se connect, 
            ainsi il voie qu'il ya deja quelqu'un de connecté */

            if (this.#clients.get(first).nom){
                console.log('jenvoi a : ', this.#clients.get(second).nom, ' ', this.#clients.get(first).nom);               
                //Non fonctionnel :
                //socket.to(second).emit('nomJoueur1', this.#clients.get(first).nom);
                socket.emit('nomJoueur1', this.#clients.get(first).nom);
            }


            socket.on('disconnect', () => {

                this.#clients.delete(socket.id);
                socket.emit("ClientDeco");
                console.log(`un client s'est déco il en reste : ${this.#clients.size}`);


            });

        });
    }

}