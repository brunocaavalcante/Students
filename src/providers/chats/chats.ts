import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable()
export class ChatsProvider {

  items: Observable<any>;
  tem: boolean;

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore) {
  }

  insertChat(chat, id_1, id_2) {
    this.afs.collection('chats').doc(id_1).collection('messages').doc(id_2).set(chat);
  }

  insertMessages(ref, item) {
    this.afs.doc('messages/' + ref).collection('msg').add(item);
  }

  addContato(id, item) {
    this.afs.collection('chats').doc(id).collection('contatos').doc(item.id).set(item);
  }

  getContatos(id) {
    this.items = this.afs.collection('chats').doc(id).collection('contatos',ref=>ref.limit(30)).valueChanges();
    return this.items;
  }

  getMessages(id_1, id_2) {
    this.items = this.afs.collection('messages/' + id_1 + " - " + id_2 + "/msg", ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.orderBy('timestamp', 'desc').limit(25);
      return query;
    }).valueChanges();
    return this.items;
  }

  filter(colecao:string,ordem:string,start,end){
    return this.afs.collection(colecao, ref=>
      ref.orderBy(ordem).startAt(start).endAt(end)).valueChanges();
  }

  findChat(id_1, id_2) {
    this.items = this.afs.collection('chats').doc(id_1).collection('messages').doc(id_2).valueChanges();
    return this.items;
  }

  chatsUser(id_1) {
    this.items = this.afs.collection('chats/' + id_1 + "/messages", ref => ref.orderBy('timestamp', 'desc').limit(30)).valueChanges();
    return this.items;
  }

  createGroup(item){
    const id = this.afs.createId();
    this.afs.collection('chats').doc(item.id).collection('grupos').doc(id).set(id);
  }
}
