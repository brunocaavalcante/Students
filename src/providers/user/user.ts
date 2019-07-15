import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  find(email) {
    this.users = this.afs.collection('cadastro', ref => ref.where('email', '==', email)).valueChanges();
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
      if (condicion.sexo) query = query.where('sexo', '==', condicion.sexo != undefined ? condicion.sexo : "");
      if (condicion.faculdade) query = query.where('faculdade', '==', condicion.faculdade != undefined ? condicion.faculdade : "");
      if (condicion.curso) query = query.where('curso', '==', condicion.curso != undefined ? condicion.curso : "");
      if (condicion.campus) query = query.where('campus', '==', condicion.campus != undefined ? condicion.campus : "");
      return query;
    }).valueChanges();
    return this.items;
  }
}
