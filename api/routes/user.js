'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

//middleware de autenticación
var mdAuth = require('../middlewares/autenticated');

//como podemos ver llama al controlador para crear las rutas
api.get('/test', mdAuth.ensureAuth , UserController.test);

//param get obligatorio
api.get('/user/:id', mdAuth.ensureAuth , UserController.getUser);
//param get opcional
api.get('/users/:pages?', mdAuth.ensureAuth , UserController.getUsers);

api.put('/user/:id', mdAuth.ensureAuth , UserController.updateUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;