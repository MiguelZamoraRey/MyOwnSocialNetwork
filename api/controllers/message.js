'use strict'

var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function saveMessage(req,res){
    var params = req.body;
    console.log(params);
    if(!params.text || !params.receiver){
        return res.status(200).send({
            message:"Insuficient Parameters"
        });
    }

    var message = new Message;

    message.emmiter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();

    message.save((err,messageStored)=>{
        if(err){
            return res.status(500).send({
                message:"Error when saving message"
            });
        }

        if(!messageStored){
            return res.status(500).send({
                message:"The message is not saved"
            });
        }

        return res.status(200).send({messageStored});
    });

}

module.exports={
    saveMessage
}


