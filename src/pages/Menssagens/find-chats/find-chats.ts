import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs';
import { ChatsProvider } from '../../../providers/chats/chats';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessagePage } from '../message/message';


@IonicPage()
@Component({
  selector: 'page-find-chats',
  templateUrl: 'find-chats.html',
})
export class FindChatsPage {
  filter;
  users: Observable<any>;
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public usuario: UserProvider,
    public chats: ChatsProvider,
    public auth: AngularFireAuth,
    public alertCtrl: AlertController) {

    this.filter = this.navParams.get('p');
    this.user = this.auth.auth.currentUser;
    this.findUsers();
  }

  public findUsers() {
    this.users = this.usuario.listCondicion(this.filter);
  }

  public addContato(user) {
    this.chats.addContato(this.user.uid, user);
    this.presentAlert('', 'Usuario adicionado!');
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  public presentPrompt(user) {
    let alert = this.alertCtrl.create({
      title: 'Adicionar contato',
      subTitle: "Deseja adicionar esse usuario a sua lista de contato?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.addContato(user);
          }
        }
      ]
    });
    alert.present();
  }

  public goToMessage(user){
    var item = user;
    this.navCtrl.push(MessagePage,{item});
  }

  ionViewDidLoad() {
  }

}
