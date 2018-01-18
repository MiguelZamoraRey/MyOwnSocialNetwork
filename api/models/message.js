'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mirar User: de esta manera hacemos referencia 
//  para que cargue el objeto entero en la variable
//  user a traves del populate
var MessageSchema = Schema({
    emitter:  {type: Schema.ObjectId, ref: 'User'},
    receiver:  {type: Schema.ObjectId, ref: 'User'},
    text: String,
    created_at: String,
    viewed: String
});

module.exports = mongoose.model('Message', MessageSchema);