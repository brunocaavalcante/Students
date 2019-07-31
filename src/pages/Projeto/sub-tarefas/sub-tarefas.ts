import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SubtarefaProvider } from '../../../providers/subtarefa/subtarefa';
import { TarefaProvider } from '../../../providers/tarefa/tarefa';
import { Observable } from 'rxjs';

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
  list: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public subtafera: SubtarefaProvider,
    public tf: TarefaProvider,
    public afAuth: AngularFireAuth) {

    this.tarefa = this.navParams.get('item');
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
  }

  ionViewDidLoad() {
    this.tarefa = this.navParams.get('item');
    this.list = this.subtafera.get(this.tarefa);
  }

  insertSub(descricao, titulo) {

    var sub = {
      titulo: titulo,
      descricao: descricao,
      id_tarefa: this.tarefa.id,
      data: this.getData(),
      id_criador: this.user.email,
      checked: false
    }
    this.updatePercent(sub, 1, "insert");
    this.subtafera.insert(sub);
    this.titulo = "";
    this.descricao = "";


  }

  deleteSub(item) {
    this.updatePercent(item, -1, "delete");
    this.subtafera.delete(item);

  }

  updateCheck(item) {
    this.subtafera.update(item);
    this.updatePercent(item, 1, "check");
  }

  updatePercent(item, n, op) {

    switch (op) {
      case "insert": {
        this.tarefa.qtd_sub = this.tarefa.qtd_sub + n;
        break;
      }
      case "delete": {
        if (item.checked == true) {
          this.tarefa.qtd_sub_ok = this.tarefa.qtd_sub_ok + n;
          this.tarefa.qtd_sub = this.tarefa.qtd_sub + n;
        } else {
          this.tarefa.qtd_sub = this.tarefa.qtd_sub + n;
        }
        break;
      }
      case "check": {
        if (item.checked == true) {
          this.tarefa.qtd_sub_ok = this.tarefa.qtd_sub_ok + n;
        } else {
          this.tarefa.qtd_sub_ok = this.tarefa.qtd_sub_ok - n;
        }
        break;
      }
    }
    this.tarefa.status = (this.tarefa.qtd_sub_ok / this.tarefa.qtd_sub) * 100
    this.tf.update(this.tarefa);
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
            this.deleteSub(item);
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
