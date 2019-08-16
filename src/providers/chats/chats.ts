import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';



@Injectable()
export class ChatsProvider {

  items: Observable<any>;
  tem: boolean;

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore) {
  }

  addUserToGroup(grupo, user) {
    this.afs.collection('chats').doc(user.id).collection('grupos').doc(grupo.id).set({ id: grupo.id });
    this.afs.collection('grupos-chats').doc(grupo.id).collection('participantes').doc(user.id).set({
      id: user.id,
      email: user.email
    });
  }

  addContato(id, item) {
    this.afs.collection('chats').doc(id).collection('contatos').doc(item.id).set(item);
  }

  chatsUser(id_1) {
    this.items = this.afs.collection('chats/' + id_1 + "/messages", ref => ref.orderBy('timestamp', 'desc').limit(30)).valueChanges();
    return this.items;
  }

  deleteGrupo(item) {
    this.afs.collection("grupos-chats").doc(item.id).delete();
    this.afs.collection("grupos-chats").doc(item.id).collection('participantes')
      .valueChanges().subscribe(itens => {
        itens.forEach(i => {
          this.afs.collection("grupos-chats").doc(item.id).collection('participantes').doc(i.id).delete();
        });
      });
  }

  deleteChats(uid, ref, id) {
    this.afs.collection('chats').doc(uid).collection(ref).doc(id).delete();
  }

  deleteMessages(id, msg) {
    console.log(id, msg);
    this.afs.collection('messages').doc(id).collection("msg").doc(msg).delete();
  }

  filter(colecao: string, ordem: string, start, end) {
    return this.afs.collection(colecao, ref =>
      ref.orderBy(ordem).startAt(start).endAt(end)).valueChanges();
  }

  findChat(id_1, id_2) {
    this.items = this.afs.collection('chats').doc(id_1).collection('messages').doc(id_2).valueChanges();
    return this.items;
  }

  findGrupo(id) {
    this.items = this.afs.collection('grupos-chats').doc(id).valueChanges();
    return this.items;
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

  getMessagesGrupo(id) {
    this.items = this.afs.collection('messages/' + id + "/msg", ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.orderBy('timestamp', 'desc').limit(25);
      return query;
    }).valueChanges();
    return this.items;
  }

  getGrupos(id) {
    this.items = this.afs.collection('chats').doc(id).collection('grupos').valueChanges();
    return this.items;
  }

  getParticipantes(item) {
    this.items = this.afs.collection('grupos-chats').doc(item.id).collection('participantes').valueChanges();
    return this.items;
  }

  insertChat(chat, id_1, id_2) {
    this.afs.collection('chats').doc(id_1).collection('messages').doc(id_2).set(chat);
  }

  insertMessages(ref, item) {
    item.id = this.afs.createId();
    this.afs.doc('messages/' + ref).collection('msg').doc(item.id).set(item);
  }

  insertGrup(grupo) {
    let ref = this.afs.collection('grupos-chats').doc(grupo.id);
    ref.set(grupo);
  }

  updateGrup(item) {
    this.afs.collection('grupos-chats').doc(item.id).update(item);
  }

}
