import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';

/*Importe del servicio*/
import {UserService} from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http/src/headers';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})

export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Login';
        this.user = new User("","","","","","","ROLE_USER","") ;
    }

    ngOnInit(){
        console.log('componente de login cargado');
    }

    onSubmit(){
        //login user
        this._userService.signup(this.user).subscribe(
            response=>{
                this.identity = response.user;
                if(!this.identity || !this.identity._id){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    //PERSISTIR DATUS USUARIO
                    localStorage.setItem('identity',JSON.stringify(this.identity));
                    //getToken
                    this.getToken();
                }
            },
            error=>{
                var errorMsg = <any>error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status='error';
                }                
            }
        );
    }

    getToken(){
        //login user
        this._userService.signup(this.user, 'true').subscribe(
            response=>{
                this.token = response.token;
                if(this.token.length <= 0){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    //PERSISTIR token
                    localStorage.setItem('token',this.token);
                    //getCounters 
                    this.getCounters();
                }
            },
            error=>{
                var errorMsg = <any>error;
                console.log(errorMsg);
                if(errorMsg!=null){
                    this.status='error';
                }                
            }
        );
    }

    getCounters(){
        this._userService.getCounters().subscribe(
            response=>{
                this._router.navigate(['/']);
                if(response.following){

                }
            },
            error=>{
                console.log(error);
            }
        );
    }
   
}