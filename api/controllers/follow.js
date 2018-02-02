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
    }).remove((err,followedDeleted)=>{
        if(err){
            return res.status(500).send({
                message: "Error in deleteFollow"
            });
        }        

        return res.status(200).send({
            message:"The user has been unfollowed"
        });
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

        followUserIds(userId).then((value)=>{
            return res.status(200).send({
                total:total,
                pages: Math.ceil(total/ItemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
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

        followUserIds(userId).then((value)=>{
            return res.status(200).send({
                total:total,
                pages: Math.ceil(total/ItemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}

//usuarios que sigo sin paginar, o en caso de venir 
// followed usuarios a los que sigo sin paginar
function getMyFollows(req,res){
    var userId = req.user.sub;

    var find = Follow.find({user: userId});

    if(req.params.followed){
        find = Follow.find({followed: userId});
    }

    find.populate(
        'user followed'
    ).exec((err,follows)=>{
        if (err){
            return res.status(500).send({
                messages: "Error when getting my follow"
            });
        }

        if (!follows){
            return res.status(404).send({
                messages: "You not follow any user"
            });
        }

        return res.status(200).send({
            follows
        });
    });
}

async function followUserIds(user_Id){

    //FOLLOWIG
    //con el select desmarcamos campos que no queremos
    var following = await Follow.find({
        'user':user_Id
    }).select({
        '_id':0,
        '__v':0,
        'user':0
    }).exec((err,follows)=>{
        return follows;
    });

    //process following --> para que devuelva un array de ids limpio
    var following_clean = [];
    following.forEach((item)=>{
        following_clean.push(item.followed);
    });

    //FOLLOWED
    //con el select desmarcamos campos que no queremos
    var followed = await Follow.find({
        'followed':user_Id
    }).select({
        '_id':0,
        '__v':0,
        'followed':0
    }).exec((err,follows)=>{
        return follows;
    });

    //process followed --> para que devuelva un array de ids limpio
    var followed_clean = [];
    followed.forEach((item)=>{
        followed_clean.push(item.user);
    });

    return {
        following:following_clean,
        followed:followed_clean
    }
}

module.exports={
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
    
}
