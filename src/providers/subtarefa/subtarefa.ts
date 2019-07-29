import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class SubtarefaProvider {

  check;
  tarefa;
  constructor(
    public http: HttpClient,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController) {
  }

  insert(tarefa, sub) {
    this.db.database.ref('subTarefas/' + sub.id).update(sub)
      .then(() => {
        this.updateQtd(tarefa, sub, 1);
        this.presentAlert("SubTarefa Cadastrada", "");
      })
  }

  get(tarefa) {
    var list = [];
    console.log(tarefa.id);
    this.db.database.ref('subTarefas').orderByChild('id_tarefa') //Pega tarefas
      .equalTo(tarefa.id).on("value", snapshot => {
        if (snapshot) {
          let i = 0;
          snapshot.forEach(data => {
            list[i] = data.val();
            i++;
          });
        } else {
          console.log("sub-tarefa não encontrada");
        }

      });
    return list;

  }

  delete(tarefa, sub) {
    //Atualiza a quantidade de subTarefas no nó de Tarefa
    this.updateQtd(tarefa, sub, -1);
    //Exclui do nó de subTarefa
    var rm = this.db.database.ref('subTarefas/' + sub.id);
    rm.remove().then(() => {
    })
    //Atualiza barra de status
    this.presentAlert("Tarefa excluida com sucesso!", "");
  }

  deleteAll(id) {
    this.db.database.ref('subTarefas').orderByChild('id_tarefa')
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(data => {
          var rm = this.db.database.ref('subTarefas/' + data.val().id);
          rm.remove();
        });
      });
    console.log("subtarefas removidas");
  }

  updateQtd(tarefa, sub, n) {

    var qtd = tarefa.qtd_sub;
    var qtd_ok = tarefa.qtd_sub_ok;

    if (tarefa.qtd_sub > 0 && n < 0 && sub.checked == true) {//exclusão de sub já marcadas
      this.db.database.ref('tarefas/' + tarefa.id).update({
        qtd_sub: qtd - 1,
        qtd_sub_ok: qtd_ok - 1
      });
      qtd = qtd - 1;
      qtd_ok = qtd_ok - 1;
    }
    else if (tarefa.qtd_sub > 0 && n < 0 && sub.checked == false) {
      this.db.database.ref('tarefas/' + tarefa.id).update({ qtd_sub: qtd - 1 })
      qtd = qtd - 1;
    }
    else if (n > 0) {
      this.db.database.ref('tarefas/' + tarefa.id).update({ qtd_sub: qtd + 1 });
      qtd = qtd + 1;
    }
    this.updatePercentual(tarefa, qtd, qtd_ok);

  }

  updatePercentual(tarefa, total, ok) {
    var percent = (ok / total) * 100;
    this.db.database.ref('tarefas/' + tarefa.id).update({ status: percent });
  }

  updateCheck(tarefa, item) {

    this.check = item.checked;
    var ok = tarefa.qtd_sub_ok;
    var qtd = tarefa.qtd_sub;

    this.db.database.ref('subTarefas/' + item.id).update({ checked: this.check });

    if (this.check == true) {
      this.db.database.ref('tarefas/' + tarefa.id).update({ qtd_sub_ok: ok + 1 });
      ok = ok + 1;
    } else if (this.check == false && ok > 0) {
      this.db.database.ref('tarefas/' + tarefa.id).update({ qtd_sub_ok: ok - 1 });
      ok = ok - 1;
    }
    this.updatePercentual(tarefa, qtd, ok);

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
