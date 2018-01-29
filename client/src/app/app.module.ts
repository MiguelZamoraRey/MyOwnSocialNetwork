import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';//old
import { HttpClientModule } from '@angular/common/http';//new

//routes imports
import { routing, appRoutingProviders } from './app.routing';

//componentes
import { AppComponent } from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';

@NgModule({
  //aqui se cargan los componentes
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  //aqui se cargan modulos
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  //servicios de manera global
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
