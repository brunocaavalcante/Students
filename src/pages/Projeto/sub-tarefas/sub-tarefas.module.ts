import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubTarefasPage } from './sub-tarefas';

@NgModule({
  declarations: [
    SubTarefasPage,
  ],
  imports: [
    IonicPageModule.forChild(SubTarefasPage),
  ],
})
export class SubTarefasPageModule {}
