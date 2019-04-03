import { Component, ɵConsole, Query } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TarefasPage } from '../myProjeto/tarefas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
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
  listProjetos =[];
  id_projeto;
  newProjectForm: FormGroup;
  list;
  user;
  delete;
  pj;
  uemail;



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
      name: [null, [Validators.required, Validators.minLength(5)]],
    })
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.getProjetos();
  }

  ionViewDidLoad() {
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.getProjetos();
    this.closeMenu();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  goToProjetos(item) {

    var projeto = {
      nome: item.nome,
      descricao: item.descricao,
      data_ini: item.data_ini,
      data_fim: item.data_fim,
      faculdade: item.faculdade,
      id: item.id,
      adm: item.adm,
      campus: item.campus,
      dono: item.dono,
      id_participante:item.id_participante
    }

    this.navCtrl.push(TarefasPage, { projeto });
  }

  createProjeto() {

    this.id_projeto = this.db.database.ref('projetos').push().key// criar projeto
    this.participante.push({ id: "", email: this.user.email });
    //verifica se o participante esta cadastrado no sistema 
    if (this.id_projeto != null) {
      for (let i = 1; i < this.participante.length; i++) {


        this.db.database.ref('cadastro').orderByChild("email")
          .equalTo(this.participante[i].email).once("value", snapshot => {
            const items = snapshot.val();

            if (items != null) {

              //Inseri participante no projeto
              this.list = Object.keys(items).map(i => items[i]);

              this.db.database.ref('projetos/').push({
                descricao: this.newProjectForm.get('descricao').value,
                data_ini: this.newProjectForm.get('data_ini').value,
                data_fim: this.newProjectForm.get('data_fim').value,
                faculdade: this.newProjectForm.get('faculdade').value,
                campus: this.newProjectForm.get('campus').value,
                name: this.newProjectForm.get('name').value,
                id: this.id_projeto,
                id_participante: this.list[0].email,
                dono: this.user.email,
                adm:(this.list[0].email == this.user.email?"true":"false")

              })

            } else {
              var id = this.db.database.ref('cadastro').push().key
              this.db.database.ref('cadastro/' + id).update({ // Cria pré cadastro
                email: this.participante[i].email,
                id: id
              })
              this.db.database.ref('projetos/').push({  //Insere no projeto
                descricao: this.newProjectForm.get('descricao').value,
                data_ini: this.newProjectForm.get('data_ini').value,
                data_fim: this.newProjectForm.get('data_fim').value,
                faculdade: this.newProjectForm.get('faculdade').value,
                campus: this.newProjectForm.get('campus').value,
                name: this.newProjectForm.get('name').value,
                id: this.id_projeto,
                id_participante: this.participante[i].email,
                adm:"false"
              })
            }
          });
      }
    }
    this.presentAlert("Projeto " + this.newProjectForm.get('name').value, "Projeto criado com sucesso");
    this.operacao = false;
    var rm = this.db.database.ref('projetos/' + this.id_projeto);
    rm.remove();
  }

  removeProjeto(id: string) {

    this.db.database.ref('projetos').orderByChild("id")
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(item => {
          var rv = this.db.database.ref('projetos/' + item.key);
          rv.remove();
        });

      })
    this.presentAlert("Projeto removido com sucesso", "");

  }

  getProjetos() {

    this.db.database.ref('projetos').orderByChild("id_participante")
      .equalTo(this.user.email).on("value", snapshot => {
        var items = snapshot.val();

        if (items) {
          var list = Object.keys(items).map(i => items[i]);

          for (let i = 0; i < list.length; i++) {
            this.listProjetos[i] = list[i];
          }
        }
      });
  }

  addProjeto() {
    this.operacao = true;
  }

  removeParticipante() {
    this.participante.pop();
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

  presentShowConfirm(id) {

    const alert = this.alertCtrl.create({
      title: "Atenção deseja excluir o projeto?",
      message: "A exclusão será permanente",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;;
          }
        },
        {
          text: 'Excluir',
          role: 'excluir',
          handler: () => {
            this.removeProjeto(id);
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss((data) => {
      this.delete = data;
    });
  }


}
