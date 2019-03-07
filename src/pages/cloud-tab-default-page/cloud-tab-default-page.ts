import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'page-cloud-tab-default-page',
  templateUrl: 'cloud-tab-default-page.html'
})
export class CloudTabDefaultPagePage {

  uid: string;
  list;
  disable: string;
  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {
      this.getUser();
  }

  getUser(){
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    let listDB = this.db.database.ref(this.uid).child("cadastro");

    listDB.on('value',(snapshot)=>{ //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
      const items = snapshot.val(); //recebendo o valor da snapshot

      if(items){ //verificando se existe items
        this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
      }
    })
    
  }
  ionViewCanEnter() {
   
    this.disable = "1";
    this.getUser();
  }

  ativeCad(){
    this.disable = "2";
  }

  updateCad(){
    this.disable = "1";
  }
  
}
