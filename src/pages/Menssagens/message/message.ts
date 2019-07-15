import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';
import { AngularFirestore } from '@angular/fire/firestore';


@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  messages: string[] = [];
  destino;
  u;
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public usuario: UserProvider,
    public afth: AngularFireAuth,
    public chats: ChatsProvider,
    public afs: AngularFirestore) {

    this.destino = this.navParams.get('item');
    this.u = this.afth.auth.currentUser;
    this.usuario.find(this.u.email).subscribe(item => {
      this.user = item[0];
    })
  }

  sendMessage(newMessage: string): void {
    this.messages.push(newMessage);
    this.createChat(newMessage);
  }

  createChat(lastMessage) {
    this.chats.find(this.user.id, this.destino.id).subscribe(itens => {
      if (itens.length == 0) {
        var date = new Date();
        var time = date.getTime();
        let chat1 = { lastMessage: lastMessage, timestamp: time, title: this.destino.nome, photo: '' }
        this.chats.insert(chat1, this.user.id, this.destino.id);
        let chat2 = { lastMessage: lastMessage, timestamp: time, title: this.user.nome, photo: '' }
        this.chats.insert(chat2, this.destino.id, this.user.id);
      }
    });
  }
}
