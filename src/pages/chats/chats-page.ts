import { Component, ViewChild } from '@angular/core';
import { NavController, Segment } from 'ionic-angular';
import { FindChatsPage } from '../Menssagens/find-chats/find-chats';
import { MessagePage } from '../Menssagens/message/message';
import { UserProvider } from '../../providers/user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../providers/chats/chats';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats-page.html'
})

export class ChatsPage {
  campus;
  faculdade;
  curso;
  sexo;
  user;
  contacts: Observable<any>;
  messages: Observable<any>;
  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public usuario: UserProvider,
    public chats: ChatsProvider,
    public afth: AngularFireAuth) {
    this.user = this.afth.auth.currentUser;
    this.getMessages();
    this.getContatos();
  }
  ionViewDidLoad() {
    this.segment.value = 'conversas';
  }

  goToMessage(item) {
    this.navCtrl.push(MessagePage, { item });
  }

  goToFindChats() {
    var p = {
      campus: this.campus,
      faculdade: this.faculdade,
      curso: this.curso,
      sexo: this.sexo=="todos"?"":this.sexo
    }
    this.navCtrl.push(FindChatsPage, { p });
  }

  getMessages() {
    this.messages = this.chats.chatsUser(this.user.uid);  
  }


  getContatos(){
    this.contacts = this.chats.getContatos(this.user.uid);
  }

  limpar() {
    this.campus = "";
    this.curso = "";
    this.faculdade = "";
    this.sexo = "";
  }


}
