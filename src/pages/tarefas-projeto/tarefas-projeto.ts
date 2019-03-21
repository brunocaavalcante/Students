import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { TarefasPage } from '../tarefas/tarefas';



@IonicPage()
@Component({
  selector: 'page-tarefas-projeto',
  templateUrl: 'tarefas-projeto.html',
})
export class TarefasProjetoPage {

  uid: string;
  tarefa;
  participante;
  id_dono;
  list = [];
  projeto;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth) {

    this.projeto = this.navParams.get('p');
    this.participante = this.navParams.get('participante');
  }

  ionViewDidLoad() {
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.getTarefa();
  }

  addTarefa(descricao, tarefa, status) {
    var id = this.db.database.ref('tarefas').push().key;
    this.db.database.ref('tarefas/' + id).update({

      tarefa: tarefa,
      descricao: descricao,
      status: status,
      id: id,
      data: this.getData(),
      observacao: "",
      id_projeto: this.projeto.id,
      id_criador: this.projeto.dono,
      id_participante: this.participante.id_participante

    })
      .then(() => {
        this.presentAlert("Tarefa Cadastrada", "");
        this.ionViewDidLoad();
      })
  }

  getTarefa() {

    this.db.database.ref('tarefas').orderByChild('id_projeto')
      .equalTo(this.projeto.id).on("value", snapshot => {
        if (snapshot) {
          snapshot.forEach(data => {
            if (data.val().id_participante == this.participante.id_participante) {
              this.list.push( data.val());
            }
          });
        } else {
          console.log("não tem tarefas");
        }
      });
  }

  deleteTarefa(tarefa) {

    var rm = this.db.database.ref('tarefas/' + tarefa.id);
    rm.remove();
    this.presentAlert("Tarefa excluida com sucesso!", "");
    this.navCtrl.setRoot(TarefasPage);

  }

  getData() {
    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
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
            this.deleteTarefa(item);
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
}
