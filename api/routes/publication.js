'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var multipart = require('connect-multiparty');

var api = express.Router();

var md_auth = require('../middlewares/autenticated');
var md_upload = multipart({uploadDir: './uploads/publications'});


api.post('/publication', md_auth.ensureAuth , PublicationController.savePublication);
api.get('/publication', md_auth.ensureAuth , PublicationController.getPublications);

module.exports = api;