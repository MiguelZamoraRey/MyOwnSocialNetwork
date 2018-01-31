import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';

import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    providers:[UserService,PublicationService]
})
export class PublicationsComponent implements OnInit{
    public identity;
    public token;
    public title:string;
    public url:string;
    public status:string;
    public page:number;
    public total:number;
    public pages:number;
    public itemsPerPage:number;
    public publications:Publication[];
    @Input() user:string;

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _publicationService:PublicationService
    ){
        this.identity=this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.url = GLOBAL.url;
        this.title= "Publications";
        this.page = 1;
    }

    ngOnInit(){
        console.log("publications.component charged");
        this.getPublications(this.user,this.page);
    }

    getPublications(user, page, adding=false){
        console.log(page);
        this._publicationService.getPublicationsUser(this.token,user, page).subscribe(
            response=>{
                if(response.publications){
                    this.total=response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage= response.items_per_page;
                    console.log(response);
                    
                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        var arrayA=this.publications;
                        var arrayB=response.publications;
                        this.publications = arrayA.concat(arrayB);

                        /*smooth scroll */
                        $("html, body").animate(
                            {scrollTop: $('html').prop("scrollHeight")},
                            500
                        );
                    }

                }else{
                    this.status = "error";
                }
            },
            error=>{
                var errorMsg = <any>error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status = "error";
                }
            }
        );
    }

    public noMore = false;
    viewMore(){
        this.page++;
        if(this.page == this.pages){
            this.noMore=true;
        }
        this.getPublications(this.user,this.page,true);
    }
}