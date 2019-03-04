import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';


@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;//Variavel criada para validação dos campos

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder:FormBuilder,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController) {

      this.loginForm = this.formbuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]]
      })
  }

  submitLogin(){
    this.afAuth.auth.signInWithEmailAndPassword(
      this.loginForm.value.email, this.loginForm.value.password)
      .then((response) => {
        console.log(response);
        this.presentAlert('Usuário autenticado', '');
        this.navCtrl.setRoot(TabsControllerPage);
      })
      .catch((error) => {
        if(error.code == 'auth/wrong-password') {//Erro de senha invalida
          this.presentAlert('Erro', 'Senha incorreta, digite novamente.');//Alerta apresentado
          this.loginForm.controls['password'].setValue(null);//Lipando o campo de senha
        }
        if(error.code == 'auth/user-not-found') {
          this.presentAlert('Erro', 'Email incorreto, digite novamente.');
          this.loginForm.controls['password'].setValue(null);
        }
      })
  }

  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

 

}
