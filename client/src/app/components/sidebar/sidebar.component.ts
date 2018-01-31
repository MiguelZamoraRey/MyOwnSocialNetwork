import { Component, OnInit} from '@angular/core';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import { Router, ActivatedRoute, Params } from '@angular/router';
/*Los siguientes import son tambien de angular core pero nos serviran para comunicar un componente con otro*/
import { EventEmitter, Input, Output} from '@angular/core';


/*Importe del servicio*/
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers:[UserService,PublicationService]
})
export class SidebarComponent implements OnInit{
    public url:string;
    public identity;
    public token;
    public stats;
    public status;
    public publication:Publication;

    constructor(
        private _userService:UserService,
        private _publicationService:PublicationService,
        private _route:ActivatedRoute,
        private _router:Router
    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url=GLOBAL.url;
        this.publication = new Publication("",this.identity._id,"","","");
    }

    ngOnInit(){
        console.log('sidebar cargado');
    }

    onSubmit(newPubForm){
        this._publicationService.addPublicaton(this.token,this.publication).subscribe(
            response=>{
                if(response.publication){
                    newPubForm.reset();
                    this.status = "success";
                    this._router.navigate(['/timeline']);
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

    /*para exportar eventos*/
    @Output() sended = new EventEmitter();
    sendPublication(event){
        this.sended.emit({send:'true'});
    }
}