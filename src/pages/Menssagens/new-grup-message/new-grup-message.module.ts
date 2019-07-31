import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewGrupMessagePage } from './new-grup-message';

@NgModule({
  declarations: [
    NewGrupMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(NewGrupMessagePage),
  ],
})
export class NewGrupMessagePageModule {}
