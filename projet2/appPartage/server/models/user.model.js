const mongoose = require('mongoose');

// definition of schema
const userSchema = new mongoose.Schema({

    name : {
            type : String,
            required : true,
            unique : true
            },
    
    login : {
              type : String,
              required : true,
              unique : true
            },
    password : {
                type : String,
                required : true
               },
    Objects:[{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Object'
    }],
});


module.exports = userSchema;

// model
const dbConnection = require('../controllers/db.controller');
const User = dbConnection.model('User',userSchema,'users');

module.exports.model = User;
