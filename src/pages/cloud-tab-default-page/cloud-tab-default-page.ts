import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
    public formbuilder: FormBuilder
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
      name: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(5), ValidateConfirmPassword]],
    })
    this.getUser();
  }

  getUser() {
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    let listDB = this.db.database.ref(this.uid).child("cadastro");

    listDB.on('value', (snapshot) => { //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
      const items = snapshot.val(); //recebendo o valor da snapshot

      if (items) { //verificando se existe items
        this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
      }
    })

  }
  ionViewCanEnter() {

    this.disable = "1";
    this.getUser();
  }

  ativeCad() {
    this.disable = "2";
  }

  //Botão submit enviando dados e criando um novo usuario no fire base
  submitForm() {

    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;

    // Get a key for a new Post.
    var newUser = this.db.database.ref('user').child(this.uid);

    // Write the new post's data simultaneously in the posts list and the user's post list.
  
    var updates = {};
    updates['https://fir-login-7c5c5.firebaseio.com/user/' + this.uid  + newUser] = this.updateForm.value;


    return this.db.database.ref().update(updates);
  }
}


