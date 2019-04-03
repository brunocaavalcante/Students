import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';



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
    console.log(this.list);
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
      id_projeto: this.projeto.id,
      id_criador: this.projeto.dono,
      id_participante: this.participante.id_participante,
      checked: "false"

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
              this.getSubTarefa(data);

              i++;
            }
          });
        } else {
          console.log("não tem tarefas");
        }
      });
  }

  deleteTarefa(tarefa) {

    this.db.database.ref('tarefas/' + tarefa.id).on("value", snapshot => {
      var rm = this.db.database.ref('tarefas/' + tarefa.id);
      rm.remove();
    });
    this.presentAlert("Tarefa excluida com sucesso!", "");

  }

  addSubTarefa(item, data) {

    console.log(data);
    var key = this.db.database.ref('subTarefas').push().key;
    this.db.database.ref('subTarefas/' + key).update({
      id: key,
      descricao: data.id_subTarefa,
      id_tarefa: item.id,
      id_projeto: item.id_projeto,
      id_participante: item.id_participante
    });
  }

  getSubTarefa(item) {

    let i = 0;
    this.db.database.ref('subTarefas').orderByChild('id_tarefa'). //Pega Sub - Tarefas
      equalTo(item.val().id).on("value", snapshot => {
        snapshot.forEach(data => {
          this.subTarefas[i] = data.val();
          i++;
        });
      })
    console.log(this.subTarefas);
  }

  getData() {
    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
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
            this.addSubTarefa(item, data);
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
