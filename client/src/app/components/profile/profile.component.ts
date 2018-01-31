import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {GLOBAL} from '../../services/global';

import {User} from '../../models/user';
import {Follow} from '../../models/follow';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    providers:[UserService,FollowService]
})
export class ProfileComponent implements OnInit{
    public identity;
    public token;
    public url:string;
    public title:string;
    public user:User;
    public followed;
    public following;
    public stats;
    public status:string;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _followService:FollowService
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.title = "Profile";
        this.followed = false;
        this.following = false;
    }

    ngOnInit(){
        console.log('profile.component charged');
        this.loadPage();
    }

    /*Obtiene los parametros de la url y llama a getUSer */
    loadPage(){
        this._route.params.subscribe(params=>{
            let id= params['id'];
            this.getUser(id);
            this.getCounters(id);
        });
    }

    getUser(id){
        this._userService.getUser(id).subscribe(
            response=>{
                if(response.user){
                    this.user=response.user;
                    console.log(response);

                    if(response.following && response.following._id){
                        this.following = true;
                    }else{
                        this.following = false;
                    }

                    if(response.followed && response.followed._id){
                        this.followed = true;
                    }else{
                        this.followed = false;
                    }

                }else{
                    this.status="error";
                }
            },
            error=>{
                var errorMsg = <any>error;
                console.log(errorMsg);
                /**en el caso de introducir un perfil invalido carga el suyo propio */
                this._router.navigate(['/profile',this.identity._id]);
            }
        );
    }

    getCounters(id){
        this._userService.getCounters(id).subscribe(
            response=>{
                if(response){
                    /*followed
                    following
                    publications*/
                }else{
                    this.status="error";
                }
            },
            error=>{
                var errorMsg = <any>error;
                if(errorMsg!=null){
                    this.status="error";
                }
                console.log(errorMsg);
            }
        );
    }

    followUser(followed){
        var follow = new Follow("",this.identity._id, followed);
        this._followService.addFollow(this.token, follow).subscribe(
            response=>{
                this.following=true;
            },
            error=>{
                var errorMsg = <any>error;
                if(errorMsg!=null){
                    this.status="error";
                }
                console.log(errorMsg);
            }
        );
    }

    unfollowUser(following){
        var follow = new Follow("",this.identity._id, following);
        this._followService.deleteFollow(this.token, follow).subscribe(
            response=>{
                this.following=false;
            },
            error=>{
                var errorMsg = <any>error;
                if(errorMsg!=null){
                    this.status="error";
                }
                console.log(errorMsg);
            }
        );
    }

    public followUserOver;

    mouseEnter(userId){
        this.followUserOver = userId;
    }

    mouseLeave(){
        this.followUserOver = 0;
    }
}