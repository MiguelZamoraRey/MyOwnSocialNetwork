'use strict'

//para paginacion de usuarios
var mongoosePaginate = require('mongoose-pagination');
//para cifrar la contraseña
var bcrypt = require('bcrypt-nodejs');
//para el manejado de archivos
var fs = require('fs');
var path = require('path');

//para generar los token
var jwt = require('../services/jwt');
//primera letra en mayus para indicar que es un modelo
var User = require('../models/user');

var Follow = require('../models/follow');
var Publication = require('../models/publication');

function test(req, res){
    res.status(200).send({
        message: 'Test action in Node.js Server'
    });
}

function loginUser(req,res){
    var params = req.body;
    
    var email = params.email;
    var password = params.password;
    
    //clausula and en mongo
    //comprobamos solo el mail ya que la contraseña esta cifrada
    User.findOne({
        email:email
    }, (err,user)=>{
        if(err){
            res.status(500).send({
                message: "Error in login"
            });
        }

        if(user){
            //desciframos y comparamos
            bcrypt.compare(password, user.password,
            (err,check)=>{
                //en check se almacena el boolean que devuelve el compare
                if(check){
                    //devolvemos datos de usuario por token o plano
                    if(params.token){
                        //devolvemos token
                        //generar token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        //en caso de que sea plano eliminamos previamente los campos sensibles que solo queremos en backend
                        user.password = undefined;
                        return res.status(200).send({
                            user
                        });
                    }
                }else{
                    return res.status(404).send({
                        message: "The user can't be identified"
                    });
                }
            })
        }else{
            return res.status(404).send({
                message: "The user can't be identified"
            });
        }
    });

}

function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname &&
       params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';//defecto
        user.image = null;

        //control duplicados de usuarios--------------------------
        //clausula or en mongo
        User.find({ $or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err,users)=>{
            if(err){
                return res.status(500).send({
                    message: "Error when getting duplicate users"
                });
            }

            if(users && users.length >= 1){
                return res.status(200).send({
                    message: "The user you try to register exists"
                });
            }else{//no existe y todo ok
                //encriptamos la contraseña, los otros parametros son para el coste de cifrado etc..
                // por ultimo un callback para que se ejecute en caso de que haya ido bien
                bcrypt.hash(params.password,null,
                    null, (err, hash)=>{
                    user.password = hash;
                    //si todo ok utilizamos el metodo save de mongoose para persistirlo
                    user.save((err,userStored)=>{
                        //error
                        if(err){
                            return res.status(500).send({
                                message:"Error when saving user"
                            });
                        }
                        //ok
                        if(userStored){
                            res.status(200).send({
                                user: userStored
                            });
                        }else{
                            //En caso de que no devuelva nada
                            res.status(404).send({
                                message:"The user has not been registered"
                            });
                        }
                    });
                });
            }
        });
        //fin control duplicados----------------------------------
    }else{
        res.status(200).send({
            message: 'All the fields are required'
        });
    }
}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;
    
    //borramos la prop password
    delete update.password;
    
    if(userId != req.user.sub){
        return res.status(500).send({
            message: "You don't have permmision to edit this user"
        });
    }

    var nickOrMailIsAlreadyUsed=false;

    User.find({ $or: [
        {email: update.email.toLowerCase()},
        {nick: update.nick.toLowerCase()}
    ]}).exec((err, users)=>{
        users.forEach((user)=>{
            if(user && user._id != userId){
                nickOrMailIsAlreadyUsed = true;
            }
        });        

        if(nickOrMailIsAlreadyUsed){
            return res.status(500).send({
                message: "This data it's already in use"
            });
        }

        //el new: true nos devuelve el objeto actualizado y no el original
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            //error
            if(err){
                return res.status(500).send({
                    message:"Error when updating user"
                });
            }
            //ok
            if(!userUpdated){
                //En caso de que no devuelva nada
                return res.status(404).send({
                    message:"The user doesn't exist"
                });
            }

            return res.status(200).send({
                        user: userUpdated
                    });
        });
    });
}

