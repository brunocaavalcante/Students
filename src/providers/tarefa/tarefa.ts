import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SubtarefaProvider } from '../subtarefa/subtarefa';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class TarefaProvider {
  list = [];
  projeto;
  participante;
  item = [];
  private tarefaCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  constructor(
    public http: HttpClient,
    public alertCtrl: AlertController,
    public subtarefa: SubtarefaProvider,
    private afs: AngularFirestore) {
    this.tarefaCollection = this.afs.collection<any>('tarefas');
  }

  get(projeto, participante) {

    this.items = this.afs.collection('tarefas', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.where('id_projeto', '==', projeto.id);
      query = query.where('id_participante', '==', participante.id_participante);
      return query;
    }).valueChanges();

    return this.items;
  }

  insert(tarefa) {
    //this.db.database.ref('tarefas/' + tarefa.id).update(tarefa);
    const id = this.afs.createId();
    this.tarefaCollection.doc(id).set(tarefa);
    this.tarefaCollection.doc(id).update({ id: id });
  }

  find(id) {
    this.items = this.afs.collection('tarefas', ref => ref.where('id', '==', id)).valueChanges();
    return this.items;
  }

  delete(tarefa) {
    this.tarefaCollection.doc(tarefa.id).delete();
    this.list.pop();
    this.presentAlert("Tarefa excluida com sucesso!", "");

  }

  update(tarefa) {
    this.tarefaCollection.doc(tarefa.id).update(tarefa);
  }

  deleteAll(id) {
    this.afs.collection('tarefas', ref => ref.where("id_projeto", "==", id)).valueChanges()
      .subscribe(item => {
        var itens = Object.keys(item).map(i => item[i]);
        itens.forEach(data => {
          this.subtarefa.deleteAll(data.id);
          this.tarefaCollection.doc(data.id).delete();
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
