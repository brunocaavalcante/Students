import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatsProvider } from '../../../providers/chats/chats';
import { UserProvider } from '../../../providers/user/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChatsPage } from '../../chats/chats-page';

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
  msg;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  percent;
  id_foto = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public afth: AngularFireAuth,
    public chats: ChatsProvider,
    public usuario: UserProvider,
    public storage: AngularFireStorage,
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
      id: this.id_foto || id,
      nome: this.nome,
      url: this.img || '',
      tipo: 'grupo',
      lastMessage: ''
    }
    this.chats.insertGrup(grupo);
    this.participante.forEach(data => {
      this.usuario.find('email', data.email).subscribe(itens => {
        if (itens[0]) {
          this.chats.addUserToGroup(grupo, itens[0]);
        } else {
          this.presentAlert("Email não cadastro!", "Por favor solicitar que o email: " + data.email + ", faça o cadastro");
        }
      })
    });
    this.presentAlert('Grupo ' + grupo.nome + ' criado', '');
    this.navCtrl.setRoot(ChatsPage);
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

  uploadFile(event) {
    this.id_foto = this.afs.createId();
    const file = event.target.files[0];
    const filePath = 'grupos-chats/' + this.id_foto + "/" + file.name;
    const fileRef = this.storage.ref("grupos-chats").child(this.id_foto + '/' + file.name);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(itens => {
      this.percent = Math.round(itens);
    })
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(itens => {
          this.img = itens;
        });
      })
    )
      .subscribe()
    this.percent = null;
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
