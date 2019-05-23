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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase//Banco de dados Firebase
  ) {
  }
  
  presentAddParticipante() {

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
          name: 'Valor',
          label: 'Valor da despesa',
          placeholder: 'Digite o valor da despesa',
          type: 'number',
          value: ""
        },

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
           

          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {

  }

}
