import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TarefasProjetoPage } from './tarefas-projeto';

@NgModule({
  declarations: [
    TarefasProjetoPage,
  ],
  imports: [
    IonicPageModule.forChild(TarefasProjetoPage),
  ],
})
export class TarefasProjetoPageModule {}
