import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class SubtarefaProvider {
  list = [];
  check;
  tarefa;
  constructor(
    public http: HttpClient,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController) {
    console.log('Hello SubtarefaProvider Provider');
  }

  insert(sub) {

    this.updateQtd(this.qtdSub(), 1);
    this.updatePercentual(this.qtdSub(), this.qtdSubOk());
    this.db.database.ref('subTarefas/' + sub.id).update(sub)
      .then(() => {
        this.presentAlert("SubTarefa Cadastrada", "");
      })
  }

  get(tarefa) {

    this.db.database.ref('subTarefas').orderByChild('id_tarefa') //Pega tarefas
      .equalTo(tarefa.id).on("value", snapshot => {
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
    this.tarefa = tarefa;
    return this.list;
  }

  delete(item) {

    //Atualiza a quantidade de subTarefas no nó de Tarefa
    this.updateQtd(this.qtdSub(), -1);
    //Exclui do nó de subTarefa
    this.db.database.ref('subTarefas/' + item.id_subTarefa).on("value", snapshot => {
      var rm = this.db.database.ref('subTarefas/' + item.id_subTarefa);
      rm.remove().then(() => {
        this.list.pop();
      })
    })
    //Atualiza barra de status
    this.updatePercentual(this.qtdSub(), this.qtdSubOk());
    this.presentAlert("Tarefa excluida com sucesso!", "");
  }

  deleteAll(id) {
    this.db.database.ref('subTarefas').orderByChild('id_tarefa')
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(data => {
          var rm = this.db.database.ref('subTarefas/' + data.val().id_subTarefa);
          rm.remove();
        });
      });
    console.log("subtarefas removidas");
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

  updatePercentual(total, ok) {
    var percent = (ok / total) * 100;
    this.db.database.ref('tarefas/' + this.tarefa.id).update({ status: percent });
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

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }


}
