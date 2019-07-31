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
    console.log(id_participante);
    this.projetoCollection.doc(id_participante).set(projeto);
    this.projetoCollection.doc(id_participante).update({ id_participante: id_participante });
    return id_participante;
  }

  update(id, projeto) {
    this.projetoCollection.doc(id).update(projeto);
  }

  delete(projeto) {
    this.projetoCollection.doc(projeto.id_participante).delete();
    this.tarefa.deleteAll(projeto.id);

  }

  get(email) {
    this.items = this.afs.collection('projetos', ref => ref.where('email', '==', email)).valueChanges();
    return this.items;
  }

  find(projeto) {
    this.items = this.afs.collection('projetos', ref => ref.where('id', '==', projeto.id)).valueChanges();
    return this.items;
  }

  deleteParticipante(id) {
    this.projetoCollection.doc(id).delete();
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
