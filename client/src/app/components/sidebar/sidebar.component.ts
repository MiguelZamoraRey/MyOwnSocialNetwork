import { Component, OnInit} from '@angular/core';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';

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
        private _publicationService:PublicationService
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
}