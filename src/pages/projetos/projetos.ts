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
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { Observable } from 'rxjs';


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
  listParticipante = [];
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
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  goToProjetos() {
    this.navCtrl.push(TarefasPage);
  }

  createProjeto() {

    // criar projeto
    this.id_projeto = this.db.database.ref('projetos').push(this.newProjectForm.value).key

    //verifica se o participante esta cadastrado no sistema 
    if (this.id_projeto != null) {
      for (let i = 0; i < this.participante.length; i++) {

        this.db.database.ref('cadastro').orderByChild("email")
          .equalTo(this.participante[i].email).once("value", snapshot => {
            const items = snapshot.val();

            if (items != null) {
              //Inseri participante no projeto
              this.list = Object.keys(items).map(i => items[i]);
              this.db.database.ref('/projetos/' + this.id_projeto).child('participante').push({
                id: this.list[0].email
              })

            } else {
              this.db.database.ref('cadastro').push({
                email: this.participante[i].email,
                nome: "temp",
                id: "temp",
                campus: "."
              })
              this.db.database.ref('/projetos/' + this.id_projeto).child('participante').push({
                id: this.participante[i].email
              })
              this.afAuth.auth.createUserWithEmailAndPassword(this.participante[i].email, "123456")
                .then(() => {
                  this.presentAlert("Criado um pré cadastro para o Usuario", "" + this.participante[i].email);
                })
            }
          });
      }
    }
    this.navCtrl.push(TabsControllerPage);
    this.presentAlert("Projeto " + this.newProjectForm.get('name').value, "Projeto criado com sucesso");
    this.operacao = false;
  }

  addProjeto() {
    this.operacao = true;
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
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

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
