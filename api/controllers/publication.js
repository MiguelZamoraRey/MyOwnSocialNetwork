'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function savePublication(req, res){
    var params = req.body;
    
    if(!params.text){
        return res.status(200).send({
            message: "The publication need text param"
        })
    }

    var publication = new Publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored)=>{
        if(err){
            return res.status(500).send({
                message: "Error when saving Publication"
            });
        }

        if(!publicationStored){
            return res.status(500).send({
                message: "The publication is not saved"
            });
        }

        res.status(200).send({
            publication: publicationStored
        });
    });
}

//todas las publicaciones de los usuarios que sigo, paginado
function getPublications(req, res){
    var page = 1;

    if(req.params.page){
        page =  req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({
        'user':req.user.sub
    }).populate(
        'followed'
    ).exec((err, follows)=>{
        if(err){
            return res.status(500).send({
                message:"error when getting follows"
            });
        } 

        var follows_clean = [];

        follows.forEach((item)=>{
            follows_clean.push(item.followed);
        });

        //con la propiedad in podemos buscar dentro de una variable
        Publication.find({
            user: {"$in":follows_clean}
        }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err){
                return res.status(500).send({
                    message:"error when getting publications"
                });
            } 

            if(!publications){
                return res.status(404).send({
                    message:"no publications for this params"
                });
            }

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                publications:publications
            });
        });

    });
}

module.exports ={
    savePublication,
    getPublications
}