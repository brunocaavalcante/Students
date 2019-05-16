import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

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
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth) {

    this.tarefa = this.navParams.get('item');
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
  }

  ionViewDidLoad() {
    this.getSub();
  }

  insertSub(descricao, titulo) {

    this.updateQtd(this.qtdSub(), 1);
    this.updatePercentual(this.qtdSub(), this.qtdSubOk());

    var id = this.db.database.ref('subTarefas').push().key;
    this.db.database.ref('subTarefas/' + id).update({

      titulo: titulo,
      descricao: descricao,
      id_subTarefa: id,
      id_tarefa: this.tarefa.id,
      data: this.getData(),
      id_criador: this.user.email,
      checked: "false"

    })
      .then(() => {
        this.presentAlert("SubTarefa Cadastrada", "");
        this.titulo = "";
        this.descricao = "";
        this.ionViewDidLoad();
      })
  }

  getSub() {

    this.db.database.ref('subTarefas').orderByChild('id_tarefa') //Pega tarefas
      .equalTo(this.tarefa.id).on("value", snapshot => {
        if (snapshot) {
          let i = 0;

          snapshot.forEach(data => {
            this.list[i] = data.val();
            i++;
          });
        } else {
          console.log("sub-tarefa não encontrada");
        }
      });
  }

  deleteSub(item) {

    //Atualiza a quantidade de subTarefas no nó de Tarefa
    this.updateQtd(this.qtdSub(), -1);
    //Exclui do nó de subTarefa
    this.db.database.ref('subTarefas/' + item.id_subTarefa).on("value", snapshot => {
      var rm = this.db.database.ref('subTarefas/' + item.id_subTarefa);
      rm.remove().then(() => {
        this.list.pop();
        this.ionViewDidLoad();
      })
    })
    //Atualiza barra de status
    this.updatePercentual(this.qtdSub(), this.qtdSubOk());

    this.presentAlert("Tarefa excluida com sucesso!", "");
  }

  qtdSub() {
    var qtd;

    this.db.database.ref('tarefas/' + this.tarefa.id).once("value", snapshot => {
      qtd = snapshot.val().qtd_sub;
    });
    return qtd;
  }

  qtdSubOk() {
    var qtd;
    this.db.database.ref('tarefas/' + this.tarefa.id).once("value", snapshot => {
      qtd = snapshot.val().qtd_sub_ok;
    });
    return qtd;
  }

  updateQtd(qtd, n) {

    if (qtd > 0 && n < 0) {
      this.db.database.ref('tarefas/' + this.tarefa.id).update({ qtd_sub: qtd + n });
    }
    if (n > 0) {
      this.db.database.ref('tarefas/' + this.tarefa.id).update({ qtd_sub: qtd + n });
    }

  }

  updateCheck(item) {

    this.check = item.checked;
    var ok;

    this.db.database.ref('subTarefas/' + item.id_subTarefa).update({ checked: this.check });

    ok = this.qtdSubOk();

    if (this.check == true) {
      this.db.database.ref('tarefas/' + this.tarefa.id).update({ qtd_sub_ok: ok + 1 });
    } else if (this.check == false && ok > 0) {
      this.db.database.ref('tarefas/' + this.tarefa.id).update({ qtd_sub_ok: ok - 1 });
    }
    this.updatePercentual(this.qtdSub(), this.qtdSubOk());

  }

  updatePercentual(total, ok) {
    var percent = (ok / total) * 100;
    this.db.database.ref('tarefas/' + this.tarefa.id).update({ status: percent });
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
