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

  insertGrup(grupo){
    this.afs.collection('grupos-chats').doc(grupo.id).set(grupo);
  }

  addContato(id, item) {
    this.afs.collection('chats').doc(id).collection('contatos').doc(item.id).set(item);
  }

  getContatos(id) {
    this.items = this.afs.collection('chats').doc(id).collection('contatos', ref => ref.limit(30)).valueChanges();
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

  getGrupos(id){
    this.items = this.afs.collection('chats').doc(id).collection('grupos').valueChanges();
    return this.items;
  }

  filter(colecao: string, ordem: string, start, end) {
    return this.afs.collection(colecao, ref =>
      ref.orderBy(ordem).startAt(start).endAt(end)).valueChanges();
  }

  findChat(id_1, id_2) {
    this.items = this.afs.collection('chats').doc(id_1).collection('messages').doc(id_2).valueChanges();
    return this.items;
  }
  
  findGrupo(id){
    this.items = this.afs.collection('grupos-chats').doc(id).valueChanges();
    return this.items;
   }
 
  chatsUser(id_1) {
    this.items = this.afs.collection('chats/' + id_1 + "/messages", ref => ref.orderBy('timestamp', 'desc').limit(30)).valueChanges();
    return this.items;
  }

  addUserToGroup(grupo,id_user) {
    console.log(grupo.id," - "+id_user)
    this.afs.collection('chats').doc(id_user).collection('grupos').doc(grupo.id).set({id:grupo.id});  
  }
}
