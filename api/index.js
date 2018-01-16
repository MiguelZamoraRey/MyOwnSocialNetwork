'use strict'//permite utilizar caracteristicas de ECMAscript

var mongoose = require('mongoose');
var app = require('./app.js');

var port = 3800;

//BBDD conection-----------------------------------
mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost:27017/curso-mean-social', 
    {useMongoClient:true}
).then(()=>{
    console.log("Succesfully conection with BBDD");
    //si se conecta a la bbdd crea el server
    app.listen(port,()=>{
        console.log("Succesfully creation of the server at http://localhost:3800")
    });
}).catch(err=>
    concole.log(err)
);
//fin BBDD connection------------------------------
