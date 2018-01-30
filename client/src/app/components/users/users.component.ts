import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

import { Follow } from '../../models/follow';
import {FollowService} from '../../services/follow.service';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers:[UserService,FollowService]
})
export class UsersComponent implements OnInit{
    public title:string;
    public identity;
    public token:string;
    public url:string;
    public page:number;
    public nextPage:number;
    public prevPage:number;
    public status:string;
    public total:number;
    public pages:number;
    public users:User[];
    public follows;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _followService:FollowService
    ){
        this.title='People';
        this.identity=this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('users.component succesfully charged');
        this.actualPage();
    }

    //recibe de la url de people/[NUMERO DE PAGINA] que se recoge con el suscribe ya que devuelve un observable
    actualPage(){
        this._route.params.subscribe(
            params=>{
                let page = +params['page'];
                this.page = page;

                this.nextPage = page + 1;
                this.prevPage = page - 1;

                if(!page){
                    page = 1;
                    this.nextPage = page + 1;
                    this.prevPage = page - 1;
                }else{
                    if(this.prevPage <= 0){
                        this.prevPage = 1;
                    }
                }

                //devolver listado users
                this.getUsers(page);
            }
        );
    }

    getUsers(page){
        this._userService.getUsers(page).subscribe(
            response=>{
                if(!response.users){
                    this.status = "error";
                }else{
                    this.total=response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;
                    if(page > this.pages){
                            this._router.navigate(['/people',1]);
                    }
                }
            },
            error=>{
                var errorMsg = error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status = "error";
                }
            }
        );
    }

    public followUserOver;

    mouseEnter(userId){
        this.followUserOver = userId;
    };

    mouseLeave(userId){
        this.followUserOver = 0;
    };

    followUser(followed){
        var follow = new Follow("",this.identity._id,followed);

        this._followService.addFollow(this.token,follow).subscribe(
            response=>{
                if(!response.follow){
                    this.status = "error";
                }else{
                    this.status = "success";
                    /*al añadirlo al array ya dinamicamente angular refresca los botones */
                    this.follows.push(followed);
                }
            },
            error=>{
                var errorMsg = error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status = "error";
                }
            }
        )
    }

    unfollowUser(followed){
        this._followService.deleteFollow(this.token,followed).subscribe(
            response=>{
                var search = this.follows.indexOf(followed);

                if(search != -1){
                    console.log(followed);
                    console.log(this.follows);
                    /*al eliminarlo del array ya dinamicamente angular refresca los botones */
                    this.follows.splice(search, 1);
                    console.log(this.follows);
                }                
            },
            error=>{
                var errorMsg = error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status = "error";
                }
            }
        )
    }

}