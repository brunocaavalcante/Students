import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  messages: Observable<any>;
  destino;
  ref;
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
      this.messages = this.chats.getMessages(this.user.id, this.destino.id);
      this.messages.subscribe(itens => {
        if (itens.length === 0) {
          this.messages = this.chats.getMessages(this.destino.id, this.user.id);
          this.ref = this.destino.id + " - " + this.user.id;
        } else {
          this.ref = this.user.id + " - " + this.destino.id;
        }
      });
    });
  }

  sendMessage(newMessage: string): void {
    if (newMessage) {
      this.createChat(newMessage);
      var date = new Date();
      var time = date.getTime();
      let msg = { id_user: this.user.id, timestamp: time, msg: newMessage };
      this.chats.insertMessages(this.ref, msg);
    }
  }

  createChat(lastMessage) {
    var date = new Date();
    var time = date.getTime();
    let chat1 = { lastMessage: lastMessage, timestamp: time, nome: this.destino.nome, photo: '', id: this.destino.id }
    this.chats.insertChat(chat1, this.user.id, this.destino.id);
    let chat2 = { lastMessage: lastMessage, timestamp: time, nome: this.user.nome, photo: '', id: this.user.id }
    this.chats.insertChat(chat2, this.destino.id, this.user.id);
  }
}
