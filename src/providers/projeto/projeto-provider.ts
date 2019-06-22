import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { TarefaProvider } from '../tarefa/tarefa';


@Injectable()
export class ProjetoProvider {
  items: Observable<any>;
  itemsRef: AngularFireList<any>;
  constructor(
    public http: HttpClient,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    public tarefa: TarefaProvider) {
  }

  insert(projeto){
    this.db.database.ref('projetos').push(projeto);
  }

  delete(id: string) {

    this.db.database.ref('projetos').orderByChild("id")
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(item => {
          this.tarefa.deleteAll(id);
          var rv = this.db.database.ref('projetos/' + item.key);
          rv.remove();
        });

      });
    this.presentAlert("Projeto Excluido", "Projeto excluido com sucesso!");

  }

  get(email) {
    this.itemsRef = this.db.list('projetos', ref => ref.orderByChild('id_participante').equalTo(email));
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.items;
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
