import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateConfirmPassword } from '../../validators/confirmPassword';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil-page.html'
})
export class PerfilPage {


  user;
  list: Observable<any>;
  disable: string;
  updateForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public formbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public usuario: UserProvider
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
      password: [null, [Validators.required, Validators.minLength(5)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(5), ValidateConfirmPassword]],
    })

    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.disable = "1";
  }

  ionViewDidLoad() {
    this.list = this.usuario.find(this.user.email);
    this.disable = "1";
  }

  ativeCad() {
    this.disable = "2";
  }

  //Botão submit enviando dados e criando um novo usuario no fire base
  submitForm() {
    this.usuario.update(this.user.uid, this.updateForm.value);
    this.presentAlert("Cadastro Atalizado", "Cadastro atualizado com sucesso!");
    this.disable = "1";
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


