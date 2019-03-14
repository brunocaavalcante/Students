import { Component } from '@angular/core';
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
    email: "",
    funcao: "",
    desc_f: ""
  }];
  listParticipante;
  id_projeto;
  newProjectForm: FormGroup;
  list;
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
    this.participante.splice(0, 1);

  }
  closeMenu() {
    this.menuCtrl.close();
  }
  goToProjetos() {
    this.navCtrl.push(TarefasPage);
  }
  createProjeto() {
    this.operacao = true;
    // criar projeto
    this.id_projeto = this.db.database.ref(this.uid).child('projetos').push(this.newProjectForm.value).key

    if (this.id_projeto != null) {
      // adiciona os participantes ao projeto
      this.participante.forEach(data => {
        this.db.database.ref(this.uid + '/projetos/' + this.id_projeto).child('participante').push({
          email: data.email,
          funcao: data.funcao,
          desc_funcao: data.desc_f
        })
      });

      this.presentAlert("Projeto Criado!", "Projeto criado com sucesso");
      this.operacao = false;
    }

  }
  addProjeto() {

    this.validaParticipante();
    this.id_projeto = this.db.database.ref('projetos').push({
      descricao: this.newProjectForm.get('descricao').value,
      data_ini: this.newProjectForm.get('data_ini').value,
      data_fim: this.newProjectForm.get('data_fim').value,
      faculdade: this.newProjectForm.get('faculdade').value,
      campus: this.newProjectForm.get('campus').value,
      nome: this.newProjectForm.get('name').value
    }).key;

    if (this.id_projeto != null) {
      this.presentAlert("" + this.newProjectForm.get('name').value, "Projeto criado com sucesso!");
    }


  }

  removeParticipante() {
    this.participante.splice(0, 1);
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
        {
          name: 'funcao',
          placeholder: 'Digite a função do participante',
          type: 'text'
        },
        {
          name: 'desc_f',
          placeholder: 'Digite a descrição da função do participante',
          type: 'text'
        },

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
            console.log(this.participante);
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

    let listDB = this.db.database.ref('cadastro')

    console.log(listDB);
    listDB.on('value', (snapshot) => { //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
      const items = snapshot.val(); //recebendo o valor da snapshot

      if (items != null) {
        this.participante.forEach(p => {


          if (p.email == items.val().email) {
            this.listParticipante = Object.keys(items).map(i => items[i]);
            console.log(this.listParticipante);

          } else {
            console.log("não tem");
            this.db.database.ref('cadastro').push({
              email: p.email,
            })
            this.afAuth.auth.createUserWithEmailAndPassword(p.email, "123456")
              .then(() => {
                console.log("Criado um pre cadastro");
              })
          }

        });
      }

    });


  }


}
