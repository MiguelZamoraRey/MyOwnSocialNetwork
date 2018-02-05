import { Component, OnInit, DoCheck} from '@angular/core';
/*import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

import { Follow } from '../../models/follow';
import {FollowService} from '../../services/follow.service';*/

@Component({
    selector: 'sended',
    templateUrl: './sended.component.html'//,
    //providers:[UserService,FollowService]
})
export class SendedComponent implements OnInit{

    public title:string;

    constructor(){
        this.title='Sended Messages';
    }


    ngOnInit(){
        console.log('main component loaded');
    }
}