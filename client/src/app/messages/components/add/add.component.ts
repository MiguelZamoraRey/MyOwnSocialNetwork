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
    selector: 'add',
    templateUrl: './add.component.html',
    providers:[MessageService,FollowService]
})
export class AddComponent implements OnInit{
    public title:string;
    public message:Message;
    public identity;
    public token;
    public url:string;
    public status;
    public follows;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _messageService:MessageService,
        private _followService:FollowService,
        private _userService:UserService
    ){
        this.title='Send Message';
        this.url = GLOBAL.url;
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.message = new Message("",this.identity._id,"","","","");
    }

    ngOnInit(){
        console.log('main component loaded');
        this.getMyFollows();
    }

    onSubmit(formAdd){
        this._messageService.addMessage(this.token,this.message).subscribe(
            response=>{
                if(response.messageStored){
                    this.status = "success";
                    formAdd.reset();
                }
            },
            error=>{
                this.status = "error";
                let errorMsg = <any>error;
                if(errorMsg){
                    console.log(errorMsg);
                }
            }
        );
    }

    getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response=>{
                this.follows=response.follows;
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