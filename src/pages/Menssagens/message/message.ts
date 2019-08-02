import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
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

  @ViewChild(Content) content: Content;
  messages: Observable<any>;
  destino;
  items = [];
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
    this.usuario.find('email', this.u.email).subscribe(item => {
      this.user = item[0];
      let doSubscription = () => {
        this.messages.subscribe(() => {
          this.scrollToBottom();
        });
      }
      if (this.destino.tipo == "grupo") {
        this.messages = this.chats.getMessagesGrupo(this.destino.id);
        doSubscription();
        this.OrdenarMessages(this.messages);
      } else {
        this.chats.getMessages(this.user.id, this.destino.id).subscribe(itens => {
          if (itens.length === 0) {
            this.messages = this.chats.getMessages(this.destino.id, this.user.id);
            this.ref = this.destino.id + " - " + this.user.id;
            doSubscription();
          } else {
            this.messages = this.chats.getMessages(this.user.id, this.destino.id);
            this.ref = this.user.id + " - " + this.destino.id;
            doSubscription();
          }
          this.OrdenarMessages(this.messages);
        });
      }     
    });
  }

  sendMessage(newMessage: string): void {
    var date = new Date();
    var time = date.getTime();
    let msg = {
      id_user: this.user.id,
      timestamp: time,
      msg: newMessage,
      nome: this.user.nome + " " + this.user.sobrenome
    };
    if (newMessage) {
      if (this.destino.tipo == "grupo") {
        this.ref = this.destino.id;
        this.chats.insertMessages(this.ref, msg);
      } else {
        this.createChat(newMessage);
        let msg = { id_user: this.user.id, timestamp: time, msg: newMessage };
        this.chats.insertMessages(this.ref, msg);
      }
      this.scrollToBottom();
    }
  }

  createChat(lastMessage) {
    var date = new Date();
    var time = date.getTime();
    console.log(this.destino);
    let chat1 = { lastMessage: lastMessage, timestamp: time, nome: this.destino.nome, photo: (this.destino.photo) || '', id: this.destino.id }
    this.chats.insertChat(chat1, this.user.id, this.destino.id);
    let chat2 = { lastMessage: lastMessage, timestamp: time, nome: this.user.nome, photo: (this.user.photo) || '', id: this.user.id }
    this.chats.insertChat(chat2, this.destino.id, this.user.id);
  }

  scrollToBottom(duration?: number): void { // A ? significa que o parametro é opcional
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 50);
  }

  OrdenarMessages(messages: Observable<any>) {
    messages.subscribe(itens => {
      itens.sort(function (x, y) {
        return x.timestamp - y.timestamp;
      });
      this.items = itens;
    });
  }

}
