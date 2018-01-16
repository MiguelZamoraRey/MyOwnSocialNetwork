'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mirar User: de esta manera hacemos referencia 
//  para que cargue el objeto entero en la variable
//  user a traves del populate
var PublicationSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String
});

module.exports = mongoose.model('Publication', PublicationSchema);