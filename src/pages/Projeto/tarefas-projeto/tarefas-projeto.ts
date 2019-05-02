import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';



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
  check: boolean;

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
      id_participante: this.participante.id_participante,
      checked: "false"

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
          let i = 0;
          snapshot.forEach(data => {
            if (data.val().id_participante == this.participante.id_participante) {
              this.list[i] = data.val();
              i++;
            }
          });
        } else {
          console.log("não tem tarefas");
        }
      });
  }

  getSubTarefa(item) {
    const listSub = [];
    this.db.database.ref('subTarefas').orderByChild('id_tarefa')
      .equalTo(item.id).on("value", snapshot => {
        if (snapshot) {
          let i = 0;
          snapshot.forEach(data => {

            listSub[i] = data.val();
            i++;
          });
          return listSub;
        }
      });
  }

  deleteTarefa(tarefa) {

    var rm = this.db.database.ref('tarefas/' + tarefa.id);
    rm.remove();
    this.getTarefa();
    this.presentAlert("Tarefa excluida com sucesso!", "");

  }

  getData() {
    var d = new Date;
    var dia = d.getDate();
    var mes = d.getUTCMonth();
    var ano = d.getFullYear();
    var data = "" + dia + "/" + mes + "/" + ano;
    return data;
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
            this.deleteTarefa(item);
          }
        }
      ]
    });
    alert.present();
  }

 /* <script>
  $(document).ready(function () {
    $('.html').animate({ width: '90%' }, 2000);

  });
</script>*/
  status(item){

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
