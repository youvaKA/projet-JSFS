const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
    },
    
    // La version que j'ai concu n'a pas besoin de cette attribut
    // isBorrowed:{
    //     type: Boolean,
    //     default: false,
    // },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

    borrowedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
});

const dbConnection = require('../controllers/db.controller');
const Object = dbConnection.model('Object', objectSchema, 'objects');

module.exports.model = Object;