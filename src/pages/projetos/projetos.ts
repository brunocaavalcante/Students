import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TarefasPage } from '../tarefas/tarefas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase} from '@angular/fire/database';



@IonicPage()
@Component({
  selector: 'page-projetos',
  templateUrl: 'projetos.html',
})
export class ProjetosPage {

  operacao = false;
  uid;
  id_projeto;
  list;
  
  participante = [{
    email: "",
    funcao: "",
    desc_f: ""
  }];
  newProjectForm: FormGroup;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public formbuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public alertCtrl: AlertController) {
     
    this.operacao = false;
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.getProjeto();
    //Validação dos campos
    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null],
      name: [null, [Validators.required, Validators.minLength(5)]],
    })
  }

  ionViewDidLoad() {
    console.log(this.list);
    this.closeMenu();
    this.participante.splice(0, 1);

  }
  closeMenu() {
    this.menuCtrl.close();
  }
  goToProjetos() {
    this.navCtrl.push(TarefasPage);
  }

  addParticipante() {
    this.presentPrompt();

  }
  removeParticipante() {
    this.participante.splice(0, 1);
  }
  createProjeto() {
    this.operacao = true;
  }

  addProjeto() {
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

  getProjeto() {

    let listDB = this.db.database.ref(this.uid).child('projetos');

    listDB.on('value', (snapshot)=> { //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
          const items = snapshot.val();
          if(items){ //verificando se existe items
            this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
            console.log(this.list);
          }
        }); 
  }

  //Alerta de Inputs
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o email do participante'
        },
        {
          name: 'funcao',
          placeholder: 'Digite a Função',
          type: 'text'
        },
        {
          name: 'desc_f',
          placeholder: 'Descreva a Função',
          type: 'text',

        },
        {
          name: 'radio1',
          label: "teste",
          type: 'checkbox'

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


}
