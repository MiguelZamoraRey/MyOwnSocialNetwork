import {Injectable} from '@angular/core';
import {GLOBAL} from './global';

@Injectable()
export class UploadService{
    public url:string;

    constructor(){
        this.url = GLOBAL.url;
    }

    makeFileRequest(url:string,
                    params: Array<string>, 
                    files: Array<File>, 
                    token:string,
                    name:string
                ){
        return new Promise(function(resolve,reject){
            //crea el form
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            //añade cada uno de los ficheros con nombre geeral y nombre de cada uno
            for(var i = 0; i< files.length; i++){
                formData.append(name, files[i], files[i].name);
            }

            //construccion de la petición ajax
            xhr.onreadystatechange = function(){
                //tiene que ser 4
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            //peticion post al servicio
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}