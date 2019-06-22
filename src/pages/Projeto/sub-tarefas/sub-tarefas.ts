import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SubtarefaProvider } from '../../../providers/subtarefa/subtarefa';

@IonicPage()
@Component({
  selector: 'page-sub-tarefas',
  templateUrl: 'sub-tarefas.html',
})
export class SubTarefasPage {
  tarefa;
  titulo;
  descricao;
  user;
  check;
  list = [];

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public subtafera: SubtarefaProvider,
    public afAuth: AngularFireAuth) {

    this.tarefa = this.navParams.get('item');
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
  }

  ionViewDidLoad() {
    this.list = this.subtafera.get(this.tarefa);
  }

  insertSub(descricao, titulo) {

    var id = this.db.database.ref('subTarefas').push().key;
    var sub = ({
      titulo: titulo,
      descricao: descricao,
      id_subTarefa: id,
      id_tarefa: this.tarefa.id,
      data: this.getData(),
      id_criador: this.user.email,
      checked: "false"

    })
    this.subtafera.insert(sub);
    this.titulo = "";
    this.descricao = "";


  }

  deleteSub(item) {
    this.subtafera.delete(item);
  }

  updateCheck(item) {
    this.subtafera.updateCheck(item);
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
            this.subtafera.delete(item);
          }
        }
      ]
    });
    alert.present();
  }

  getData() {

    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
  }

}
