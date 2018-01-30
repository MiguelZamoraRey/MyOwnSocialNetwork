/*Este archivo nos va a servir para poder cargar componentes dependiendo de la ruta que pongamos nostros en el navegador
*/

import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//Componentes
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';

//definimos en una constante las rutas que queremos
const appRoutes: Routes = [
    {path:'', component:HomeComponent},
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'my-data', component:UserEditComponent},
    {path:'people/:page', component:UsersComponent},
    {path:'people', component:UsersComponent},
    {path:'timeline', component:TimelineComponent},
    {path:'**', component:HomeComponent}
];

//este export especial hay que dejarlo como esta e importar desde el app
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
