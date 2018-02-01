import { Component, OnInit} from '@angular/core';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import { Router, ActivatedRoute, Params } from '@angular/router';
/*Los siguientes import son tambien de angular core pero nos serviran para comunicar un componente con otro*/
import { EventEmitter, Input, Output} from '@angular/core';


/*Importe del servicio*/
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {UploadService} from '../../services/upload.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers:[UserService,PublicationService,UploadService]
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
        private _router:Router,
        private _uploadService:UploadService
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

    public filesToUpload:Array<File>;
    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    onSubmit(newPubForm){
        this._publicationService.addPublicaton(this.token,this.publication).subscribe(
            response=>{
                if(response.publication){                
                    if(this.filesToUpload && this.filesToUpload.length){
                         //uploadImage
                        this._uploadService.makeFileRequest(
                            this.url+'publication-image/'+response.publication._id,
                            [],
                            this.filesToUpload,
                            this.token,
                            'image').then((result:any)=>{
                                this.publication.file = result.image;
                                newPubForm.reset();
                                this._router.navigate(['/timeline']);
                        });
                    }else{
                        newPubForm.reset();
                        this._router.navigate(['/timeline']);
                    }
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

    /*para exportar eventos*/
    @Output() sended = new EventEmitter();
    sendPublication(event){
        this.sended.emit({send:'true'});
    }
}