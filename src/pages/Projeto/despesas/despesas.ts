import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


@IonicPage()
@Component({
  selector: 'page-despesas',
  templateUrl: 'despesas.html',
})
export class DespesasPage {

  projeto;
  list=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase//Banco de dados Firebase
  ) {
    this.projeto = this.navParams.get('projeto');
    this.getDespesas();
  }
  insertDespesa(item) {
    var id = this.db.database.ref('despesas').push().key;
    this.db.database.ref('despesas/' + id).update({
      id_despesa: id,
      titulo: item.titulo,
      descricao: item.descricao,
      valor: item.valor,
      vencimento: item.vencimento,
      // prioridade: item.prioridade,
      id_projeto: this.projeto.id,
      id_criador: this.afAuth.auth.currentUser.email,
      checked: "false"
    })
      .then(() => {
        this.presentAlert("Despesa Cadastrada", "");
        this.ionViewDidLoad();
      })
  }

  getDespesas() {

    this.db.database.ref('despesas').orderByChild('id_projeto') //Pega tarefas
      .equalTo(this.projeto.id).on("value", snapshot => {
        console.log(this.projeto.id);
        console.log(snapshot.val());
        if (snapshot) {
          let i = 0;

          snapshot.forEach(data => {
            this.list[i] = data.val();
            i++;
          });
        } else {
          console.log("não tem despesas");
        }
      });
  }

  presentInsertDespesa() {

    let alert = this.alertCtrl.create({
      title: 'Nova Despesa',
      inputs: [
        {
          name: 'titulo',
          placeholder: 'Despesa',
          type: 'text',
          value: ""
        },
        {
          name: 'descricao',
          placeholder: 'Descrição da despesa',
          type: 'text',
          value: ""
        },
        {
          name: 'vencimento',
          label: 'Data de Vencimento',
          type: 'date',
          value: ""
        },
        {
          name: 'valor',
          label: 'Valor da despesa',
          placeholder: 'Digite o valor da despesa',
          type: 'number',
          value: ""
        }

      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Adicionar',
          handler: data => {

            this.insertDespesa(data);
          }
        }
      ]
    });
    alert.addInput({
      name: 'ck1',
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    })

    alert.present();
  }

  public presentAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {

  }

}
