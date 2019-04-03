import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProjetoPage } from './edit-projeto';

@NgModule({
  declarations: [
    EditProjetoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditProjetoPage),
  ],
})
export class EditProjetoPageModule {}
