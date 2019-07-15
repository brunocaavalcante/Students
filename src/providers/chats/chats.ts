import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable()
export class ChatsProvider {
  private chatsCollection: AngularFirestoreCollection<any>;

  items: Observable<any>;

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore) {
    this.chatsCollection = this.afs.collection<any>('chats');
  }
  insert(chat, id_1, id_2) {
    var str: string = 'chats/' + id_1 + '/messages/' + id_2;
    this.afs.doc(str).set(chat);
  }

  /*update(id, projeto) {
    console.log(id);
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

  */
  find(id_1, id_2) {
    this.items = this.afs.collection('chats/' + id_1 + "/messages/" + id_2).valueChanges();
    return this.items;
  }

  chatsUser(id_1) {
    this.items = this.afs.collection('chats/' + id_1 + "/messages").valueChanges();
    return this.items;
  }
  /*
    deleteParticipante(id) {
      this.projetoCollection.doc(id).delete();
    }
  */

}
