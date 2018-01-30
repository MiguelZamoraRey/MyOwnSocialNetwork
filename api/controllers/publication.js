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
        page = req.params.page;
    }
    console.log(req.params);
    console.log(page);

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
                items_per_page: itemsPerPage,
                publications:publications
            });
        });

    });
}

function getPublication(req, res){
    var publication_id = req.params.id;

    Publication.findById(publication_id, (err, publication)=>{
        if(err){
            return res.status(500).send({
                message:"error when getting publication"
            });
        } 

        if(!publication){
            return res.status(404).send({
                message:"Publications no exist"
            });
        }

        return res.status(200).send({publication});
    })
}

function deletePublication(req,res){
    var publication_id = req.params.id;

    Publication.find({'user':req.user.sub, '_id':publication_id}).remove((err)=>{
        if(err){
            return res.status(500).send({
                message:"error when deleting publication"
            });
        } 

        if(!publicationRemoved){
            return res.status(404).send({
                message:"Publications is not deleted"
            });
        }

        return res.status(200).send({
            message: "The publication is now deleted"
        });
    });
}

function uploadImage(req, res){
    var publication_Id = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var fil_split = file_path.split('\\');
        var file_name = fil_split[2];
        var ext_split = file_name.split('\.');
        var file_extension = ext_split[1];

        if(file_extension == "png" ||
           file_extension == "jpg" ||
           file_extension == "jpeg" ||
           file_extension == "gif"){

            Publication.findOne({'user':req.user.sub, '_id':publication_id}).exec((err,publication)=>{
                if (publication){
                    Publication.findByIdAndUpdate(publication_Id, {file: file_name}, {new:true}, (err, publicationUpdated)=>{
                        //error
                        if(err){
                            return res.status(500).send({
                                message: "Error when updating publication"
                            });
                        }
        
                        if(!publicationUpdated){
                            //En caso de que no devuelva nada
                           return res.status(404).send({
                                message: "The publication doesn't exist"
                            });
                        }
        
                        return res.status(200).send({
                                publication: publicationUpdated
                            });
        
                    });
                }else{
                    return removeFilesOfUpload(res, file_path, "You don't have permmision to edit this publication");
                }
            });
        }else{
            return removeFilesOfUpload(res, file_path, "There is no valid format");
        }
    }else{
        return res.status(200).send({
            message: "No files in the request"
        });
    }

}

//private
function removeFilesOfUpload(res, file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({
            message: message
        });
    });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;

    var path_file = './uploads/publications/'+image_file;

    fs.exists(path_file, (exist)=>{
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({
                message: "The image doesn't exists"
            });
        }
    });
}

module.exports ={
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}