const express = require('express');
const router = express.Router();

// import controller objects
const objectController = require('../controllers/objectsController');

const authMiddleware = require('../middlewares/authentication.middleware');

//Route pour obtenir la liste des objects
router.get('/list', authMiddleware.validToken, objectController.list );

//routes pour ajouter
router.post('/add', authMiddleware.validToken, objectController.add );


// //routes pour louer
router.get('/update', authMiddleware.validToken, objectController.borroweObj );
router.post('/update', authMiddleware.validToken, objectController.borroweObj);

//route pour rendre un objet
//router.get('/return', authMiddleware.validToken, objectController.returnObj );
router.post('/return', authMiddleware.validToken, objectController.returnObj );

// //routes pour supp
router.get('/del', authMiddleware.validToken, objectController.dell );
router.post('/del', authMiddleware.validToken, objectController.dell);


module.exports = router;
