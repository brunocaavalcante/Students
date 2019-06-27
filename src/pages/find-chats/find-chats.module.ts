import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindChatsPage } from './find-chats';

@NgModule({
  declarations: [
    FindChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(FindChatsPage),
  ],
})
export class FindChatsPageModule {}
