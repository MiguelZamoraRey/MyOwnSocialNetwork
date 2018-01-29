import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title:string;
  public identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'ngSocial';
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
  }

  /*cada vez que se sufre un cambio en el componente se actualiza la variable*/
  /*haviendo que la pagina se recargue automaticamente*/
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity=null;
    this._router.navigate(['/']);
  }
}
