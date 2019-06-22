import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProjetoPage } from './my-projeto';


@NgModule({
  declarations: [
    MyProjetoPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProjetoPage),
  ],
})
export class MyProjetoPageModule {}
