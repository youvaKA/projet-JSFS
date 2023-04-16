//Fichier index.js

var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const loginController = require('../controllers/loginController');

const authMiddleware = require('../middlewares/authentication.middleware');

/* GET home page. */
router.get('/', loginController.loginForm );
router.post('/', loginController.login);
router.get('/register', loginController.registerForm);
router.post('/register', loginController.register);
router.get('/logout', loginController.logout );

router.get('/home', authMiddleware.validToken, indexController.home);


module.exports = router;