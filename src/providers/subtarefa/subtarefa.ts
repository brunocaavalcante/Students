import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class SubtarefaProvider {

  check;
  tarefa;
  tarefaCollection: AngularFirestoreCollection<any>;
  list: Observable<any>;
  constructor(
    public http: HttpClient,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public afs: AngularFirestore,
    public alertCtrl: AlertController) {
    this.tarefaCollection = this.afs.collection<any>('tarefas');
  }

  insert(sub) {
    const id = this.afs.createId();
    this.afs.doc("subTarefas/" + id).set(sub);
    this.afs.doc("subTarefas/" + id).update({ id: id });
  }

  get(tarefa) {
    this.list = this.afs.collection("subTarefas", ref => ref.where('id_tarefa', "==", tarefa.id)).valueChanges();
    return this.list;
  }

  delete(sub) {
    this.afs.collection("subTarefas").doc(sub.id).delete();
    this.presentAlert("Tarefa excluida com sucesso!", "");
  }

  update(sub){
    this.afs.collection("subTarefas").doc(sub.id).update(sub);
  }
  
  deleteAll(id) {

    this.afs.collection("subTarefas", ref => ref.where("id_tarefa", "==", id)).valueChanges()
      .subscribe(item => {
        var itens = Object.keys(item).map(i => item[i]);
        itens.forEach(data => {
          this.afs.doc("subTarefas/" + data.id).delete();
        });
      });
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
