import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';
import { UserProvider } from '../../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';



@IonicPage()
@Component({
  selector: 'page-new-grup-message',
  templateUrl: 'new-grup-message.html',
})
export class NewGrupMessagePage {

  participante = [];
  nome;
  img;
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public afth: AngularFireAuth,
    public chats: ChatsProvider,
    public usuario: UserProvider,
    public afs: AngularFirestore
  ) {
    this.user = this.afth.auth.currentUser;
  }

  ionViewDidLoad() {
  }

  createGrupo() {
    this.participante.push({ email: this.user.email });
    const id = this.afs.createId();
    let grupo = {
      id:id,
      nome: this.nome,
      url: this.img || ''
    }
    this.participante.forEach(data => {
      this.usuario.find('email', data.email).subscribe(itens => {
        this.chats.addUserToGroup(grupo,itens[0].id);
      })
    });
    this.chats.insertGrup(grupo);
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
