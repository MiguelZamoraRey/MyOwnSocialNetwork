import { Component, OnInit, DoCheck} from '@angular/core';
/*import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

import { Follow } from '../../models/follow';
import {FollowService} from '../../services/follow.service';*/

@Component({
    selector: 'main',
    templateUrl: './main.component.html'//,
    //providers:[UserService,FollowService]
})
export class MainComponent implements OnInit{

    public title:string;

    constructor(){
        this.title='Private Messages';
    }


    ngOnInit(){
        console.log('main component loaded');
    }
}