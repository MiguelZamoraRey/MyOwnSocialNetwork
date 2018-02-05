//Modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

//Routes
import {MessagesRoutingModule} from './messages.routing';

//componentes
import {MainComponent} from './components/main/main.component';
import {AddComponent} from './components/add/add.component';
import {SendedComponent} from './components/sended/sended.component';
import {ReceivedComponent} from './components/received/received.component';

@NgModule({
  //aqui se cargan los componentes
  declarations: [
    MainComponent,
    AddComponent,
    SendedComponent,
    ReceivedComponent
  ],
  //aqui se cargan modulos
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule
  ],
  //aqui van los modulos que exportamos por si queremos utilizarlo en otro sitio
  exports:[
    MainComponent,
    AddComponent,
    SendedComponent,
    ReceivedComponent
  ],
  //servicios
  providers: [
    
  ]
})
export class MessagesModule{}
