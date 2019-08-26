import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { TarefaProvider } from '../tarefa/tarefa';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable()
export class ProjetoProvider {
  items: Observable<any>;
  itemsRef: AngularFireList<any>;
  private projetoCollection: AngularFirestoreCollection<any>;

  constructor(
    public http: HttpClient,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    private afs: AngularFirestore,
    public tarefa: TarefaProvider) {
    this.projetoCollection = this.afs.collection<any>('projetos');
  }

  insert(projeto) {
    const id_participante = this.afs.createId();
    this.projetoCollection.doc(id_participante).set(projeto);
    this.projetoCollection.doc(id_participante).update({ id_participante: id_participante });
    return id_participante;
  }

  insertDespesas(despesa) {
    despesa.id = this.afs.createId();
    this.afs.collection("despesas").doc(despesa.id_projeto).collection('despesa').doc(despesa.id).set(despesa);
    this.presentAlert("Despesa Cadastrada", "");
  }

  update(id, projeto) {
    this.projetoCollection.doc(id).update(projeto);
  }

  updateDespesa(item) {
    this.afs.collection("despesas").doc(item.id_projeto).collection("despesa").doc(item.id).update(item);
    this.presentAlert("Despesa Alterada!", "");
  }

  delete(projeto) {
    this.projetoCollection.doc(projeto.id_participante).delete();
    this.tarefa.deleteAll(projeto.id);
  }

  get(condicion) {
    this.items = this.afs.collection('projetos', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (condicion.email) query = query.where('email', '==', condicion.email || "");
      if (condicion.situacao) query = query.where('situacao', '==', condicion.situacao || "");
      return query;
    }).valueChanges();
    return this.items;
  }

  getDespesas(id) {
    this.items = this.afs.collection('despesas').doc(id).collection('despesa').valueChanges();
    return this.items;
  }

  find(projeto) {
    this.items = this.afs.collection('projetos', ref => ref.where('id', '==', projeto.id)).valueChanges();
    return this.items;
  }

  deleteParticipante(id) {
    this.projetoCollection.doc(id).delete();
    this.presentAlert("Participante excluido com sucesso!", "");
  }

  deleteDespesa(item) {
    this.afs.collection('despesas').doc(item.id_projeto).collection('despesa').doc(item.id).delete();
    this.presentAlert("Despesa Excluida", "A despesa foi excluida com sucesso!");
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

  presentShowConfirm(item, title, msg, op) {
    const alert = this.alertCtrl.create({
      title: title,
      message: msg,
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
            switch (op) {
              case "despesas": { this.deleteDespesa(item); break; }
              case "participante": { this.deleteParticipante(item.id); break; }
            }
            return true;
          }
        }
      ]
    });
    alert.present();
  }

}
