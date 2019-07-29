import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from 'ionic-angular';
import { SubtarefaProvider } from '../subtarefa/subtarefa';
import { ProjetoProvider } from '../projeto/projeto-provider';

@Injectable()
export class TarefaProvider {
  list = [];
  projeto;
  participante;
  item = [];
  constructor(
    public http: HttpClient,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public subtarefa: SubtarefaProvider) {
  }

  get(projeto, participante) {
    this.db.database.ref('tarefas').orderByChild('id_projeto') //Pega tarefas
      .equalTo(projeto.id).on("value", snapshot => {
        if (snapshot) {
          let i = 0;
          snapshot.forEach(data => {
            if (data.val().id_participante == participante.id_participante) { //verificando participante
              this.list[i] = data.val();
              i++;
            }
          });
          this.participante = participante;
          this.projeto = projeto;
        }
      });
    return this.list;
  }

  insert(tarefa) {
    this.db.database.ref('tarefas/' + tarefa.id).update(tarefa);
  }

  find(id) {
    this.db.database.ref('tarefas/' + id).once("value", snapshot => {
      var tarefa = snapshot.val();
      return tarefa;
    });
  }

  delete(tarefa) {

    this.db.database.ref('tarefas/' + tarefa.id).once("value", snapshot => {
      var rm_tarefa = this.db.database.ref('tarefas/' + tarefa.id);
      rm_tarefa.remove();
      this.list.pop();
    });
    this.presentAlert("Tarefa excluida com sucesso!", "");

  }

  deleteAll(id) {

    this.db.database.ref('tarefas').orderByChild('id_projeto')
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(data => {
          this.subtarefa.deleteAll(data.val().id);
          var rm_tarefa = this.db.database.ref('tarefas/' + data.val().id);
          rm_tarefa.remove();
          console.log("Tarefas removidas");
        });
      });
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
