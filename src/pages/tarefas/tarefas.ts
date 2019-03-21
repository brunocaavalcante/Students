import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding, Segment } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { TarefasProjetoPage } from '../tarefas-projeto/tarefas-projeto';
import { ProjetosPage } from '../projetos/projetos';


@IonicPage()
@Component({
  selector: 'page-tarefas',
  templateUrl: 'tarefas.html',
})
export class TarefasPage {

  uid: string;
  tarefa;
  descricao;
  participantes = [];
  p;
  porcent;
  list = [];
  projeto;
  id;
  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,//Variavel banco de dados local do app sqlite
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth

  ) {
    this.projeto = this.navParams.get('projeto');
  }

  ionViewDidLoad() {

    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.segment.value = 'sobre';
    this.getParticipantes();
    this.closeMenu();

  }


  addTarefa(tarefa, descricao, porcent: string) {
    this.db.database.ref(this.uid).child('tarefas').push({
      tarefa: tarefa,
      descricao: descricao,
      porcent: porcent
    })
      .then(() => {
        this.presentAlert("Tarefa Cadastrada", "");
        this.limpar();
      })
  }

  getParticipantes() {

    //Pegando email de participantes do projeto
    this.db.database.ref('projetos').orderByChild('id')
      .equalTo(this.projeto.id).on("value", snapshot => {
        var item = snapshot.val();
        if (item) {
          this.participantes = Object.keys(item).map(i => item[i]);

          //Pegando os dados dos participantes
          for (let i = 0; i < this.participantes.length; i++) {

            this.db.database.ref('cadastro').orderByChild('email')
              .equalTo(this.participantes[i].id_participante).once("value", snapshot => {
                const items = snapshot.val();

                if (items) {
                  this.p = Object.keys(items).map(i => items[i]);
                  this.list.push({
                    id_participante: this.p[0].id,
                    nome: this.p[0].nome,
                    funcao: this.participantes[i].funcao,
                    desc_f: this.participantes[i].descricao_f,
                    email: this.participantes[i].id_participante,
                    faculdade: this.p[0].faculdade,
                    curso: this.p[0].curso
                  });
                }
              });
          }
        } else {
          console.log("Sem participantes");
        }
      })
  }

  updateParticipante(item) {

    this.db.database.ref('projetos').orderByChild("id").
      equalTo(this.projeto.id).once("value", snapshot => {
        snapshot.forEach(childSnapshot => {

          var email = childSnapshot.val().id_participante

          if (item.id_participante == email) {
            var id = childSnapshot.key;
            this.db.database.ref('projetos/' + id).update({
              id_participante: item.id_participante,
              descricao_f: item.descricao_f,
              funcao: item.funcao
            });
          }
        });
      });

    this.navCtrl.push(ProjetosPage);
  }

  deleteParticipante(item) {

    this.db.database.ref('projetos').orderByChild("id").
      equalTo(this.projeto.id).on("value", snapshot => {

        snapshot.forEach(childSnapshot => {

          var email = childSnapshot.val().id_participante

          if (item.email == email) {
            var id = childSnapshot.key; //pega a chave do filho
            var rv = this.db.database.ref('projetos/' + id);//referencia 
            rv.remove();
          }
        });
      });
    this.navCtrl.push(ProjetosPage);
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

  limpar() {

  }

  presentPrompt(item) {

    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'id_participante',
          placeholder: 'Digite o Email do Participante',
          type: 'email',
          value: item.email
        },
        {
          name: 'funcao',
          placeholder: 'Função',
          type: 'text',
          value: item.funcao
        },
        {
          name: 'descricao_f',
          placeholder: 'Descreva a Função',
          type: 'text',
          value: item.desc_f
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
          text: 'Alterar',
          handler: data => {
            this.updateParticipante(data);

          }
        }
      ]
    });
    alert.present();
  }

  presentShowConfirm(item) {

    const alert = this.alertCtrl.create({
      title: "Excluir o Participante",
      message: "Deseja realmente excluir o participante do projeto?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Excluir',
          role: 'excluir',
          handler: () => {
            this.deleteParticipante(item);
          }
        }
      ]
    });
    alert.present();
  }

  //Fução fecha menu lateral do app
  closeMenu() {
    this.menuCtrl.close();
  }

  goToTarefas(participante) {
    var p = this.projeto;
    
    this.navCtrl.push(TarefasProjetoPage, { p,participante });
  }

}
