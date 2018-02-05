import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { User } from '../../../models/user';
import {FollowService} from '../../../services/follow.service';
import {MessageService} from '../../../services/message.service';
import {UserService} from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
    selector: 'sended',
    templateUrl: './sended.component.html',
    providers:[MessageService,FollowService]
})
export class SendedComponent implements OnInit{
    public title:string;
    public message:Message;
    public identity;
    public token;
    public url:string;
    public status;
    public follows;
    public messages: Message[];
    public pages;
    public page;
    public total;
    public nextPage;
    public prevPage;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _messageService:MessageService,
        private _followService:FollowService,
        private _userService:UserService
    ){
        this.title='Sended Messages';
        this.url = GLOBAL.url;
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
    }


    ngOnInit(){
        console.log('main component loaded');
        this.actualPage();
    }

    actualPage(){
        this._route.params.subscribe(
            params=>{
                let userId = params['id'];
                let page = params['page'];
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
                this.getMessages(this.page);
            }
        );
    }

    getMessages(page=1){
        this._messageService.getSendedMessages(this.token).subscribe(
            response=>{
                if(response.messages){
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },
            error=>{
                let errorMsg = <any>error;
                if(errorMsg){
                    console.log(errorMsg);
                }
            }
        );
    }
}