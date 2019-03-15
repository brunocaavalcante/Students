import { Component, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TarefasPage } from '../tarefas/tarefas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { identifierModuleUrl } from '@angular/compiler';
import { AngularFireDatabase } from '@angular/fire/database';
import { DeprecatedI18NPipesModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';


@IonicPage()
@Component({
  selector: 'page-projetos',
  templateUrl: 'projetos.html',
})
export class ProjetosPage {

  operacao = false;
  participante = [{
    id: "",
    email: ""
  }];
  listParticipante=[];
  id_participante;
  id_projeto;
  newProjectForm: FormGroup;
  list=[];
  uid;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public formbuilder: FormBuilder,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase) {

    this.operacao = false;
    //Validação dos campos
    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null],
      campus: [null],
      funcao: [null],
      email: [null],
      name: [null, [Validators.required, Validators.minLength(5)]],
    })
  }

  ionViewDidLoad() {

    this.participante.splice(0, 1);
    this.closeMenu();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  goToProjetos() {
    this.navCtrl.push(TarefasPage);
  }

  createProjeto() {
    this.operacao = true;
  }

  addProjeto() {

    this.validaParticipante();
    this.id_projeto = this.db.database.ref('projetos').push().key;

    for (let i = 0; i < this.participante.length; i++) {

      //this.id_participante = this.listParticipante[i].id
      console.log(this.listParticipante[i].values);

      this.db.database.ref('projetos/' + this.id_projeto).push({

        descricao: this.newProjectForm.get('descricao').value,
        data_ini: this.newProjectForm.get('data_ini').value,
        data_fim: this.newProjectForm.get('data_fim').value,
        faculdade: this.newProjectForm.get('faculdade').value,
        campus: this.newProjectForm.get('campus').value,
        nome: this.newProjectForm.get('name').value,
        id: this.id_projeto,
        id_participante: this.id_participante
      });
    }
    if (this.id_projeto != null) {
      this.presentAlert("" + this.newProjectForm.get('name').value, "Projeto criado com sucesso!");
    }

  }

  removeParticipante() {
    this.participante.pop();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o Email do Participante',
          type: 'email'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
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

  //Função para apresenta alertas
  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  validaParticipante() {

    for (let i = 0; i < this.participante.length; i++) {

      this.db.database.ref("cadastro").orderByChild("email")
        .equalTo(this.participante[i].email).once("value", snapshot => {
          const items = snapshot.val();

          if (items != null) {
            //Se existir cadastro
            this.list = Object.keys(items).map(i => items[i]);

            this.list.forEach(data => {
              this.listParticipante.push(data);
            });

          } else {
            //Se não existir cadastro criamos um pre cadastro para o usuario
            this.listParticipante.push(this.db.database.ref('cadastro').push({
              email: this.participante[i].email,
            }).key)
            this.afAuth.auth.createUserWithEmailAndPassword(this.participante[i].email, "123456");

          }
        })
    }
  }

}
