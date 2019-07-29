import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { SubTarefasPage } from '../sub-tarefas/sub-tarefas';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TarefaProvider } from '../../../providers/tarefa/tarefa';



@IonicPage()
@Injectable()
@Component({
  selector: 'page-tarefas-projeto',
  templateUrl: 'tarefas-projeto.html',

})
export class TarefasProjetoPage {

  uid: string;
  nome;
  descricao;
  participante;
  id_dono;
  list = [];
  subTarefas = [];
  projeto;
  check: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public tarefa: TarefaProvider,
    public afAuth: AngularFireAuth) {

    this.projeto = this.navParams.get('p');
    this.participante = this.navParams.get('participante');
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.list = this.tarefa.get(this.projeto, this.participante);
  }

  ionViewDidLoad() {

  }

  addTarefa(descricao, nome, status) {
    var id = this.db.database.ref('tarefas').push().key;
    var tf = ({
      tarefa: nome,
      descricao: descricao,
      status: status,
      id: id,
      data: this.getData(),
      observacao: "",
      qtd_sub: 0,
      qtd_sub_ok: 0,
      id_projeto: this.projeto.id,
      id_criador: this.projeto.dono!=null?this.projeto.dono:"",
      id_participante: this.participante.id_participante
    })
    this.tarefa.insert(tf);
    this.nome = "";
    this.descricao = "";
    this.ionViewDidLoad();
  }

  deleteAll(id) {

    this.db.database.ref('tarefas').orderByChild('id_projeto')
      .equalTo(id).on("value", snapshot => {
        snapshot.forEach(data => {
          var rm_tarefa = this.db.database.ref('tarefas/' + data.val().key);
          rm_tarefa.remove();
          console.log("Tarefas removidas");
        });
      });
  }

  goToSubTarefas(item) {
    this.navCtrl.push(SubTarefasPage, { item });
  }

  updateCheck(item) {
    this.check = item.checked;
    this.db.database.ref('tarefas/' + item.id).update({ checked: this.check });
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
            this.tarefa.delete(item);
          }
        }
      ]
    });
    alert.present();
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

  getData() {

    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
  }


}
