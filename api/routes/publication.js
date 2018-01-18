'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var multipart = require('connect-multiparty');

var api = express.Router();

var md_auth = require('../middlewares/autenticated');
var md_upload = multipart({uploadDir: './uploads/publications'});

api.post('/publication', md_auth.ensureAuth , PublicationController.savePublication);
api.post('/publication-image/:id', [md_auth.ensureAuth, md_upload] , PublicationController.uploadImage);
api.get('/publications/:page?', md_auth.ensureAuth , PublicationController.getPublications);
api.get('/publication/:id', md_auth.ensureAuth , PublicationController.getPublications);
api.get('/publication-image/:imageFile', PublicationController.getImageFile);
api.delete('/publication/:id', md_auth.ensureAuth , PublicationController.deletePublication);

module.exports = api;