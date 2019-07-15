import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserProvider } from '../../../providers/user/user';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@IonicPage()
@Component({
  selector: 'page-find-chats',
  templateUrl: 'find-chats.html',
})
export class FindChatsPage {
  condicao;
  users: Observable<any>;
  private itemsCollection: AngularFirestoreCollection<any>;
  itens: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    private usuario: UserProvider,
    private afs: AngularFirestore
  ) {
    // this.items = this.afs.collection('cadastro').valueChanges();
  }

  ionViewDidLoad() {
    this.condicao = this.navParams.get('p');
    this.get();
  }

  public get() {
    this.itens = this.usuario.listCondicion(this.condicao)
  }

}
