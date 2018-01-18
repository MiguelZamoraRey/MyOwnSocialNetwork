'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var api = express.Router();

var md_auth = require('../middlewares/autenticated');

api.post('/message',md_auth.ensureAuth, MessageController.saveMessage);

module.exports = api;