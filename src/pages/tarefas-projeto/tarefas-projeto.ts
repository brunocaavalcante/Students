import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

/**
 * Generated class for the TarefasProjetoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tarefas-projeto',
  templateUrl: 'tarefas-projeto.html',
})
export class TarefasProjetoPage {

  uid: string;
  tarefa;
  descricao;
  porcent;
  list;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.getTarefa();
  }

  addTarefa(tarefa, descricao, porcent: string) {
    this.db.database.ref(this.uid).child('projetos').push({
      tarefa: tarefa,
      descricao: descricao,
      porcent: porcent
     
    })
      .then(() => {
        this.presentAlert("Tarefa Cadastrada", "");
        this.limpar();
        console.log(this.db.database.ref(this.uid).child('projetos').push().key);

      })
  }

  getTarefa(){
    let listDB = this.db.database.ref(this.uid).child('tarefas');

    listDB.on('value',(snapshot)=>{ //para on escuta qualquer alteração no banco de dados e grava na variavel snapshot 
      const items = snapshot.val(); //recebendo o valor da snapshot
      
      if(items){ //verificando se existe items
        this.list = Object.keys(items).map(i => items[i]);//Função atribui cada objeto retornado do banco na variavel list
        console.log(this.list.key);
      }
    })
    
  }
  
  //Função para limpar inputs após insert/update
  limpar() {
    this.tarefa = "";
    this.descricao = "";
  }

  //Função para apresenta alertas
  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
