import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SubtarefaProvider } from '../../../providers/subtarefa/subtarefa';
import { TarefaProvider } from '../../../providers/tarefa/tarefa';

@IonicPage()
@Component({
  selector: 'page-sub-tarefas',
  templateUrl: 'sub-tarefas.html',
})
export class SubTarefasPage {
  tarefa;
  t=[];
  titulo;
  descricao;
  user;
  check;
  list = [];

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public subtafera: SubtarefaProvider,
    public tf:TarefaProvider,
    public afAuth: AngularFireAuth) {

    this.tarefa = this.navParams.get('item');
    this.user = this.afAuth.auth.currentUser;//pega usuario logado
  }

  ionViewDidLoad() {
    this.tarefa = this.navParams.get('item');
    this.list = this.subtafera.get(this.tarefa);
  }

  insertSub(descricao, titulo) {

    var id = this.db.database.ref('subTarefas').push().key;
    var sub = {
      titulo: titulo,
      descricao: descricao,
      id: id,
      id_tarefa: this.tarefa.id,
      data: this.getData(),
      id_criador: this.user.email,
      checked: false
    }
    this.db.database.ref('tarefas/'+sub.id_tarefa).once("value",snapshot=>{
      var tarefa = snapshot.val();
      this.subtafera.insert(tarefa,sub);
    })
    this.titulo = "";
    this.descricao = "";


  }

  deleteSub(item) {
    this.db.database.ref('tarefas/'+item.id_tarefa).once("value",snapshot=>{
      var tarefa = snapshot.val();
      this.subtafera.delete(tarefa,item);
      this.list.pop();
    })    
  }

  updateCheck(item) {
    this.db.database.ref('tarefas/'+item.id_tarefa).once("value",snapshot=>{
      var tarefa = snapshot.val();
      this.subtafera.updateCheck(tarefa,item);
    }) 
  }

  presentShowConfirm(item) {

    const alert = this.alertCtrl.create({
      title: "Excluir a Terefa?",
      message: "",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Excluir',
          role: 'excluir',
          handler: () => {
            this.deleteSub(item);
          }
        }
      ]
    });
    alert.present();
  }

  getData() {

    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
  }

}
