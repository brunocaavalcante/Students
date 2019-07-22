import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil-page.html'
})
export class PerfilPage {

  filePhoto: File;
  user;
  list: Observable<any>;
  disable: string;
  updateForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public formbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public usuario: UserProvider,
    public storage: AngularFireStorage
  ) {
    this.updateForm = this.formbuilder.group({
      sobrenome: [null, [Validators.required, Validators.minLength(3)]],
      semestre: [null],
      data_nasc: [null],
      faculdade: [null],
      campus: [null],
      situacao: [null],
      curso: [null],
      sexo: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
    })

    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.disable = "1";
  }

  ionViewDidLoad() {
    this.list = this.usuario.find(this.user.email);
    this.disable = "1";
  }

  //Botão submit enviando dados e criando um novo usuario no fire base
  submitForm() {
    this.usuario.update(this.user.uid, this.updateForm.value);
    this.presentAlert("Cadastro Atalizado", "Cadastro atualizado com sucesso!");
    this.disable = "1";
  }

  onPhoto(event):void{
    this.filePhoto = event.target.files[0];
  }

  openGalery(file:File):any {
    this.storage.ref('/users/'+this.user.uid).put(file);
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


