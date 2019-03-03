import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidateConfirmPassword } from '../../validators/confirmPassword';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';



@IonicPage()
@Component({
  selector: 'page-cadastro-user',
  templateUrl: 'cadastro-user.html',
})
export class CadastroUserPage {

  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController
    ) {

      //Validação dos campos
      this.registerForm = this.formbuilder.group({
        name:[null,[Validators.required,Validators.minLength(5)]],
        email:[null,[Validators.required,Validators.email]],
        password:[null,[Validators.required,Validators.minLength(5)]],
        confirmPassword:[null,[Validators.required,Validators.minLength(5),ValidateConfirmPassword]],
      })
  }
//Botão submit enviando dados e criando um novo usuario no fire base
  submitForm(){
    this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.value.email,this.registerForm.value.password)
    .then((response) => {
        this.presentAlert("Úsuario cadastrado",'Usuário cadastrado com sucesso.'); //Alerta de usuario criado com sucesso
        this.navCtrl.setRoot(TabsControllerPage);// Redirecionamento para page principal do app
        
    })
    .catch((error)=>{
      if(error.code == 'auth/email-already-in-use') { //Erro gerado pelo fire base quando criamos contas com email ja existentes
        this.presentAlert('Erro', 'E-mail já cadastrado');
      }
      console.log(error);
    })
    
  }

  //Função de alerta
  presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

 

}
