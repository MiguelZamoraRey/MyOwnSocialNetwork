import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';

import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers:[UserService,PublicationService]
})
export class TimelineComponent implements OnInit{
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

    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService,
        private _publicationService:PublicationService
    ){
        this.identity=this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.url = GLOBAL.url;
        this.title= "Timeline";
        this.page = 1;
    }

    ngOnInit(){
        console.log("timeline.component charged");
        this.getPublications(this.page);
    }

    getPublications(page, adding=false){
        this._publicationService.getPublications(this.token,page).subscribe(
            response=>{
                if(response.publications){
                    this.total=response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage= response.items_per_page;

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
        
        this.getPublications(this.page,true);
    }

    //se llama desde la plantilla cuando el sidebar envia una publicacion
    refresh(event = null){
       this.getPublications(1);//siempre la 1 para resetear
    }

    deletePublication(id){
        this._publicationService.deletePublication(this.token,id).subscribe(
            response=>{
                this.refresh();
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
}