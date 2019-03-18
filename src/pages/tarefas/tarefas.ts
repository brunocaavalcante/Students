import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding, Segment } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { TarefasProjetoPage } from '../tarefas-projeto/tarefas-projeto';


@IonicPage()
@Component({
  selector: 'page-tarefas',
  templateUrl: 'tarefas.html',
})
export class TarefasPage {

  uid: string;
  tarefa;
  descricao;
  participantes = [];
  p = [];
  porcent;
  list;
  projeto;
  @ViewChild(Segment) segment: Segment;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,//Variavel banco de dados local do app sqlite
    public db: AngularFireDatabase, //Banco de dados Firebase
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public afAuth: AngularFireAuth

  ) {
    this.projeto = this.navParams.get('projeto');
    this.getParticipantes();
  }

  ionViewDidLoad() {
    const user = this.afAuth.auth.currentUser;//pega usuario logado
    this.uid = user.uid;
    this.segment.value = 'sobre';
    this.getParticipantes();
    this.closeMenu();

  }


  addTarefa(tarefa, descricao, porcent: string) {
    this.db.database.ref(this.uid).child('tarefas').push({
      tarefa: tarefa,
      descricao: descricao,
      porcent: porcent
    })
      .then(() => {
        this.presentAlert("Tarefa Cadastrada", "");
        this.limpar();
      })
  }

  getParticipantes() {
    //Pegando email de participantes do projeto
    this.db.database.ref('projetos').orderByChild('id')
      .equalTo(this.projeto.id).on("value", snapshot => {
        snapshot.forEach(item => {
          var id = item.child("id_participante").val();
          this.participantes.push({ email: id });
        });
      })

    //Pegando os dados dos participantes
    for (let i = 0; i < this.participantes.length; i++) {

      this.db.database.ref('cadastro').orderByChild('email')
        .equalTo(this.participantes[i].email).once("value", snapshot => {
          var item = snapshot.val();
          this.p = Object.keys(item).map(i => item[i]);
          console.log(this.p);
        });
    }

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

  //Fução fecha menu lateral do app
  closeMenu() {
    this.menuCtrl.close();
  }

  goToTarefas() {
    var p = this.projeto;
    this.navCtrl.push(TarefasProjetoPage,{ p });
  }



}
