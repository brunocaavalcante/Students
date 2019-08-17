import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable()
export class UserProvider {

  users: Observable<any>;
  lista: AngularFireList<any>;
  ref: AngularFireObject<any>;
  item: Observable<any>;
  private userCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  constructor(
    public http: HttpClient,
    public alertCtrl: AlertController,
    private afs: AngularFirestore) {
    this.userCollection = this.afs.collection<any>('cadastro');
  }

  find(campo: string, value) {
    this.users = this.afs.collection('cadastro', ref => ref.where(campo, '==', value)).valueChanges();
    return this.users;
  }

  list() {
    this.users = this.userCollection.valueChanges();
    return this.users;
  }

  insert(id, user) {
    this.userCollection.doc(id).set(user);
    this.userCollection.doc(id).update({ id: id });
  }

  update(id, user) {
    this.userCollection.doc(id).update(user);
  }

  delete(user) {
    this.userCollection.doc(user.id).delete();
  }

  listCondicion(condicion) {

    this.items = this.afs.collection('cadastro', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (condicion.sexo) query = query.where('sexo', '==', condicion.sexo || "");
      if (condicion.faculdade) query = query.where('faculdade', '==', condicion.faculdade || "");
      if (condicion.curso) query = query.where('curso', '==', condicion.curso || "");
      if (condicion.campus) query = query.where('campus', '==', condicion.campus || "");
      return query;
    }).valueChanges();
    return this.items;
  }
}
