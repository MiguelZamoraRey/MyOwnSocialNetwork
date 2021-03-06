/*Lo que necesita siempre un servicio para trabajar con el*/
import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/observable';

import {Follow} from '../models/follow';

/*fichero de configuraciones globales*/
import {GLOBAL} from './global';

@Injectable()
export class FollowService{
    public url:string;

    constructor(
        private _http:HttpClient
    ){
        this.url = GLOBAL.url;
    }

    addFollow(token, follow):Observable<any>{
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        
        return this._http.post(this.url+'follow',params,{headers:headers});
    }

    deleteFollow(token,userId):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        
        return this._http.delete(this.url+'follow/'+userId,{headers:headers});
    }

    getFollowing(token,userId=null,page=1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        
        return this._http.get(this.url+'following/'+userId+'/'+page,{headers:headers});
    }

    getFollowed(token,userId=null,page=1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        
        return this._http.get(this.url+'followed/'+userId+'/'+page,{headers:headers});
    }

    getMyFollows(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        
        return this._http.get(this.url+'follow/true',{headers:headers});
    }
}