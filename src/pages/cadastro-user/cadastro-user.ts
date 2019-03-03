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

      this.registerForm = this.formbuilder.group({
        name:[null,[Validators.required,Validators.minLength(5)]],
        email:[null,[Validators.required,Validators.email]],
        password:[null,[Validators.required,Validators.minLength(5)]],
        confirmPassword:[null,[Validators.required,Validators.minLength(5),ValidateConfirmPassword]],
      })
  }

  submitForm(){
    this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.value.email,this.registerForm.value.password)
    .then((response) => {
        this.presentAlert("Úsuario cadastrado",'Usuário cadastrado com sucesso.');
        this.navCtrl.setRoot(TabsControllerPage);
        
    })
    .catch((error)=>{
      console.log("deu erro",error);
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

 

}
