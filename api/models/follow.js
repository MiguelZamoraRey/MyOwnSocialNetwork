'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mirar User: de esta manera hacemos referencia 
//  para que cargue el objeto entero en la variable
//  user a traves del populate
var FollowSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    followed: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Follow', FollowSchema);