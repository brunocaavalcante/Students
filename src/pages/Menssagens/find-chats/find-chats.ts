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
items: Observable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    private usuario:UserProvider,
    private afs: AngularFirestore
    ) {
      this.items = this.afs.collection('cadastro').valueChanges();
      //this.items = this.itemsCollection.snapshotChanges();
  }

  ionViewDidLoad() {
    this.condicao = this.navParams.get('p');
    this.get();
    console.log(this.users);
  }

  public get(){
    this.users = this.usuario.list();
  }
  //citiesRef.where("state", "==", "CA").where("population", ">", 1000000)

}
