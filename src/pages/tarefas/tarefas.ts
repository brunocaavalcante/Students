import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { MenuController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-tarefas',
  templateUrl: 'tarefas.html',
})
export class TarefasPage {

  uid: string;
  tarefa;
  descricao;
  porcent;
  list;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage:Storage,//Variavel banco de dados local do app sqlite
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController
    ) {
  }

  ionViewDidLoad() {
  this.storage.get('user')
  .then((resolve)=>{
    this.uid = resolve; //Recebendo id do usuario do storage
    this.getTarefa();
    this.closeMenu();
  })
  }

  addTarefa(tarefa,descricao,porcent: string){
    this.db.database.ref('tarefas').child(this.uid).push({
      tarefa:tarefa,
      descricao:descricao,
      porcent:porcent
    })
    .then(()=>{
         this.presentAlert("Tarefa Cadastrada","");
         this.limpar();         
    })
  }

  getTarefa(){
    let listDB = this.db.database.ref('tarefas').child(this.uid);

    listDB.on('value',(snapshot)=>{ //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
      const items = snapshot.val(); //recebendo o valor da snapshot
      console.log(items);
      if(items){ //verificando se existe items
        this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
      }
    })
    
  }

  limpar(){
    this.tarefa = "";
    this.descricao = "";
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  closeMenu() {
    this.menuCtrl.close();
  }
  

}
