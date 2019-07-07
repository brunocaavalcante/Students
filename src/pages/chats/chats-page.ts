import { Component, ViewChild } from '@angular/core';
import { NavController, Segment } from 'ionic-angular';
import { FindChatsPage } from '../Menssagens/find-chats/find-chats';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats-page.html'
})

export class ChatsPage {
campus;
faculdade;
cursos;
sexo;
  @ViewChild(Segment) segment: Segment;

  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    this.segment.value = 'conversas';
  }

  goToChat() {

  }
  goToFindChats() {
   var p = {
    campus:this.campus,
    faculdade: this.faculdade,
    cursos:this.cursos,
    sexo:this.sexo
   }
    this.navCtrl.push(FindChatsPage,{p});
  }


}
