import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Segment } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { TarefasProjetoPage } from '../tarefas-projeto/tarefas-projeto';
import { EditProjetoPage } from '../edit-projeto/edit-projeto';
import { DespesasPage } from '../despesas/despesas';



@IonicPage()
@Component({
  selector: 'page-tarefas',
  templateUrl: 'tarefas.html',
})
export class TarefasPage {

  tarefa;
  descricao;
  participantes = [];
  menssagens = [];
  id_projeto;
  p;
  adm: boolean;
  user;
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
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.projeto = this.navParams.get('projeto');
    this.getParticipantes();
  }

  ionViewDidLoad() {

    this.user = this.afAuth.auth.currentUser;//pega usuario logado
    this.segment.value = 'sobre';
    this.getParticipantes();
    this.closeMenu();
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

                if (items) { //atibuido participante ao vertor list
                  this.p = Object.keys(items).map(i => items[i]);
                  this.list[i] = ({
                    id_participante: this.p[0].id,
                    nome: this.p[0].nome,
                    sobrenome: this.p[0].sobrenome,
                    funcao: this.participantes[i].funcao,
                    desc_f: this.participantes[i].descricao_f,
                    email: this.participantes[i].id_participante,
                    faculdade: this.p[0].faculdade,
                    curso: this.p[0].curso,
                    adm: this.participantes[i].adm

                  });
                  if (this.user.email == this.list[i].email) { //descobrindo usuario local
                    this.adm = this.list[i].adm;
                  }
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
  }

  deleteParticipante(item) {

    if (item.adm) {
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
    } else {
      this.presentAlert("Operação Negada", "Somente administradores podem excluir participantes");
    }
  }

  finalizarProjeto(){
    console.log(this.projeto);
    this.db.database.ref('projetos/'+this.projeto.id).update({status:"inativo"});
  }

  insertParticipante(item) {

    //verifica se o participante esta cadastrado no sistema 
    this.db.database.ref('cadastro').orderByChild("email")
      .equalTo(item.email).once("value", snapshot => {
        const items = snapshot.val();

        if (items != null) {

          //Inseri participante no projeto
          this.list = Object.keys(items).map(i => items[i]);
          console.log(this.list);
          console.log(this.projeto);
          this.db.database.ref('projetos/').push({
            descricao: (this.projeto.descricao != null ? this.projeto.descricao : "Indefinido"),
            data_ini: (this.projeto.data_ini != null ? this.projeto.data_ini : "Indefinido"),
            data_fim: (this.projeto.data_fim != null ? this.projeto.data_fim : "Indefinido"),
            faculdade: (this.projeto.faculdade != null ? this.projeto.faculdade : "Indefinido"),
            campus: (this.projeto.campus != null ? this.projeto.campus : "Indefinido"),
            nome: (this.projeto.nome != null ? this.projeto.nome : "Indefinido"),
            id: this.projeto.id,
            id_participante: this.list[0].email,
            adm: "false",
            dono: this.projeto.dono,

          })

        } else {

          var id = this.db.database.ref('cadastro').push().key
          this.db.database.ref('cadastro/' + id).update({ // Cria pré cadastro
            email: item.email,
            id: id
          })
          this.db.database.ref('projetos').push({  //Insere no projeto
            descricao: (this.projeto.descricao != null ? this.projeto.descricao : "Indefinido"),
            data_ini: (this.projeto.data_ini != null ? this.projeto.data_ini : "Indefinido"),
            data_fim: (this.projeto.data_fim != null ? this.projeto.data_fim : "Indefinido"),
            faculdade: (this.projeto.faculdade != null ? this.projeto.faculdade : "Indefinido"),
            campus: (this.projeto.campus != null ? this.projeto.campus : "Indefinido"),
            nome: (this.projeto.nome != null ? this.projeto.nome : "Indefinido"),
            id: this.projeto.id,
            id_participante: item.email,
            dono: this.projeto.dono,

          })
        }
      });
    this.presentAlert("Participante adicionado", "");

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

  presentAddParticipante() {

    let alert = this.alertCtrl.create({
      title: 'Participante',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite o Email do Participante',
          type: 'email',
          value: ""
        },
        {
          name: 'funcao',
          placeholder: 'Função',
          type: 'text',
          value: ""
        },
        {
          name: 'descricao_f',
          label: 'Descreva a Função',
          placeholder: 'Descreva a Função',
          type: 'text',
          value: ""
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
          text: 'Adicionar',
          handler: data => {
            console.log(data);
            this.insertParticipante(data);

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

    this.navCtrl.push(TarefasProjetoPage, { p, participante });
  }

  goToEditProjeto() {
    var p = this.projeto;
    var participantes = this.list;
    this.navCtrl.push(EditProjetoPage, { p, participantes });
  }

  goToDespesas() {
    this.navCtrl.push(DespesasPage);
  }

}
