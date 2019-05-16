import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { SubTarefasPage } from '../sub-tarefas/sub-tarefas';



@IonicPage()
@Component({
  selector: 'page-tarefas-projeto',
  templateUrl: 'tarefas-projeto.html',

})
export class TarefasProjetoPage {

  uid: string;
  tarefa;
  descricao;
  participante;
  id_dono;
  list = [];
  subTarefas = [];
  projeto;
  check: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth) {

    this.projeto = this.navParams.get('p');
    this.participante = this.navParams.get('participante');
  }

  ionViewDidLoad() {
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.getTarefa();
  }

  addTarefa(descricao, tarefa, status) {
    var id = this.db.database.ref('tarefas').push().key;
    this.db.database.ref('tarefas/' + id).update({

      tarefa: tarefa,
      descricao: descricao,
      status: status,
      id: id,
      data: this.getData(),
      observacao: "",
      qtd_sub: 0,
      qtd_sub_ok: 0,
      id_projeto: this.projeto.id,
      id_criador: this.projeto.dono,
      id_participante: this.participante.id_participante

    })
      .then(() => {
        this.presentAlert("Tarefa Cadastrada", "");
        this.tarefa = "";
        this.descricao = "";
        this.ionViewDidLoad();
      })
  }

  getTarefa() {

    this.db.database.ref('tarefas').orderByChild('id_projeto') //Pega tarefas
      .equalTo(this.projeto.id).on("value", snapshot => {
        if (snapshot) {
          let i = 0;

          snapshot.forEach(data => {
            if (data.val().id_participante == this.participante.id_participante) { //verificando participante
              this.list[i] = data.val();
              i++;
            }
          });
        } else {
          console.log("não tem tarefas");
        }
      });
  }

  getData() {

    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
  }

  deleteTarefa(tarefa) {

    this.db.database.ref('tarefas/' + tarefa.id).once("value", snapshot => {
      var rm_tarefa = this.db.database.ref('tarefas/' + tarefa.id);

      this.db.database.ref('subTarefas').orderByChild('id_tarefa').
        equalTo(tarefa.id).on("value", snapshot => {
          snapshot.forEach(data => {
            var rm = this.db.database.ref('subTarefa/' + data.key);
            rm.remove();
          });
        })
      rm_tarefa.remove();
      this.list.pop();
    });
    this.presentAlert("Tarefa excluida com sucesso!", "");

  }


  goToSubTarefas(item) {
    this.navCtrl.push(SubTarefasPage, { item });
  }

  updateCheck(item) {
    this.check = item.checked;
    this.db.database.ref('tarefas/' + item.id).update({ checked: this.check });
  }

  presentPrompt(item) {

    let alert = this.alertCtrl.create({
      title: 'SubTarefa',
      inputs: [
        {
          name: 'id_subTarefa',
          placeholder: 'Digite a descrição da sub-tarefa',
          type: 'text'
        }
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
            // this.addSubTarefa(item, data);
          }
        }
      ]
    });
    alert.present();
  }


  presentShowConfirm(item) {

    const alert = this.alertCtrl.create({
      title: "Excluir a Terefa?",
      message: "",
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
            this.deleteTarefa(item);
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
