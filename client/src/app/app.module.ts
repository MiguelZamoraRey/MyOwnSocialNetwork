import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';//old
import { HttpClientModule } from '@angular/common/http';//new

//routes imports(modulos)
import { routing, appRoutingProviders } from './app.routing';
import {MomentModule} from 'angular2-moment';

//componentes
import { AppComponent } from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  //aqui se cargan los componentes
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    ProfileComponent,
    PublicationsComponent
  ],
  //aqui se cargan modulos
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    MomentModule
  ],
  //servicios
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
