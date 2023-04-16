import http from 'http';
import RequestController from './serveur/requestController.js';
import ioController from './serveur/ioController.js';

import { Server as ServerIO } from 'socket.io';


const server = http.createServer(
	(request, response) => new RequestController(request, response).handleRequest()
);


//Sever socket
const io = new ServerIO(server);
const ioCtrl = new ioController(io);
//ioCtrl.clientName();
ioCtrl.manageConnection();

//io.on('connection', socket => ioController.registerSocket(socket) );



server.listen(8080);