const express = require('express');
const router = express.Router();

// import controller for index
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authentication.middleware');


router.get('/', userController.home );
router.get('/me', authMiddleware.validToken, userController.me );


module.exports = router;
