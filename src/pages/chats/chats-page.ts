import { Component, ViewChild } from '@angular/core';
import { NavController, Segment } from 'ionic-angular';
import { ChatPage } from '../Menssagens/chat/chat';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats-page.html'
})
export class ChatsPage {

  @ViewChild(Segment) segment: Segment;

  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    this.segment.value = 'conversas';
  }

  goToChat() {
    this.navCtrl.push(ChatPage);
  }


}
