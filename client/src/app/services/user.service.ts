/*Lo que necesita siempre un servicio para trabajar con el*/
import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/observable';
import {User} from '../models/user';

/*fichero de configuraciones globales*/
import {GLOBAL} from './global';

@Injectable()
export class UserService{
    public url:string;
    public identity;
    public token;
    public stats;

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;

    }

    //metodo para llamar al backend
    register(user: User): Observable<any>{
        //console.log(user);
        //console.log(this.url);
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'register',params,{headers:headers});
    }

    /*metodo login*/
    signup(user:any, token = null):Observable<any>{
        if(token != null){
            user.token = token;
        }

        let params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json') ;

        return this._http.post(this.url+'login',params,{headers:headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity!="undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');
        if(token!="undefined"){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));

        if(stats!="undefined"){
            this.stats = stats;
        }else{
            this.stats = null;
        }

        return this.stats;
    }

    getCounters(userId = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',this.getToken());
        if(userId !=null){
            return this._http.get(this.url+'user-counters/'+userId, {headers:headers});
        }else{
            return this._http.get(this.url+'user-counters/', {headers:headers});
        }
    }

    updateUser(user:User):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',this.getToken());
        console.log(user);
        return this._http.put(this.url+'user/' + user._id,params, {headers:headers});
    }

    /*Obtiene los usuarios(por pag?)*/
    getUsers(page = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',this.getToken());

        return this._http.get(this.url+'users/'+page,{headers:headers});
    }

    /*obtiene un unico usuario*/
    getUser(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',this.getToken());

        return this._http.get(this.url+'user/'+id,{headers:headers});
    }
}
