'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var api = express.Router();

var md_auth = require('../middlewares/autenticated');

api.post('/message',md_auth.ensureAuth, MessageController.saveMessage);
api.get('/message-recived/:page?',md_auth.ensureAuth, MessageController.getReceivedMessages);
api.put('/message/',md_auth.ensureAuth, MessageController.setMessagesViewed);
api.get('/message-emitted/:page?',md_auth.ensureAuth, MessageController.getEmmitMessages);
api.get('/message-unviewed/',md_auth.ensureAuth, MessageController.getUnviewedMessage);

module.exports = api;