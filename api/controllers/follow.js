'use strict'

var mongoosePaginate = require('mongoose-Pagination');
var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res){
    var params = req.body;
    
    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;
    
    follow.save((err, followStored)=>{
        if (err){
            return res.status(500).send({
                messages: "Error when saving follow"
            });
        }

        if (!followStored){
            return res.status(404).send({
                messages: "The Follow doesn't save"
            });
        }

        return res.status(200).send({
            follow:followStored
        });

    });
}

function deleteFollow(req,res){
    var userId = req.user.sub;
    var followId= req.params.id;

    Follow.find({
        'user':userId,
        'followed':followId
    }).remove((err)=>{
        return res.status(500).send({
            message: "Error in deleteFollow"
        })
    });

    return res.status(200).send({
        message:"The user has been unfollowed"
    });
}

//usuarios a los que sigo o a los que sigue el param
function getFollowingUsers(req,res){
    var userId = req.user.sub;

    //en el caso de que venga uno principal
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    //valor por defecto
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var ItemsPerPage = 4;

    //buscamos y "populamos" para sustituir el id por el objeto usuario
    Follow.find({
        user:userId
    }).populate({
        path:'followed'
    }).paginate(page, ItemsPerPage, (err,follows, total)=>{
        if (err){
            return res.status(500).send({
                messages: "Error when getting follow"
            });
        }

        if (!follows){
            return res.status(404).send({
                messages: "You don't follow any user"
            });
        }

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/ItemsPerPage),
            follows
        });
    });
}

//usuarios que nos siguen
function getFollowedUsers(req,res){
    var userId = req.user.sub;

    //en el caso de que venga uno principal
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    //valor por defecto
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    var ItemsPerPage = 4;

    //buscamos y "populamos" para sustituir el id por el objeto usuario
    Follow.find({
        followed:userId
    }).populate({
        path:'user'
    }).paginate(page, ItemsPerPage, (err, follows, total)=>{
        if (err){
            return res.status(500).send({
                messages: "Error when getting follow"
            });
        }

        if (!follows){
            return res.status(404).send({
                messages: "You are not followed by any user"
            });
        }

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/ItemsPerPage),
            follows
        });
    });
}

module.exports={
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
    
}
