'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas(carpeta routes, que llama al controlador, que a su vez llama a los modelos)
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');

// Middelwares --> metodo ejecutado antes de llegar al controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//siempre convierte en JSON lo que le llega por peticion

// Cors y cabeceras


// Rutas -->uso de las rutas para sobreescribirlas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);


//exportar
module.exports = app;