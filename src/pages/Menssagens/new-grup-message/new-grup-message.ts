import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';



@IonicPage()
@Component({
  selector: 'page-new-grup-message',
  templateUrl: 'new-grup-message.html',
})
export class NewGrupMessagePage {

  participante = [];
  nome;
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public afth: AngularFireAuth,
    public chats: ChatsProvider
  ) {
    this.user = this.afth.auth.currentUser;
  }

  ionViewDidLoad() {
  }

  createGrupo(){
    console.log(this.nome,this.participante);
    this.chats.createGroup(this.user.uid);
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o Email do Participante',
          type: 'email'
        },

      ],
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
            this.participante.push(data);
          }
        }
      ]
    });
    alert.present();
  }

  removeParticipante() {
    this.participante.pop()
  }

}
