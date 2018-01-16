'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas


// Middelwares --> metodo ejecutado antes de llegar al controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//siempre convierte en JSON lo que le llega por peticion

// Cors y cabeceras


// Rutas
app.get('/', (req, res)=> {
    res.status(200).send({
        message: 'Hi world!'
    });
});

app.get('/test', (req, res)=> {
    res.status(200).send({
        message: 'Test action in Node.js Server'
    });
});

//exportar
module.exports = app;