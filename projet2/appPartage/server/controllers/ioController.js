const IOServer = require('socket.io').Server;


class IOController {

    #io;

    
    
    constructor(server) {
        console.log('Class IOController est chargé')

        this.#io = new IOServer(server);
        this.setupSocket();
    }


    setupSocket() {


      this.#io.on('connection', (socket) => {

        console.log('a user connected');
        socket.on('update',() => {

          this.#io.emit('upgrade');

        });

        socket.on('disconnect', () => {console.log('user disconnected');});

      });

    }
}

module.exports = IOController;