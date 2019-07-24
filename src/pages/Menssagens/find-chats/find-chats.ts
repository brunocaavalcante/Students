import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs';
import { MessagePage } from '../message/message';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';



@IonicPage()
@Component({
  selector: 'page-find-chats',
  templateUrl: 'find-chats.html',
})
export class FindChatsPage {
  condicao;
  user;
  users: Observable<any>;
  itens = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private usuario: UserProvider,
    private chats: ChatsProvider,
    public afth: AngularFireAuth
  ) {
    this.user = this.afth.auth.currentUser
  }

  ionViewDidLoad() {
    this.condicao = this.navParams.get('p');
    this.get();
  }

  public get() {
    this.usuario.listCondicion(this.condicao).subscribe(itens => {
      itens.forEach(item => {
        if (item.id != this.user.uid) {
          this.itens.push(item);
          console.log(itens);
        }
      });
    })
  }

  addContact(item) {
    console.log(item);
   this.chats.addContato(this.user.uid, item);
    this.presentAlert("Usuario adicionado!", "Usuario adicionado a sua lista de contatos");

  }

  presentShowConfirm(item) {
    const alert = this.alertCtrl.create({
      title: "Adicionar aos contatos:",
      message: "Deseja adicionar este usuario a sua lista de contatos?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;;
          }
        },
        {
          text: 'Adicionar',
          role: 'adicionar',
          handler: () => {
            this.addContact(item);
          }
        }
      ]
    });
    alert.present();
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  goToMessage(item) {
    this.navCtrl.push(MessagePage, { item });
  }


}
