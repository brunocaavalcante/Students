import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProjetoProvider } from '../../../providers/projeto/projeto-provider';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-despesas',
  templateUrl: 'despesas.html',
})
export class DespesasPage {

  projeto;
  list = [];
  testCheckboxOpen;
  testCheckboxResult;
  items: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public pj: ProjetoProvider,
  ) {
    this.projeto = this.navParams.get('projeto');
    this.getDespesas();
  }

  insertDespesa(item) {
    item.id_projeto = this.projeto.id;
    item.id_criador = this.afAuth.auth.currentUser.email;
    item.checked = false;
    this.pj.insertDespesas(item);
    this.presentAlert("Despesa Cadastrada", "");
    this.ionViewDidLoad();
  }

  getDespesas() {
    this.items = this.pj.getDespesas(this.projeto.id);
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
