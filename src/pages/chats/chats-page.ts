import { Component, ViewChild } from '@angular/core';
import { NavController, Segment } from 'ionic-angular';
import { FindChatsPage } from '../Menssagens/find-chats/find-chats';
import { MessagePage } from '../Menssagens/message/message';
import { UserProvider } from '../../providers/user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../providers/chats/chats';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats-page.html'
})

export class ChatsPage {

  campus;
  faculdade;
  curso;
  mostrar = true;
  sexo;
  user;
  contacts: Observable<any>;
  messages: Observable<any>;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public usuario: UserProvider,
    public chats: ChatsProvider,
    public afth: AngularFireAuth) {
    this.user = this.afth.auth.currentUser;
    this.getMessages();
    this.getContato();
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
      sexo: this.sexo == "todos" ? "" : this.sexo
    }
    this.navCtrl.push(FindChatsPage, { p });
  }

  getMessages() {
    this.messages = this.chats.chatsUser(this.user.uid);
  }

  getContato() {
    this.contacts = this.chats.getContatos(this.user.uid);
  }

  limpar() {
    this.campus = "";
    this.curso = "";
    this.faculdade = "";
    this.sexo = "";
  }

  searchbar(item) {
    this.mostrar = item;
  }

  fliterItems(event: any): void {
    let filter: string = event.target.value;
    filter = filter.charAt(0).toUpperCase() + filter.slice(1);//Transforma a primeira letra em maiuscula
    this.startAt.next(filter);
    this.endAt.next(filter + "\uf8ff");
    let ref: string;
    if (filter) {
      switch ("" + this.segment) {

        case 'contatos': {
          ref = 'chats/' + this.user.uid + "/contatos";
          Observable.combineLatest(this.startobs, this.endobs).subscribe(item => {
            this.contacts = this.chats.filter(ref, 'nome', item[0], item[1]);
          });
          break;
        }

        case 'conversas': {
          ref = 'chats/' + this.user.uid + "/messages";
          Observable.combineLatest(this.startobs, this.endobs).subscribe(item => {
            this.messages = this.chats.filter(ref, 'nome', item[0], item[1]);
          });
          break;
        }
      }
    }
  }


}