function getUser(req,res){
    //viene por url por lo que utilizamos params
    var userId = req.params.id;

    User.findById(userId, (err, user)=>{
        if(err){
            return res.status(500).send({
                message: "Error in request"
            });
        }

        if(!user){
            return res.status(404).send({
                message: "User doesn't exist"
            });
        }

        //con el metodo then esperamos a que la promesa nos devuelva un valor
        followThisUser(req.user.sub,userId).then((value)=>{
            user.password=undefined;//para no devolverla
            return res.status(200).send({
                user,
                followig: value.following,
                followed: value.followed
            });
        });

    });
}

//async --> cuando se ejecute se esperara el resultado antes
// de continuar de esta forma evitamos que al tardar mas una
// consulta alguna variable no se rellene provocando fallos
// el async devuelve lo que llamamos una PROMESA por lo que utilizamos el metodo then
async function followThisUser(identity_user_id, user_Id){
    //con ese await hacemos que esta llamada sea SINCRONA, esperando el resultado antes de seguir
    var following = await Follow.findOne(//al que sigo
        {"user":identity_user_id, "followed":user_Id}
    ).exec((err,follow)=>{
        //con el método handleError de node.js hacemos que se devuelva el error por consola
        if(err){
           return handleError(err);
        }

        return follow;
    });

    //con ese await hacemos que esta llamada sea SINCRONA, esperando el resultado antes de seguir
    var followed = await Follow.findOne(//si me sigue
        {"user":user_Id, "followed":identity_user_id}
    ).exec((err,follow)=>{
        //con el método handleError de node.js hacemos que se devuelva el error por consola
        if(err){
           return handleError(err);
        }

        return follow;
    });

    return {
        following:following,
        followed: followed
    };
}

function getUsers(req,res){
    //obtenemos de user que hemos metido en el request a traves del middleware
    var identity_user_id = req.user.sub;
    
    //valor por defecto
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, 
        (err, users, total)=>{
            if(err){
                return res.status(500).send({
                    message: "Error in request"
                });
            }
    
            if(!users){
                return res.status(404).send({
                    message: "No disponible users"
                });
            }

            followUserIds(identity_user_id).then((value)=>{
                return res.status(200).send({
                    users,
                    total,
                    pages:  Math.ceil(total/itemsPerPage),
                    users_following: value.following,
                    users_follow_me: value.followed
                });
            });
    })
}

//Con esta otra funcion asyncrona lo que vamos a hacer es
// obtener dos arrays con los ids de los usuarios a los que
// seguimos y nos siguen y la llamaremos desde el método getUsers
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

function getCounters(req, res){

    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }else{
        getAllCounters(userId).then((value)=>{
            return res.status(200).send(value);
        });
    }

}

async function getAllCounters(user_id){
    //metodo .count como en mysql
    var following = await Follow.count({
        'user':user_id
    }).exec((err,count)=>{
        if (err){
            return handleError(err);
        }
        return count;
    });

    //metodo .count como en mysql
    var followed = await Follow.count({
        'followed':user_id
    }).exec((err,count)=>{
        if (err){
            return handleError(err);
        }
        return count;
    });

    var publications = await Publication.count({
        'user':user_id
    }).exec((err,count)=>{
        if (err){
            return handleError(err);
        }
        return count;
    });

    return {
        following: following,
        followed:followed,
        publications: publications
    }
}

function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        var fil_split = file_path.split('\\');
        var file_name = fil_split[2];
        var ext_split = file_name.split('\.');
        var file_extension = ext_split[1];

        if(userId != req.user.sub){
            return removeFilesOfUpload(res, file_path, "You haven't enoght permissions to adit this avatar") ;
        }

        if(file_extension == "png" ||
           file_extension == "jpg" ||
           file_extension == "jpeg" ||
           file_extension == "gif"){

            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated)=>{
                //error
                if(err){
                    return res.status(500).send({
                        message: "Error when updating user"
                    });
                }

                if(!userUpdated){
                    //En caso de que no devuelva nada
                   return res.status(404).send({
                        message: "The user doesn't exist"
                    });
                }

                return res.status(200).send({
                        user: userUpdated
                    });

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

    var path_file = './uploads/users/'+image_file;

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

//lo exportamos como objeto para poder utilizarlo como user.function
module.exports = {
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}