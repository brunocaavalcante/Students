import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateConfirmPassword } from '../../validators/confirmPassword';

@Component({
  selector: 'page-cloud-tab-default-page',
  templateUrl: 'cloud-tab-default-page.html'
})
export class CloudTabDefaultPagePage {

  uid: string;
  list;
  disable: string;
  updateForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public formbuilder: FormBuilder,
    public alertCtrl: AlertController
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
      nome: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(5), ValidateConfirmPassword]],
    })
    this.getUser();
  }

  getUser() {

    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.db.database.ref('cadastro').orderByChild('id')
      .equalTo(this.uid).on("value", snapshot => {
        const items = snapshot.val();
        if (items) { //verificando se existe items
          this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
          console.log(this.list);
        }
      })
  }

  ionViewCanEnter() {

    this.disable = "1";
    this.getUser();
  }

  ionViewDidLoad() {
    this.getUser();
  }

  ativeCad() {
    this.disable = "2";
  }

  //Botão submit enviando dados e criando um novo usuario no fire base
  submitForm() {

    this.db.database.ref('cadastro').orderByChild('id')
      .equalTo(this.uid).once("value", snapshot => {
        snapshot.forEach(data => {

          var id = data.key;
          this.db.database.ref('cadastro/' + id).update(this.updateForm.value);
        });
      })
      this.presentAlert("Cadastro Atalizado","Cadastro atualizado com sucesso!");
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


