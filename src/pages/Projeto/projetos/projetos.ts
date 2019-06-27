import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MyProjetoPage } from '../myProjeto/my-projeto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserProvider } from '../../../providers/user/user';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';

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
  id_projeto;
  newProjectForm: FormGroup;
  user;
  list = [];
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  items: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    public usuario: UserProvider,
    public projeto: ProjetoProvider
  ) {

    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.operacao = false;
    this.items = this.projeto.get(this.user.email);
    //Validação dos campos
    this.newProjectForm = this.formbuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      data_ini: [null],
      data_fim: [null],
      faculdade: [null, [Validators.required]],
      campus: [null, [Validators.required]],
      funcao: [null, [Validators.required]],
      nome: [null, [Validators.required, Validators.minLength(5)]],
    })
  }

  ionViewDidLoad() {
    this.items = this.projeto.get(this.user.email);
  }

  createProjeto() {

    this.id_projeto = this.db.database.ref('projetos').push().key// criar projeto
    this.participante.push({ id: "", email: this.user.email });
    //verifica se o participante esta cadastrado no sistema 
    if (this.id_projeto != null) {

      for (let i = 1; i < this.participante.length; i++) {

        var pj = {
          descricao: this.newProjectForm.get('descricao').value,
          data_ini: this.newProjectForm.get('data_ini').value,
          data_fim: this.newProjectForm.get('data_fim').value,
          faculdade: this.newProjectForm.get('faculdade').value,
          campus: this.newProjectForm.get('campus').value,
          nome: this.newProjectForm.get('nome').value,
          id: this.id_projeto,
          id_participante: this.participante[i].email,
          situacao: "ativo",
          dono: this.user.email,
          adm: (this.participante[i].email == this.user.email ? true : false),
          status: 0
        };
        this.projeto.insert(pj);
      }
    }
    this.presentAlert("Projeto " + this.newProjectForm.get('nome').value, "Projeto criado com sucesso");
    this.operacao = false;
    var rm = this.db.database.ref('projetos/' + this.id_projeto);
    rm.remove();
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
      id_participante: item.id_participante
    }

    this.navCtrl.push(MyProjetoPage, { projeto });
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

  presentShowConfirm(pj) {

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
            this.projeto.delete(pj);
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
