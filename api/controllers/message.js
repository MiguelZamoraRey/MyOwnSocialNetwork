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

    message.emitter = req.user.sub;
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
            return res.status(404).send({
                message:"The message is not saved"
            });
        }

        return res.status(200).send({messageStored});
    });

}

function getReceivedMessages(req,res){
    var user_id = req.user.sub;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4

    Message.find({
        receiver: user_id
        //el segundo parametro del populate nos srve para decir que campor queremos popularizar
    }).populate('emitter', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total)=>{
        if(err){
            return res.status(500).send({
                message:"Error when getting message"
            });
        }

        if(!messages){
            return res.status(404).send({
                message:"No meesages founded"
            });
        }

        return res.status(200).send({
            total:total,
            pages:Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

module.exports={
    saveMessage,
    getReceivedMessages
}


