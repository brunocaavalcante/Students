import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class UserProvider {

  users: Observable<any>;
  lista: AngularFireList<any>;
  ref: AngularFireObject<any>;
  item: Observable<any>;
  items;

  constructor(
    public http: HttpClient,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase, ) {
    this.ref = db.object('cadastro');
  }

  find(email) {
    this.lista = this.db.list('cadastro', ref => ref.orderByChild('email').equalTo(email).limitToFirst(1));
    this.users = this.lista.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.users;
  }

  list() {
    this.lista = this.db.list('cadastro');
    // Use snapshotChanges().map() to store the key
    this.users = this.lista.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.users;
  }

  insert(id,user) {
    
    const ref = this.db.database.ref('cadastro/' + id)
    ref.set({
      campus: user.campus == null ? "" : user.campus,
      curso: user.curso == null ? "" : user.curso,
      data_nasc: user.data_nasc == null ? "" : user.data_nasc,
      email: user.email == null ? "" : user.email,
      faculdade: user.faculdade == null ? "" : user.faculdade,
      id: id == null ? "" : id,
      nome: user.nome == null ? "" : user.nome,
      password: user.password == null ? "" : user.password,
      semestre: user.semestre == null ? "" : user.semestre,
      sexo: user.sexo == null ? "" : user.sexo,
      situacao: user.situacao == null ? "" : user.situacao,
      sobrenome: user.sobrenome == null ? "" : user.sobrenome
    });
  }

  update(id,user) {
    console.log(id);
    this.db.database.ref('cadastro/'+id).update(user);
  }

  delete(user) {
    this.ref = this.db.object('cadastro/' + user.id);
    this.ref.remove();
  }
}
